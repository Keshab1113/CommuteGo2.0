// backend/src/utils/calculations.js
class Calculations {
  static calculateCarbonFootprint(mode, distance) {
    // Carbon emissions in kg CO2 per km
    const emissionFactors = {
      walk: 0,
      metro: 0.041,
      train: 0.041,
      bus: 0.089,
      cab: 0.192,
      mixed: 0.107 // Average of different modes
    };
    
    const factor = emissionFactors[mode] || 0.1;
    return parseFloat((distance * factor).toFixed(2));
  }
  
  static estimateCost(mode, distance, time) {
    // Cost in currency units
    const rates = {
      walk: 0,
      metro: 0.3 + (distance * 0.15),
      train: 0.5 + (distance * 0.2),
      bus: 1.0 + (distance * 0.1),
      cab: 3.0 + (distance * 1.5) + (time * 0.3),
      mixed: (distance * 0.5) + (time * 0.1)
    };
    
    const cost = rates[mode] || 0;
    return parseFloat(cost.toFixed(2));
  }
  
  static estimateTime(mode, distance) {
    // Average speeds in km/h
    const speeds = {
      walk: 5,
      metro: 40,
      train: 60,
      bus: 25,
      cab: 30,
      mixed: 35 // Average including transfers
    };
    
    const speed = speeds[mode] || 30;
    const timeInHours = distance / speed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    // Add transfer times for mixed modes
    if (mode === 'mixed') {
      return timeInMinutes + 15; // Add 15 minutes for transfers
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