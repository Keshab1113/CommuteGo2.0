// backend/src/models/RouteOption.js
const db = require('../config/database');

class RouteOption {
  static async createBatch(routeId, options) {
    const values = options.map(opt => [
      routeId,
      opt.mode,
      opt.totalTime,
      opt.totalCost,
      opt.carbonKg,
      opt.rankCheapest,
      opt.rankFastest,
      opt.rankEco,
      opt.distanceKm,
      JSON.stringify(opt.steps),
      opt.polyline
    ]);

    const [result] = await db.query(
      `INSERT INTO route_options 
       (route_id, mode, total_time, total_cost, carbon_kg, 
        rank_cheapest, rank_fastest, rank_eco, distance_km, steps, polyline)
       VALUES ?`,
      [values]
    );
    return result.affectedRows;
  }

  static async getModeDistribution(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        ro.mode,
        COUNT(*) as count,
        AVG(ro.total_cost) as avg_cost,
        AVG(ro.total_time) as avg_time
       FROM route_options ro
       JOIN routes r ON ro.route_id = r.id
       WHERE r.created_at BETWEEN ? AND ?
       GROUP BY ro.mode
       ORDER BY count DESC`,
      [startDate, endDate]
    );
    return rows;
  }

  static async getPeakHours(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        HOUR(r.travel_date) as hour,
        COUNT(*) as commute_count,
        AVG(ro.total_time) as avg_duration,
        AVG(ro.total_cost) as avg_cost
       FROM routes r
       JOIN route_options ro ON r.id = ro.route_id
       WHERE ro.rank_fastest = 1 
         AND r.travel_date BETWEEN ? AND ?
       GROUP BY HOUR(r.travel_date)
       ORDER BY hour`,
      [startDate, endDate]
    );
    return rows;
  }
}

module.exports = RouteOption;