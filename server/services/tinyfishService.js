/**
 * TinyFish Enterprise Web Agents Service
 * Provides real web browsing and data extraction for travel planning
 */

const https = require('https');
const http = require('http');
const { config } = require('../config/appConfig');

// Use centralized config for rate limiting
const RATE_LIMIT = config.tinyfish;

// Request pool for concurrent browsing
class RequestPool {
  constructor(concurrency = RATE_LIMIT.concurrentRequests) {
    this.concurrency = concurrency;
    this.queue = [];
    this.running = 0;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;
    
    this.running++;
    const { fn, resolve, reject } = this.queue.shift();
    
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Token bucket for rate limiting
class TokenBucket {
  constructor(rate, capacity) {
    this.rate = rate; // tokens per second
    this.capacity = capacity;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  async consume(tokens = 1) {
    while (this.tokens < tokens) {
      this.refill();
      await this.sleep(100);
    }
    this.tokens -= tokens;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.rate);
    this.lastRefill = now;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class TinyFishClient {
  constructor(cfg = {}) {
    this.apiKey = cfg.apiKey || process.env.TINYFISH_API_KEY;
    this.baseUrl = cfg.baseUrl || config.tinyfish.baseUrl;
    this.timeout = cfg.timeout || config.tinyfish.timeout;
    
    // Rate limiters - use config values
    this.minuteBucket = new TokenBucket(RATE_LIMIT.requestsPerMinute / 60, RATE_LIMIT.requestsPerMinute);
    this.hourBucket = new TokenBucket(RATE_LIMIT.requestsPerHour / 3600, RATE_LIMIT.requestsPerHour);
    
    // Request pool
    this.requestPool = new RequestPool(RATE_LIMIT.concurrentRequests);
    
    // Request cache
    this.cache = new Map();
    this.cacheTTL = cfg.cacheTTL || config.tinyfish.cacheTTL;
  }

  /**
   * Make HTTP request to TinyFish API
   */
  async request(endpoint, options = {}) {
    // Apply rate limiting
    await this.minuteBucket.consume();
    await this.hourBucket.consume();

    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': 'CommuteGo/2.0',
        ...options.headers
      },
      timeout: this.timeout
    };

    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.request(url, requestOptions, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`TinyFish API error: ${res.statusCode} - ${parsed.message || 'Unknown error'}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse TinyFish response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  /**
   * Browse a URL using TinyFish web agent
   */
  async browse(url, instructions = '') {
    const cacheKey = `${url}:${instructions}`;
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const result = await this.request('/agents/browse', {
        method: 'POST',
        body: {
          url,
          instructions,
          options: {
            extract_structured_data: true,
            wait_for_selector: 'body',
            screenshot: false
          }
        }
      });

      // Cache result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`TinyFish browse error for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Execute multiple searches concurrently using request pool
   */
  async concurrentSearch(queries) {
    const results = await Promise.all(
      queries.map(query => 
        this.requestPool.add(() => this.browse(query.url, query.instructions))
      )
    );
    return results;
  }

  /**
   * Search multiple travel sites simultaneously
   */
  async multiSiteSearch(searchConfig) {
    const { origin, destination, date, mode } = searchConfig;
    
    const sites = this.getSearchSitesForMode(mode, origin, destination, date);
    
    const queries = sites.map(site => ({
      url: site.url,
      instructions: site.instructions
    }));

    return this.concurrentSearch(queries);
  }

  /**
   * Get search URLs based on transport mode and user location
   */
  getSearchSitesForMode(mode, origin, destination, date, location = 'US') {
    const sites = {
      flight: [
        {
          url: `https://www.google.com/flights?q=flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}`,
          instructions: `Extract all flight options with prices, airlines, departure times, duration, and number of stops. Return as JSON array.`
        },
        {
          url: `https://www.kayak.com/flights/${encodeURIComponent(origin)}-${encodeURIComponent(destination)}`,
          instructions: `Extract flight prices, airline names, departure/arrival times, flight duration, and stops. Return as JSON array.`
        },
        {
          url: `https://www.skyscanner.com/transport/flights-from/${encodeURIComponent(origin.toLowerCase())}/`,
          instructions: `Extract available flight routes and typical prices from ${origin} to ${destination}. Return as JSON.`
        }
      ],
      bus: [
        {
          url: `https://www.greyhound.com/bus-schedule?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`,
          instructions: `Extract bus departure times, arrival times, duration, prices, and bus company names. Return as JSON array.`
        },
        {
          url: `https://www.flixbus.com/search?departure_city=${encodeURIComponent(origin)}&arrival_city=${encodeURIComponent(destination)}`,
          instructions: `Extract bus options with departure times, arrival times, duration, prices, and any amenities. Return as JSON array.`
        },
        {
          url: `https://www.busbud.com/bus-from-${encodeURIComponent(origin.toLowerCase())}-to-${encodeURIComponent(destination.toLowerCase())}`,
          instructions: `Extract all bus options with prices, departure times, bus companies, and travel duration. Return as JSON array.`
        }
      ],
      train: [
        {
          url: `https://www.amtrak.com/routes/`,
          instructions: `Find train routes from ${origin} to ${destination}. Extract departure times, arrival times, duration, prices, and train types. Return as JSON array.`
        },
        {
          url: `https://www.amtrak.com/farefinder?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}`,
          instructions: `Extract train fare options, departure times, arrival times, duration, and price tiers. Return as JSON array.`
        },
        {
          url: `https://www.trainline.com/trains/${encodeURIComponent(origin)}/to/${encodeURIComponent(destination)}`,
          instructions: `Extract train options with times, duration, prices, and operators. Return as JSON array.`
        }
      ],
      rideshare: [
        {
          url: `https://www.uber.com/riders/`,
          instructions: `Get estimated prices for rides from ${origin} to ${destination}. Extract ride types (UberX, Uber Black, etc.), estimated prices, and pickup times.`
        },
        {
          url: `https://www.lyft.com/rider/${origin}`,
          instructions: `Get fare estimates from ${origin} to ${destination}. Extract Lyft ride types, prices, and ETA. Return as JSON.`
        }
      ]
    };

    // Return mode-specific sites or all if mode not specified
    if (mode && sites[mode]) {
      return sites[mode];
    }
    
    // Return all sites for comprehensive search
    return Object.values(sites).flat();
  }

  /**
   * Monitor price changes over time
   */
  async monitorPrices(searchConfig, intervalMs = 300000) {
    const prices = [];
    
    const collectPrices = async () => {
      try {
        const results = await this.multiSiteSearch(searchConfig);
        prices.push({
          timestamp: new Date().toISOString(),
          results
        });
      } catch (error) {
        console.error('Price monitoring error:', error.message);
      }
    };

    // Initial collection
    await collectPrices();

    // Set up interval for continuous monitoring
    const interval = setInterval(collectPrices, intervalMs);

    return {
      getPrices: () => prices,
      stop: () => clearInterval(interval)
    };
  }

  /**
   * Extract structured data from travel booking sites
   */
  async extractTravelData(url, dataType) {
    const extractionPrompts = {
      flight: 'Extract: airline name, flight number, departure airport, arrival airport, departure time, arrival time, duration, number of stops, price, cabin class, baggage allowance. Return as JSON array.',
      bus: 'Extract: bus company, departure station, arrival station, departure time, arrival time, duration, price, amenities (WiFi, power outlets, restrooms), cancellation policy. Return as JSON array.',
      train: 'Extract: train operator, train number, departure station, arrival station, departure time, arrival time, duration, price by class, amenities, seat type. Return as JSON array.',
      rideshare: 'Extract: ride type, vehicle type, estimated price, base fare, per-mile rate, estimated pickup time, driver rating. Return as JSON array.'
    };

    return this.browse(url, extractionPrompts[dataType] || 'Extract all available pricing and schedule information as JSON.');
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Transport-specific agents using TinyFish

class FlightAgent {
  constructor(tinyfishClient) {
    this.client = tinyfishClient;
  }

  async searchFlights(origin, destination, date, options = {}) {
    const searchConfig = {
      origin,
      destination,
      date,
      mode: 'flight'
    };

    const results = await this.client.multiSiteSearch(searchConfig);
    
    return this.normalizeFlightResults(results, options);
  }

  normalizeFlightResults(results, options) {
    // Normalize and deduplicate flight results from multiple sources
    const flights = [];
    
    results.forEach(sourceResult => {
      if (sourceResult.data && Array.isArray(sourceResult.data)) {
        sourceResult.data.forEach(flight => {
          flights.push({
            mode: 'flight',
            provider: sourceResult.source || 'unknown',
            airline: flight.airline || flight.airline_name,
            flightNumber: flight.flight_number || flight.flightNumber,
            departure: {
              airport: flight.departure_airport || flight.departureAirport,
              time: flight.departure_time || flight.departureTime
            },
            arrival: {
              airport: flight.arrival_airport || flight.arrivalAirport,
              time: flight.arrival_time || flight.arrivalTime
            },
            duration: flight.duration || this.parseDuration(flight.duration_text),
            stops: flight.stops || 0,
            price: this.parsePrice(flight.price),
            currency: flight.currency || 'USD',
            cabinClass: flight.cabin_class || 'economy',
            baggageAllowance: flight.baggage_allowance
          });
        });
      }
    });

    // Sort by price
    return flights.sort((a, b) => a.price - b.price);
  }

  parsePrice(price) {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    return 0;
  }

  parseDuration(duration) {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)\s*h/i);
      const hours = match ? parseInt(match[1]) : 0;
      const minMatch = duration.match(/(\d+)\s*m/i);
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      return hours * 60 + minutes;
    }
    return 0;
  }
}

class BusAgent {
  constructor(tinyfishClient) {
    this.client = tinyfishClient;
  }

  async searchBuses(origin, destination, date, options = {}) {
    const searchConfig = {
      origin,
      destination,
      date,
      mode: 'bus'
    };

    const results = await this.client.multiSiteSearch(searchConfig);
    
    return this.normalizeBusResults(results, options);
  }

  normalizeBusResults(results, options) {
    const buses = [];
    
    results.forEach(sourceResult => {
      if (sourceResult.data && Array.isArray(sourceResult.data)) {
        sourceResult.data.forEach(bus => {
          buses.push({
            mode: 'bus',
            provider: bus.bus_company || bus.provider || sourceResult.source,
            departure: {
              station: bus.departure_station || bus.departureStation,
              time: bus.departure_time || bus.departureTime
            },
            arrival: {
              station: bus.arrival_station || bus.arrivalStation,
              time: bus.arrival_time || bus.arrivalTime
            },
            duration: this.parseDuration(bus.duration || bus.duration_text),
            price: this.parsePrice(bus.price),
            currency: bus.currency || 'USD',
            amenities: {
              wifi: bus.wifi || bus.amenities?.includes('WiFi'),
              power: bus.power || bus.amenities?.includes('Power'),
              restroom: bus.restroom || bus.amenities?.includes('Restroom')
            }
          });
        });
      }
    });

    return buses.sort((a, b) => a.price - b.price);
  }

  parsePrice(price) {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    return 0;
  }

  parseDuration(duration) {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)\s*h/i);
      const hours = match ? parseInt(match[1]) : 0;
      const minMatch = duration.match(/(\d+)\s*m/i);
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      return hours * 60 + minutes;
    }
    return 0;
  }
}

