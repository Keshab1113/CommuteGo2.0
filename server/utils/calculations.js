// backend/src/utils/calculations.js
const { config } = require('../config/appConfig');

class Calculations {
  static calculateCarbonFootprint(mode, distance) {
    // Carbon emissions in kg CO2 per km - use config values
    const emissionFactors = config.calculations.carbonEmissionFactors;
    
    const factor = emissionFactors[mode] || 0.1;
    return parseFloat((distance * factor).toFixed(2));
  }
  
  static estimateCost(mode, distance, time) {
    // Cost in currency units - use config values
    const rates = config.calculations.costRates;
    const rate = rates[mode] || { base: 0, perKm: 0, perMinute: 0 };
    
    const cost = rate.base + (distance * rate.perKm) + (time * (rate.perMinute || 0));
    return parseFloat(cost.toFixed(2));
  }
  
  static estimateTime(mode, distance) {
    // Average speeds in km/h - use config values
    const speeds = config.calculations.speeds;
    
    const speed = speeds[mode] || 30;
    const timeInHours = distance / speed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    // Add transfer times for mixed modes - use config value
    if (mode === 'mixed') {
      return timeInMinutes + config.calculations.transferTime;
    }
    
    return timeInMinutes;
  }
  
  static formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
  
  static formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}

module.exports = Calculations;