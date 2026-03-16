// server/services/mockTransportationService.js
/**
 * Mock Transportation Service
 * Generates realistic test data for all transportation modes
 * Use this while testing/developing, switch to real TinyFish when ready
 */

const logger = require('../utils/logger');

class MockTransportationService {
  constructor() {
    this.airlines = [
      'Delta Airlines',
      'United Airlines', 
      'American Airlines',
      'Southwest Airlines',
      'JetBlue Airways',
      'Spirit Airlines',
      'Frontier Airlines',
    ];

    this.busCompanies = [
      'Greyhound',
      'FlixBus',
      'Busbud',
      'Megabus',
      'Peter Pan',
    ];

    this.trainOperators = [
      'Amtrak',
      'Northeast Regional',
      'Trainline',
      'Metro Rail',
    ];

    this.rideshareProviders = [
      'Uber',
      'Lyft',
      'Uber Black',
    ];

    // Additional transportation modes
    this.metroProviders = [
      'MTA Subway',
      'Chicago CTA',
      'WMATA Metro',
      'LA Metro',
      'BART',
    ];

    this.ferryOperators = [
      'NYC Ferry',
      'Golden Gate Ferry',
      'Vancouver Ferry',
      'Seattle Ferries',
      'Boston Harbor Cruises',
    ];

    this.bikeShareProviders = [
      'Citi Bike',
      'Divvy',
      'Ford GoBike',
      'Lime',
      'Bird',
    ];

    this.shuttleProviders = [
      'SuperShuttle',
      'GO Lorrie\'s',
      'Shared Van Services',
      'Hotel Shuttles',
      'Airport Express',
    ];
  }

  /**
   * Generate realistic transportation options
   */
  async getTransportationOptions(source, destination, travelDate, preferences = {}) {
    try {
      logger.info(`[MOCK] Generating transportation options from ${source} to ${destination}`);

      const transportationOptions = [];

      // Generate flight options
      transportationOptions.push(...this.generateFlights(source, destination));

      // Generate bus options
      transportationOptions.push(...this.generateBuses(source, destination));

      // Generate train options
      transportationOptions.push(...this.generateTrains(source, destination));

      // Generate rideshare options
      transportationOptions.push(...this.generateRideShare(source, destination));

      // Generate metro/subway options
      transportationOptions.push(...this.generateMetro(source, destination));

      // Generate ferry options
      transportationOptions.push(...this.generateFerry(source, destination));

      // Generate bike-share/scooter options
      transportationOptions.push(...this.generateBikeShare(source, destination));

      // Generate shuttle options
      transportationOptions.push(...this.generateShuttle(source, destination));

      // Sort by price
      transportationOptions.sort((a, b) => (a.price || 0) - (b.price || 0));

      logger.info(`[MOCK] Generated ${transportationOptions.length} transportation options`);

      return {
        transportationOptions: this.normalizeOptions(transportationOptions),
        flightOptions: transportationOptions.filter(opt => opt.mode === 'flight'),
        searchMetadata: {
          source,
          destination,
          travelDate,
          resultsCount: transportationOptions.length,
          errorCount: 0,
          errors: null,
          searchDuration: 500,
          timestamp: new Date().toISOString(),
          mockMode: true,
        },
        rawResponse: null
      };
    } catch (error) {
      logger.error('[MOCK] Transportation service error:', error);
      throw error;
    }
  }

  /**
   * Generate flight options
   */
  generateFlights(source, destination) {
    const flights = [];
    const startHour = 6;
    const distance = 500; // km estimate

    for (let i = 0; i < 5; i++) {
      const departureHour = startHour + i * 2;
      const duration = 120 + Math.random() * 60;
      const arrivalHour = departureHour + Math.floor(duration / 60);

      flights.push({
        id: `flight_${i}`,
        mode: 'flight',
        provider: this.airlines[Math.floor(Math.random() * this.airlines.length)],
        airline: this.airlines[Math.floor(Math.random() * this.airlines.length)],
        flightNumber: `FL${Math.floor(Math.random() * 9000) + 1000}`,
        price: 150 + Math.random() * 300,
        currency: 'USD',
        departureTime: this.formatTime(departureHour, Math.floor(Math.random() * 60)),
        arrivalTime: this.formatTime(arrivalHour, Math.floor(Math.random() * 60)),
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        stops: Math.floor(Math.random() * 2),
        cabinClass: ['economy', 'business'][Math.floor(Math.random() * 2)],
        baggageAllowance: '1 checked bag included',
        amenities: ['WiFi', 'Food Service', 'In-seat Power'],
        rating: 4 + Math.random() * 1,
        carbon_kg: 0.255 * distance,
        bookingUrl: `https://www.example-airline.com/book`,
        source: 'Mock Data'
      });
    }

    return flights;
  }