class TrainAgent {
  constructor(tinyfishClient) {
    this.client = tinyfishClient;
  }

  async searchTrains(origin, destination, date, options = {}) {
    const searchConfig = {
      origin,
      destination,
      date,
      mode: 'train'
    };

    const results = await this.client.multiSiteSearch(searchConfig);
    
    return this.normalizeTrainResults(results, options);
  }

  normalizeTrainResults(results, options) {
    const trains = [];
    
    results.forEach(sourceResult => {
      if (sourceResult.data && Array.isArray(sourceResult.data)) {
        sourceResult.data.forEach(train => {
          trains.push({
            mode: 'train',
            provider: train.train_operator || train.operator || sourceResult.source,
            trainNumber: train.train_number || train.trainNumber,
            departure: {
              station: train.departure_station || train.departureStation,
              time: train.departure_time || train.departureTime
            },
            arrival: {
              station: train.arrival_station || train.arrivalStation,
              time: train.arrival_time || train.arrivalTime
            },
            duration: this.parseDuration(train.duration || train.duration_text),
            price: this.parsePrice(train.price),
            currency: train.currency || 'USD',
            class: train.class || train.travel_class || 'standard',
            amenities: {
              wifi: train.wifi,
              power: train.power,
              food: train.food
            }
          });
        });
      }
    });

    return trains.sort((a, b) => a.price - b.price);
  }

