// backend/src/services/optimizationService.js
const { config } = require('../config/appConfig');

class OptimizationService {
  // Geocode addresses to coordinates (simplified - in production use a geocoding API)
  static async geocodeAddress(address) {
    // Common city coordinates (in production, use Google Maps, Mapbox, or Nominatim API)
    const cityCoords = {
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'pune': { lat: 18.5204, lng: 73.8567 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'lucknow': { lat: 26.8467, lng: 80.9462 },
      'ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'singapore': { lat: 1.3521, lng: 103.8198 },
      'dubai': { lat: 25.2048, lng: 55.2708 },
      'sydney': { lat: -33.8688, lng: 151.2093 },
      'berlin': { lat: 52.5200, lng: 13.4050 },
      'toronto': { lat: 43.6532, lng: -79.3832 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
    };

    const normalizedAddress = address.toLowerCase().trim();
    
    // Check exact match
    if (cityCoords[normalizedAddress]) {
      return cityCoords[normalizedAddress];
    }
    
    // Check partial match (e.g., "New Delhi" contains "delhi")
    for (const [city, coords] of Object.entries(cityCoords)) {
      if (normalizedAddress.includes(city)) {
        return coords;
      }
    }
    
    // Default coordinates (Delhi) if not found - will calculate distance from there
    return { lat: 28.6139, lng: 77.2090 };
  }

  // Calculate distance using Haversine formula
  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  // Calculate route options using real distance and config-based calculations
  static async calculateRouteOptions(source, destination, preferences = {}) {
    // Get coordinates for source and destination
    const [sourceCoords, destCoords] = await Promise.all([
      this.geocodeAddress(source),
      this.geocodeAddress(destination)
    ]);

    // Calculate actual distance
    const distanceKm = this.haversineDistance(
      sourceCoords.lat, sourceCoords.lng,
      destCoords.lat, destCoords.lng
    );

    const modes = ['cab', 'bus', 'train', 'metro', 'walk', 'mixed'];
    const speeds = config.calculations.speeds;
    const carbonFactors = config.calculations.carbonEmissionFactors;
    const costRates = config.calculations.costRates;
    const transferTime = config.calculations.transferTime || 15;

    const options = [];
    
    modes.forEach((mode) => {
      // Calculate time based on distance and speed
      const speed = speeds[mode] || 30;
      let time = (distanceKm / speed) * 60; // Convert to minutes
      
      // Calculate cost based on distance and rates
      const rate = costRates[mode] || { base: 1, perKm: 0.5 };
      let cost = rate.base + (distanceKm * rate.perKm);
      
      // Add per-minute cost if applicable
      if (rate.perMinute) {
        cost += (time * rate.perMinute);
      }
      
      // Calculate carbon emissions
      const carbonFactor = carbonFactors[mode] || 0.1;
      const carbon = distanceKm * carbonFactor;
      
      // Adjust for mixed mode (includes transfer time)
      if (mode === 'mixed') {
        time += transferTime;
        cost = cost * 0.8; // Mixed is usually cheaper
      }
      
      // Ensure minimum values
      time = Math.max(time, 5); // Minimum 5 minutes
      cost = Math.max(cost, 0);
      
      options.push({
        mode,
        totalTime: Math.round(time),
        totalCost: Math.round(cost * 100) / 100,
        carbonKg: Math.round(carbon * 100) / 100,
        distanceKm: distanceKm,
        steps: this.generateSteps(mode, source, destination, distanceKm),
        polyline: this.generateMockPolyline()
      });
    });
    
    // Rank options
    const cheapestSorted = [...options].sort((a, b) => a.totalCost - b.totalCost);
    const fastestSorted = [...options].sort((a, b) => a.totalTime - b.totalTime);
    const ecoSorted = [...options].sort((a, b) => a.carbonKg - b.carbonKg);
    
    options.forEach(option => {
      option.rankCheapest = cheapestSorted.findIndex(o => o.mode === option.mode) + 1;
      option.rankFastest = fastestSorted.findIndex(o => o.mode === option.mode) + 1;
      option.rankEco = ecoSorted.findIndex(o => o.mode === option.mode) + 1;
    });
    
    return options;
  }
  
  static generateSteps(mode, source, destination, distanceKm = 10) {
    const steps = [];
    if (mode === 'mixed') {
      // Distribute distance across modes
      const walkDist1 = Math.min(distanceKm * 0.05, 0.5);
      const busDist = Math.min(distanceKm * 0.25, 10);
      const metroDist = Math.max(distanceKm * 0.60, 1);
      const walkDist2 = Math.min(distanceKm * 0.10, 0.8);
      
      steps.push(
        { mode: 'walk', from: source, to: 'Bus Stop', duration: Math.round(walkDist1 / 5 * 60), distance: Math.round(walkDist1 * 10) / 10 },
        { mode: 'bus', from: 'Bus Stop', to: 'Metro Station', duration: Math.round(busDist / 25 * 60), distance: Math.round(busDist * 10) / 10 },
        { mode: 'metro', from: 'Metro Station', to: 'Destination Station', duration: Math.round(metroDist / 40 * 60), distance: Math.round(metroDist * 10) / 10 },
        { mode: 'walk', from: 'Destination Station', to: destination, duration: Math.round(walkDist2 / 5 * 60), distance: Math.round(walkDist2 * 10) / 10 }
      );
    } else {
      const speeds = { walk: 5, metro: 40, train: 60, bus: 25, cab: 30 };
      const speed = speeds[mode] || 30;
      const duration = Math.round((distanceKm / speed) * 60);
      
      steps.push({
        mode,
        from: source,
        to: destination,
        duration: Math.max(duration, 5),
        distance: distanceKm
      });
    }
    return steps;
  }
  
  static generateMockPolyline() {
    return 'mock_polyline_data_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = OptimizationService;