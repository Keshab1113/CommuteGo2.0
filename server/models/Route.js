// backend/src/models/Route.js
const { db } = require("../config/database");

class Route {
  static async create({
    userId,
    source,
    destination,
    travelDate,
    agent_processed = false,
    processing_time_ms = null,
  }) {
    // Insert without coordinates - they will use DEFAULT (POINT(0,0))
    const [result] = await db.execute(
      "INSERT INTO routes (user_id, source, destination, travel_date, agent_processed, processing_time_ms) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userId,
        source,
        destination,
        travelDate,
        agent_processed,
        processing_time_ms,
      ],
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM routes WHERE id = ?", [id]);
    return rows[0];
  }

  static async getUserRoutes(userId, limit = 10) {
    const [rows] = await db.execute(
      `SELECT r.*, 
        COUNT(DISTINCT ro.id) as options_count,
        MIN(ro.total_cost) as min_cost,
        MIN(ro.total_time) as min_time,
        MIN(ro.carbon_kg) as min_carbon
       FROM routes r
       LEFT JOIN route_options ro ON r.id = ro.route_id
       WHERE r.user_id = ?
       GROUP BY r.id
       ORDER BY r.created_at DESC
       LIMIT ?`,
      [userId, limit],
    );
    return rows;
  }

  static async getRouteWithOptions(routeId) {
    const [route] = await db.execute("SELECT * FROM routes WHERE id = ?", [
      routeId,
    ]);

    const [options] = await db.execute(
      `SELECT * FROM route_options 
       WHERE route_id = ? 
       ORDER BY 
         CASE WHEN rank_fastest = 1 THEN 1 ELSE 2 END,
         rank_cheapest, rank_eco`,
      [routeId],
    );

    return { route: route[0], options };
  }

  static async getTotalRoutesCount() {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM routes");
    return rows[0].count;
  }

  static async getRoutesByDate(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM routes
       WHERE created_at BETWEEN ? AND ?
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate, endDate],
    );
    return rows;
  }
}

module.exports = Route;
