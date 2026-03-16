// server/services/tinyFishTransportationService.js
/**
 * TinyFish Transportation Options Service
 * Main service layer for fetching real transportation data from TinyFish API
 */

const logger = require('../utils/logger');
const { TinyFishClient, FlightAgent, BusAgent, TrainAgent, RideShareAgent } = require('./tinyfishService');

class TinyFishTransportationService {
  constructor(config = {}) {
    this.client = new TinyFishClient(config);
    this.flightAgent = new FlightAgent(this.client);
    this.busAgent = new BusAgent(this.client);
    this.trainAgent = new TrainAgent(this.client);
    this.rideShareAgent = new RideShareAgent(this.client);
    this.apiKey = process.env.TINYFISH_API_KEY;
  }

  /**
   * Get all transportation options for a route
   * This is the main method called by the controller
   */
  async getTransportationOptions(source, destination, travelDate, preferences = {}) {
    try {
      const startTime = Date.now();
      logger.info(`[TinyFish] Starting transportation search`, {
        source,
        destination,
        travelDate,
        hasApiKey: !!this.apiKey,
        preferences: Object.keys(preferences)
      });

      // Prepare search configuration
      const searchConfig = {
        origin: source,
        destination,
        date: travelDate,
      };

      logger.debug(`[TinyFish] Search config prepared`, searchConfig);

      // Fetch transportation options concurrently
      logger.info(`[TinyFish] Fetching all transportation modes in parallel...`);
      const [flightOptions, busOptions, trainOptions, rideShareOptions] = await Promise.allSettled([
        this.fetchFlights(searchConfig),
        this.fetchBuses(searchConfig),
        this.fetchTrains(searchConfig),
        this.fetchRideShare(searchConfig),
      ]);

      // Combine results
      const transportationOptions = [];
      const errors = [];

      // Handle flights
      if (flightOptions.status === 'fulfilled' && flightOptions.value) {
        logger.info(`[TinyFish] Flights retrieved: ${flightOptions.value.length} options`);
        transportationOptions.push(...flightOptions.value);
      } else {
        const errorMsg = flightOptions.reason?.message || 'Unknown error';
        logger.warn(`[TinyFish] Flight search failed: ${errorMsg}`);
        errors.push('Flight search failed');
      }

      // Handle buses
      if (busOptions.status === 'fulfilled' && busOptions.value) {
        logger.info(`[TinyFish] Buses retrieved: ${busOptions.value.length} options`);
        transportationOptions.push(...busOptions.value);
      } else {
        const errorMsg = busOptions.reason?.message || 'Unknown error';
        logger.warn(`[TinyFish] Bus search failed: ${errorMsg}`);
        errors.push('Bus search failed');
      }

      // Handle trains
      if (trainOptions.status === 'fulfilled' && trainOptions.value) {
        logger.info(`[TinyFish] Trains retrieved: ${trainOptions.value.length} options`);
        transportationOptions.push(...trainOptions.value);
      } else {
        const errorMsg = trainOptions.reason?.message || 'Unknown error';
        logger.warn(`[TinyFish] Train search failed: ${errorMsg}`);
        errors.push('Train search failed');
      }

      // Handle rideshare
      if (rideShareOptions.status === 'fulfilled' && rideShareOptions.value) {
        logger.info(`[TinyFish] Rideshare options retrieved: ${rideShareOptions.value.length} options`);
        transportationOptions.push(...rideShareOptions.value);
      } else {
        const errorMsg = rideShareOptions.reason?.message || 'Unknown error';
        logger.warn(`[TinyFish] Rideshare search failed: ${errorMsg}`);
        errors.push('Rideshare search failed');
      }

      // Sort by price (cheapest first) for default ordering
      transportationOptions.sort((a, b) => (a.price || 0) - (b.price || 0));

      const duration = Date.now() - startTime;
      logger.info(`[TinyFish] Transportation search completed`, {
        totalOptions: transportationOptions.length,
        flightCount: transportationOptions.filter(o => o.mode === 'flight').length,
        busCount: transportationOptions.filter(o => o.mode === 'bus').length,
        trainCount: transportationOptions.filter(o => o.mode === 'train').length,
        rideshareCount: transportationOptions.filter(o => o.mode === 'rideshare').length,
        errorCount: errors.length,
        durationMs: duration,
        errors
      });

      return {
        transportationOptions: this.normalizeOptions(transportationOptions),
        flightOptions: this.extractFlightOptions(transportationOptions),
        searchMetadata: {
          source,
          destination,
          travelDate,
          resultsCount: transportationOptions.length,
          errorCount: errors.length,
          errors: errors.length > 0 ? errors : null,
          searchDuration: duration,
          timestamp: new Date().toISOString(),
        },
        rawResponse: null // Set to full response if debugging needed
      };
    } catch (error) {
      logger.error(`[TinyFish] CRITICAL ERROR in transportation service`, {
        error: error.message,
        stack: error.stack,
        source,
        destination,
        travelDate
      });
      
      // Return mock/fallback data
      return {
        transportationOptions: this.getMockTransportationOptions(source, destination, travelDate),
        flightOptions: [],
        searchMetadata: {
          source,
          destination,
          travelDate,
          resultsCount: 0,
          errorCount: 1,
          errors: [error.message],
          fallbackMode: true,
          timestamp: new Date().toISOString(),
        }
      };
    }
  }

