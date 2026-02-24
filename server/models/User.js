// backend/src/models/User.js
const { db } = require('../config/database');

class User {
  static async create({ name, email, passwordHash, role = 'user' }) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at, preferences FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updatePreferences(userId, preferences) {
    await db.execute(
      'UPDATE users SET preferences = ? WHERE id = ?',
      [JSON.stringify(preferences), userId]
    );
  }

  static async getStats() {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admins,
        DATE(created_at) as date,
        COUNT(*) as daily_signups
      FROM users
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    return rows;
  }
}

module.exports = User;