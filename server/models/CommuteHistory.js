// backend/src/models/CommuteHistory.js
const db = require('../config/database');

class CommuteHistory {
  static async create({ userId, routeOptionId, travelledOn }) {
    const [result] = await db.execute(
      'INSERT INTO commute_history (user_id, route_option_id, travelled_on) VALUES (?, ?, ?)',
      [userId, routeOptionId, travelledOn]
    );
    return result.insertId;
  }

  static async getUserHistory(userId, limit = 20) {
    const [rows] = await db.execute(
      `SELECT 
        ch.*,
        r.source,
        r.destination,
        ro.mode,
        ro.total_time,
        ro.total_cost,
        ro.carbon_kg,
        ro.rank_cheapest,
        ro.rank_fastest,
        ro.rank_eco
       FROM commute_history ch
       JOIN route_options ro ON ch.route_option_id = ro.id
       JOIN routes r ON ro.route_id = r.id
       WHERE ch.user_id = ?
       ORDER BY ch.travelled_on DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async getTotalCommutes() {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM commute_history');
    return rows[0].count;
  }
}

module.exports = CommuteHistory;