  /**
   * Fetch flight options
   */
  async fetchFlights(searchConfig) {
    try {
      logger.debug(`[Flights] Starting flight search for ${searchConfig.origin} → ${searchConfig.destination}`);
      const flights = await this.flightAgent.searchFlights(
        searchConfig.origin,
        searchConfig.destination,
        searchConfig.date
      );
      logger.debug(`[Flights] Search completed, found ${flights.length} flights`);
      return flights || [];
    } catch (error) {
      logger.warn(`[Flights] Flight search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch bus options
   */
  async fetchBuses(searchConfig) {
    try {
      logger.debug(`[Buses] Starting bus search for ${searchConfig.origin} → ${searchConfig.destination}`);
      const buses = await this.busAgent.searchBuses(
        searchConfig.origin,
        searchConfig.destination,
        searchConfig.date
      );
      logger.debug(`[Buses] Search completed, found ${buses.length} buses`);
      return buses || [];
    } catch (error) {
      logger.warn(`[Buses] Bus search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch train options
   */
  async fetchTrains(searchConfig) {
    try {
      logger.debug(`[Trains] Starting train search for ${searchConfig.origin} → ${searchConfig.destination}`);
      const trains = await this.trainAgent.searchTrains(
        searchConfig.origin,
        searchConfig.destination,
        searchConfig.date
      );
      logger.debug(`[Trains] Search completed, found ${trains.length} trains`);
      return trains || [];
    } catch (error) {
      logger.warn(`[Trains] Train search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Fetch rideshare options
   */
  async fetchRideShare(searchConfig) {
    try {
      // Normalize rideshare results to match standard format
      const estimates = await this.rideShareAgent.getEstimates(
        searchConfig.origin,
        searchConfig.destination
      );
      
      // Convert rideshare estimates to standard transportation option format
      return estimates.map(estimate => ({
        ...estimate,
        departureTime: estimate.estimatedPickup || 'ASAP',
        arrivalTime: 'N/A',
        duration: null, // Rideshare doesn't have fixed duration
        price: estimate.estimatedPrice || 0
      }));
    } catch (error) {
      logger.warn(`Rideshare search error: ${error.message}`);
      return [];
    }
  }

  /**
   * Normalize transportation options to standard format
   */
  normalizeOptions(options) {
    return options.map((option, index) => ({
      id: `opt_${option.mode}_${index}_${Date.now()}`,
      optionId: `opt_${option.mode}_${index}`,
      mode: option.mode || 'mixed',
      provider: option.provider || 'Unknown Provider',
      price: parseFloat(option.price || 0),
      currency: option.currency || 'USD',
      duration: this.parseDuration(option.duration),
      departureTime: option.departure?.time || option.departureTime || 'N/A',
      arrivalTime: option.arrival?.time || option.arrivalTime || 'N/A',
      departureLocation: option.departure?.location || option.departure?.airport || 'Starting Point',
      arrivalLocation: option.arrival?.location || option.arrival?.airport || 'Destination',
      
      // Flight specific
      ...(option.mode === 'flight' && {
        airline: option.airline,
        flightNumber: option.flightNumber,
        stops: option.stops || 0,
        cabinClass: option.cabinClass || 'economy',
        baggageAllowance: option.baggageAllowance
      }),
      
      // Bus specific
      ...(option.mode === 'bus' && {
        busCompany: option.busCompany || option.provider,
        amenities: option.amenities || [],
        seatType: option.seatType
      }),
      
      // Train specific
      ...(option.mode === 'train' && {
        trainOperator: option.trainOperator || option.provider,
        trainNumber: option.trainNumber,
        availableClasses: option.availableClasses || ['standard'],
        amenities: option.amenities || []
      }),
      
      // Rideshare specific
      ...(option.mode === 'rideshare' && {
        rideType: option.rideType,
        vehicleType: option.vehicleType,
        baseFare: option.baseFare,
        perMileRate: option.perMileRate,
        estimatedPickup: option.estimatedPickup
      }),
      
      bookingUrl: option.bookingUrl,
      rating: option.rating || null,
      reviews: option.reviews || 0,
      availableSeats: option.availableSeats || null,
      cancellationPolicy: option.cancellationPolicy || 'Standard',
      carbon_kg: this.calculateCarbon(option.mode),
      source: 'TinyFish',
      fetchedAt: new Date().toISOString()
    }));
  }

  /**
   * Extract flight-only options
   */
  extractFlightOptions(options) {
    return options.filter(opt => opt.mode === 'flight').map(opt => ({
      ...opt,
      isFlightOption: true
    }));
  }

  /**
   * Parse duration string to minutes
   */
  parseDuration(duration) {
    if (!duration) return 0;
    
    if (typeof duration === 'number') {
      // Assume it's already in minutes
      return Math.round(duration);
    }
    
    if (typeof duration === 'string') {
      const hoursMatch = duration.match(/(\d+)\s*h/);
      const minutesMatch = duration.match(/(\d+)\s*m/);
      
      let totalMinutes = 0;
      if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
      if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
      
      return totalMinutes;
    }
    
    return 0;
  }

  /**
   * Calculate carbon emissions based on transport mode
   */
  calculateCarbon(mode) {
    const carbonFactors = {
      flight: 0.255,     // kg CO2 per km
      bus: 0.089,        // kg CO2 per km
      train: 0.041,      // kg CO2 per km
      rideshare: 0.192,  // kg CO2 per km
      mixed: 0.107       // kg CO2 per km
    };
    
    // Assume 100km average distance
    const distance = 100;
    return (carbonFactors[mode] || 0.107) * distance;
  }

  /**
   * Get mock/fallback transportation options (when API fails)
   */
  getMockTransportationOptions(source, destination, travelDate) {
    return [
      {
        id: 'mock_flight_1',
        mode: 'flight',
        provider: 'Delta Airlines',
        price: 250,
        currency: 'USD',
        duration: 180,
        departureTime: '08:00',
        arrivalTime: '10:20',
        airline: 'Delta',
        flightNumber: 'DL123',
        stops: 0,
        cabinClass: 'economy',
        carbon_kg: 25.5,
        note: 'Mock data - API unavailable'
      },
      {
        id: 'mock_bus_1',
        mode: 'bus',
        provider: 'Greyhound',
        price: 45,
        currency: 'USD',
        duration: 420,
        departureTime: '09:00',
        arrivalTime: '16:00',
        busCompany: 'Greyhound',
        amenities: ['WiFi', 'Restroom'],
        carbon_kg: 8.9,
        note: 'Mock data - API unavailable'
      },
      {
        id: 'mock_train_1',
        mode: 'train',
        provider: 'Amtrak',
        price: 85,
        currency: 'USD',
        duration: 300,
        departureTime: '10:00',
        arrivalTime: '15:00',
        trainOperator: 'Amtrak',
        availableClasses: ['economy', 'business', 'first'],
        carbon_kg: 4.1,
        note: 'Mock data - API unavailable'
      }
    ];
  }

  /**
   * Get pricing details for a specific option
   */
  async getPricingDetails(optionId, option) {
    return {
      optionId,
      baseFare: option.price,
      taxes: option.price * 0.1,
      fees: option.price * 0.05,
      totalPrice: option.price * 1.15,
      breakdownAvailable: true,
      currency: option.currency || 'USD',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

module.exports = TinyFishTransportationService;
