// backend/src/models/Alert.js
const { db } = require('../config/database');

class Alert {
  static async create({ userId, type, title, message, severity = 'medium' }) {
    const [result] = await db.execute(
      `INSERT INTO alerts (user_id, type, title, message, severity) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, title, message, severity]
    );
    return result.insertId;
  }

  static async getUserAlerts(userId, limit = 10, unreadOnly = false) {
    let query = `SELECT * FROM alerts WHERE user_id = ?`;
    const params = [userId];
    
    if (unreadOnly) {
      query += ' AND is_read = FALSE';
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async markAsRead(alertId, userId) {
    await db.execute(
      'UPDATE alerts SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [alertId, userId]
    );
  }

  static async markAllAsRead(userId) {
    await db.execute(
      'UPDATE alerts SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  }
}

module.exports = Alert;