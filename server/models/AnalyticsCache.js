// backend/src/models/AnalyticsCache.js
const { db } = require('../config/database');

class AnalyticsCache {
  static async get(cacheKey) {
    try {
      const [rows] = await db.execute(
        'SELECT data FROM analytics_cache WHERE cache_key = ? AND expires_at > NOW()',
        [cacheKey]
      );
      return rows.length > 0 ? JSON.parse(rows[0].data) : null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  static async set(cacheKey, data, ttlMinutes = 5) {
    try {
      const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
      
      await db.execute(
        `INSERT INTO analytics_cache (cache_key, data, expires_at) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE data = ?, expires_at = ?`,
        [cacheKey, JSON.stringify(data), expiresAt, JSON.stringify(data), expiresAt]
      );
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  static async clearExpired() {
    try {
      await db.execute('DELETE FROM analytics_cache WHERE expires_at <= NOW()');
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }
}

module.exports = AnalyticsCache;