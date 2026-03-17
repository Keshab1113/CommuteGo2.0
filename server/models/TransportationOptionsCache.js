// server/models/TransportationOptionsCache.js
const { db } = require('../config/database');

class TransportationOptionsCache {
  /**
   * Cache transportation options for a route
   */
  static async cache(routeId, options) {
    try {
      // Clear existing cache for this route
      await db.execute('DELETE FROM transportation_options_cache WHERE route_id = ?', [routeId]);

      // Cache each option
      for (const option of options) {
        await db.execute(
          `INSERT INTO transportation_options_cache (
            route_id, mode, provider, price, departure_time, arrival_time, 
            duration, rating, booking_url, additional_data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            routeId,
            option.mode,
            option.provider,
            option.price,
            option.departureTime,
            option.arrivalTime,
            option.duration,
            option.rating,
            option.bookingUrl,
            JSON.stringify(option)
          ]
        );
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to cache options: ${error.message}`);
    }
  }

  /**
   * Get cached options by mode
   */
  static async getByMode(routeId, mode) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM transportation_options_cache 
         WHERE route_id = ? AND mode = ?
         ORDER BY price ASC`,
        [routeId, mode]
      );

      return rows.map(row => ({
        ...JSON.parse(row.additional_data),
        id: row.id,
        cachedAt: row.created_at
      }));
    } catch (error) {
      throw new Error(`Failed to get cached options: ${error.message}`);
    }
  }

  /**
   * Get all cached options for route
   */
  static async getAll(routeId) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM transportation_options_cache WHERE route_id = ?`,
        [routeId]
      );

      return rows.map(row => JSON.parse(row.additional_data));
    } catch (error) {
      throw new Error(`Failed to get all cached options: ${error.message}`);
    }
  }

  /**
   * Get flight options only
   */
  static async getFlights(routeId) {
    return this.getByMode(routeId, 'flight');
  }

  /**
   * Get cheapest options per mode
   */
  static async getCheapestPerMode(routeId) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM transportation_options_cache 
         WHERE route_id = ? 
         GROUP BY mode 
         ORDER BY price ASC`,
        [routeId]
      );

      return rows.map(row => JSON.parse(row.additional_data));
    } catch (error) {
      throw new Error(`Failed to get cheapest options: ${error.message}`);
    }
  }

  /**
   * Clear cache for route
   */
  static async clear(routeId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM transportation_options_cache WHERE route_id = ?',
        [routeId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to clear cache: ${error.message}`);
    }
  }
}

module.exports = TransportationOptionsCache;