  /**
   * Generate bus options
   */
  generateBuses(source, destination) {
    const buses = [];

    for (let i = 0; i < 3; i++) {
      const startHour = 5 + i * 3;
      const duration = 240 + Math.random() * 120;
      const arrivalHour = startHour + Math.floor(duration / 60);

      buses.push({
        id: `bus_${i}`,
        mode: 'bus',
        provider: this.busCompanies[Math.floor(Math.random() * this.busCompanies.length)],
        price: 30 + Math.random() * 80,
        currency: 'USD',
        departureTime: this.formatTime(startHour, Math.floor(Math.random() * 60)),
        arrivalTime: this.formatTime(arrivalHour, Math.floor(Math.random() * 60)),
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        busCompany: this.busCompanies[Math.floor(Math.random() * this.busCompanies.length)],
        amenities: ['WiFi', 'Restroom', 'Air Conditioning'],
        rating: 3.8 + Math.random() * 1.2,
        carbon_kg: 0.089 * 500,
        bookingUrl: `https://www.example-bus.com/book`,
        source: 'Mock Data'
      });
    }

    return buses;
  }

  /**
   * Generate train options
   */
  generateTrains(source, destination) {
    const trains = [];

    for (let i = 0; i < 3; i++) {
      const startHour = 6 + i * 3;
      const duration = 180 + Math.random() * 120;
      const arrivalHour = startHour + Math.floor(duration / 60);

      trains.push({
        id: `train_${i}`,
        mode: 'train',
        provider: this.trainOperators[Math.floor(Math.random() * this.trainOperators.length)],
        trainNumber: `TR${Math.floor(Math.random() * 900) + 100}`,
        price: 80 + Math.random() * 200,
        currency: 'USD',
        departureTime: this.formatTime(startHour, Math.floor(Math.random() * 60)),
        arrivalTime: this.formatTime(arrivalHour, Math.floor(Math.random() * 60)),
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        trainOperator: this.trainOperators[Math.floor(Math.random() * this.trainOperators.length)],
        availableClasses: ['economy', 'business', 'first'],
        amenities: ['WiFi', 'Food Service', 'Comfortable Seating'],
        rating: 4.2 + Math.random() * 0.8,
        carbon_kg: 0.041 * 500,
        bookingUrl: `https://www.example-train.com/book`,
        source: 'Mock Data'
      });
    }

    return trains;
  }

  /**
   * Generate rideshare options
   */
  generateRideShare(source, destination) {
    const rides = [];

    for (let i = 0; i < 2; i++) {
      rides.push({
        id: `rideshare_${i}`,
        mode: 'rideshare',
        provider: this.rideshareProviders[Math.floor(Math.random() * this.rideshareProviders.length)],
        rideType: ['XL', 'Black', 'Plus'][i % 3],
        price: 50 + Math.random() * 150,
        currency: 'USD',
        departureTime: 'On Demand',
        arrivalTime: '~45 mins',
        departureLocation: source,
        arrivalLocation: destination,
        duration: 45,
        vehicleType: 'Sedan',
        baseFare: 5,
        perMileRate: 1.5,
        estimatedPickup: '2-5 mins',
        rating: 4.8,
        carbon_kg: 0.192 * 500,
        bookingUrl: `https://www.example-rideshare.com/book`,
        source: 'Mock Data'
      });
    }

    return rides;
  }

  /**
   * Generate metro/subway options
   */
  generateMetro(source, destination) {
    const metroOptions = [];
    const lines = ['Red Line', 'Blue Line', 'Green Line', 'Orange Line', 'Purple Line'];

    for (let i = 0; i < 3; i++) {
      const startHour = 5 + i * 4;
      const duration = 30 + Math.random() * 30;
      
      metroOptions.push({
        id: `metro_${i}`,
        mode: 'metro',
        provider: this.metroProviders[Math.floor(Math.random() * this.metroProviders.length)],
        line: lines[Math.floor(Math.random() * lines.length)],
        price: 2.75 + Math.random() * 1,
        currency: 'USD',
        departureTime: this.formatTime(startHour, Math.floor(Math.random() * 60)),
        arrivalTime: this.formatTime(startHour + Math.floor(duration / 60), Math.floor(Math.random() * 60)),
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        stops: Math.floor(Math.random() * 10) + 5,
        transferCount: Math.floor(Math.random() * 2),
        amenities: ['Air Conditioning', 'Accessibility', 'WiFi'],
        rating: 4.0 + Math.random() * 1,
        carbon_kg: 0.089 * 500,
        bookingUrl: `https://www.example-metro.com/schedule`,
        source: 'Mock Data'
      });
    }

    return metroOptions;
  }

