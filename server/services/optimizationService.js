// backend/src/services/optimizationService.js
class OptimizationService {
  static calculateRouteOptions(source, destination, preferences = {}) {
    // This is a mock simulation - in production, integrate with actual mapping APIs
    const modes = ['cab', 'bus', 'train', 'metro', 'walk', 'mixed'];
    const options = [];
    
    modes.forEach((mode, index) => {
      const baseTime = Math.floor(Math.random() * 120) + 15; // 15-135 minutes
      const baseCost = Math.floor(Math.random() * 5000) + 100; // 100-5100 currency
      
      let time = baseTime;
      let cost = baseCost;
      let carbon = 0;
      
      switch(mode) {
        case 'walk':
          time = baseTime * 3;
          cost = 0;
          carbon = 0;
          break;
        case 'metro':
          time = baseTime * 0.8;
          cost = baseCost * 0.3;
          carbon = baseCost * 0.1;
          break;
        case 'bus':
          time = baseTime * 1.2;
          cost = baseCost * 0.4;
          carbon = baseCost * 0.2;
          break;
        case 'train':
          time = baseTime * 0.7;
          cost = baseCost * 0.5;
          carbon = baseCost * 0.15;
          break;
        case 'cab':
          time = baseTime * 0.6;
          cost = baseCost * 1.5;
          carbon = baseCost * 0.3;
          break;
        case 'mixed':
          time = baseTime * 0.9;
          cost = baseCost * 0.8;
          carbon = baseCost * 0.25;
          break;
      }
      
      options.push({
        mode,
        totalTime: Math.round(time),
        totalCost: Math.round(cost * 100) / 100,
        carbonKg: Math.round(carbon * 100) / 100,
        distanceKm: Math.round((baseTime / 60 * 50) * 100) / 100, // Mock distance
        steps: this.generateSteps(mode, source, destination),
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
  
  static generateSteps(mode, source, destination) {
    const steps = [];
    if (mode === 'mixed') {
      steps.push(
        { mode: 'walk', from: source, to: 'Bus Stop', duration: 5, distance: 0.3 },
        { mode: 'bus', from: 'Bus Stop', to: 'Metro Station', duration: 15, distance: 3.2 },
        { mode: 'metro', from: 'Metro Station', to: 'Destination Station', duration: 25, distance: 8.5 },
        { mode: 'walk', from: 'Destination Station', to: destination, duration: 8, distance: 0.6 }
      );
    } else {
      steps.push({
        mode,
        from: source,
        to: destination,
        duration: 30,
        distance: 10
      });
    }
    return steps;
  }
  
  static generateMockPolyline() {
    return 'mock_polyline_data_' + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = OptimizationService;