  parsePrice(price) {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    return 0;
  }

  parseDuration(duration) {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)\s*h/i);
      const hours = match ? parseInt(match[1]) : 0;
      const minMatch = duration.match(/(\d+)\s*m/i);
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      return hours * 60 + minutes;
    }
    return 0;
  }
}

class RideShareAgent {
  constructor(tinyfishClient) {
    this.client = tinyfishClient;
  }

  async getEstimates(origin, destination, options = {}) {
    const searchConfig = {
      origin,
      destination,
      mode: 'rideshare'
    };

    const results = await this.client.multiSiteSearch(searchConfig);
    
    return this.normalizeRideShareResults(results, options);
  }

  normalizeRideShareResults(results, options) {
    const rides = [];
    
    results.forEach(sourceResult => {
      if (sourceResult.data && Array.isArray(sourceResult.data)) {
        sourceResult.data.forEach(ride => {
          rides.push({
            mode: 'rideshare',
            provider: ride.provider || ride.ride_type || sourceResult.source,
            rideType: ride.ride_type || ride.rideType,
            vehicleType: ride.vehicle_type || ride.vehicleType,
            estimatedPrice: this.parsePrice(ride.estimated_price || ride.price),
            baseFare: this.parsePrice(ride.base_fare),
            perMileRate: this.parsePrice(ride.per_mile_rate),
            estimatedPickup: ride.estimated_pickup || ride.pickup_time,
            driverRating: ride.driver_rating
          });
        });
      }
    });

    return rides.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
  }

  parsePrice(price) {
    if (typeof price === 'number') return price;
    if (typeof price === 'price') {
      return parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    return 0;
  }
}

// Factory function to create all agents
function createTinyFishAgents(config = {}) {
  const client = new TinyFishClient(config);
  
  return {
    client,
    flightAgent: new FlightAgent(client),
    busAgent: new BusAgent(client),
    trainAgent: new TrainAgent(client),
    rideShareAgent: new RideShareAgent(client)
  };
}

module.exports = {
  TinyFishClient,
  FlightAgent,
  BusAgent,
  TrainAgent,
  RideShareAgent,
  createTinyFishAgents,
  RequestPool,
  TokenBucket
};