  /**
   * Generate ferry options
   */
  generateFerry(source, destination) {
    const ferries = [];

    for (let i = 0; i < 2; i++) {
      const startHour = 7 + i * 4;
      const duration = 45 + Math.random() * 60;
      const arrivalHour = startHour + Math.floor(duration / 60);

      ferries.push({
        id: `ferry_${i}`,
        mode: 'ferry',
        provider: this.ferryOperators[Math.floor(Math.random() * this.ferryOperators.length)],
        vesselName: `Ferry ${String.fromCharCode(65 + i)}`,
        price: 15 + Math.random() * 25,
        currency: 'USD',
        departureTime: this.formatTime(startHour, Math.floor(Math.random() * 60)),
        arrivalTime: this.formatTime(arrivalHour, Math.floor(Math.random() * 60)),
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        vesselType: ['Catamaran', 'Hydrofoil', 'Traditional Ferry'][i % 3],
        amenities: ['Indoor Seating', 'Outdoor Deck', 'Café', 'Restroom'],
        rating: 4.3 + Math.random() * 0.7,
        carbon_kg: 0.052 * 500,
        bookingUrl: `https://www.example-ferry.com/book`,
        source: 'Mock Data'
      });
    }

    return ferries;
  }

  /**
   * Generate bike-share/scooter options
   */
  generateBikeShare(source, destination) {
    const bikes = [];

    for (let i = 0; i < 2; i++) {
      const duration = 20 + Math.random() * 40;
      
      bikes.push({
        id: `bikeshare_${i}`,
        mode: 'bikeshare',
        provider: this.bikeShareProviders[Math.floor(Math.random() * this.bikeShareProviders.length)],
        vehicleType: ['E-Bike', 'Regular Bike', 'E-Scooter', 'Scooter'][i % 4],
        price: 3 + Math.random() * 5,
        currency: 'USD',
        departureTime: 'On Demand',
        arrivalTime: `~${Math.floor(duration)} mins`,
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        unlockFee: 1,
        perMinuteRate: 0.15 + Math.random() * 0.1,
        distance: Math.floor(Math.random() * 10) + 2,
        amenities: ['Helmet Included', 'Basket', 'Lights'],
        rating: 4.5 + Math.random() * 0.5,
        carbon_kg: 0,
        bookingUrl: `https://www.example-bikeshare.com/unlock`,
        source: 'Mock Data'
      });
    }

    return bikes;
  }

  /**
   * Generate shuttle options
   */
  generateShuttle(source, destination) {
    const shuttles = [];

    for (let i = 0; i < 2; i++) {
      const startHour = 4 + i * 6;
      const duration = 60 + Math.random() * 90;
      const arrivalHour = startHour + Math.floor(duration / 60);

      shuttles.push({
        id: `shuttle_${i}`,
        mode: 'shuttle',
        provider: this.shuttleProviders[Math.floor(Math.random() * this.shuttleProviders.length)],
        shuttleType: ['Shared Van', 'Minibus', 'Luxury Shuttle'][i % 3],
        price: 25 + Math.random() * 35,
        currency: 'USD',
        departureTime: this.formatTime(startHour, Math.floor(Math.random() * 60)),
        arrivalTime: this.formatTime(arrivalHour, Math.floor(Math.random() * 60)),
        departureLocation: source,
        arrivalLocation: destination,
        duration: Math.floor(duration),
        pickupLocation: 'Terminal Pickup Zone',
        dropOffLocation: 'Downtown Transfer Center',
        amenities: ['Air Conditioning', 'WiFi', 'Luggage Storage', 'Curbside Pickup'],
        rating: 4.4 + Math.random() * 0.6,
        carbon_kg: 0.178 * 500,
        bookingUrl: `https://www.example-shuttle.com/book`,
        source: 'Mock Data'
      });
    }

    return shuttles;
  }

  /**
   * Normalize all options to standard format
   */
  normalizeOptions(options) {
    return options.map((option, index) => ({
      id: option.id || `opt_${option.mode}_${index}`,
      optionId: option.id || `opt_${option.mode}_${index}`,
      mode: option.mode || 'mixed',
      provider: option.provider || 'Unknown Provider',
      price: parseFloat(option.price || 0),
      currency: option.currency || 'USD',
      duration: option.duration || 0,
      departureTime: option.departureTime || 'N/A',
      arrivalTime: option.arrivalTime || 'N/A',
      departureLocation: option.departureLocation || 'Starting Point',
      arrivalLocation: option.arrivalLocation || 'Destination',
      bookingUrl: option.bookingUrl,
      rating: option.rating || null,
      reviews: option.reviews || 0,
      carbon_kg: option.carbon_kg || 0,
      source: 'Mock',
      fetchedAt: new Date().toISOString(),
      amenities: option.amenities || [],
      ...option
    }));
  }

  /**
   * Format time helper
   */
  formatTime(hour, minute) {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
}

module.exports = MockTransportationService;
