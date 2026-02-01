// backend/src/services/routeService.js
const { db } = require('../config/database');

class RouteService {
  static async calculateBestRoute(options, preference = 'balanced') {
    // Calculate weighted scores based on preference
    const weightedOptions = options.map(option => {
      let score = 0;
      const weights = this.getWeights(preference);
      
      // Normalize values (0-1 scale where 1 is best)
      const maxCost = Math.max(...options.map(o => o.totalCost));
      const maxTime = Math.max(...options.map(o => o.totalTime));
      const maxCarbon = Math.max(...options.map(o => o.carbonKg));
      
      const normalizedCost = 1 - (option.totalCost / maxCost);
      const normalizedTime = 1 - (option.totalTime / maxTime);
      const normalizedCarbon = 1 - (option.carbonKg / maxCarbon);
      
      // Calculate weighted score
      score = (
        normalizedCost * weights.cost +
        normalizedTime * weights.time +
        normalizedCarbon * weights.carbon
      );
      
      return {
        ...option,
        score: parseFloat(score.toFixed(3))
      };
    });
    
    // Sort by score descending
    return weightedOptions.sort((a, b) => b.score - a.score);
  }
  
  static getWeights(preference) {
    const weights = {
      cost: 0.33,
      time: 0.33,
      carbon: 0.34
    };
    
    switch (preference) {
      case 'cheapest':
        weights.cost = 0.6;
        weights.time = 0.2;
        weights.carbon = 0.2;
        break;
      case 'fastest':
        weights.cost = 0.2;
        weights.time = 0.6;
        weights.carbon = 0.2;
        break;
      case 'greenest':
        weights.cost = 0.2;
        weights.time = 0.2;
        weights.carbon = 0.6;
        break;
    }
    
    return weights;
  }
  
  static async getPopularRoutes(limit = 5) {
    const [rows] = await db.execute(
      `SELECT 
        source,
        destination,
        COUNT(*) as frequency,
        AVG(total_time) as avg_time,
        AVG(total_cost) as avg_cost
       FROM routes r
       JOIN route_options ro ON r.id = ro.route_id
       WHERE ro.rank_fastest = 1
       GROUP BY source, destination
       ORDER BY frequency DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
  
  static async getAverageCommuteStats() {
    const [rows] = await db.execute(`
      SELECT 
        AVG(total_time) as avg_time,
        AVG(total_cost) as avg_cost,
        AVG(carbon_kg) as avg_carbon,
        DATE(created_at) as date
      FROM route_options ro
      JOIN routes r ON ro.route_id = r.id
      WHERE ro.rank_cheapest = 1
      GROUP BY DATE(r.created_at)
      ORDER BY date DESC
      LIMIT 7
    `);
    return rows;
  }
}

module.exports = RouteService;