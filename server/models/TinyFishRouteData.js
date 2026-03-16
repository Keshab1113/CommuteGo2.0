// server/models/TinyFishRouteData.js
const { db } = require('../config/database');

class TinyFishRouteData {
  /**
   * Create a new TinyFish route data record
   */
  static async create({
    routeId,
    source,
    destination,
    travelDate,
    transportationOptions,
    flightOptions = null,
    rawResponse = null,
  }) {
    const [result] = await db.execute(
      `INSERT INTO tinyfish_route_data 
       (route_id, source, destination, travel_date, transportation_options, flight_options, raw_response)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        routeId,
        source,
        destination,
        travelDate,
        JSON.stringify(transportationOptions),
        flightOptions ? JSON.stringify(flightOptions) : null,
        rawResponse ? JSON.stringify(rawResponse) : null,
      ]
    );
    return result.insertId;
  }

  /**
   * Get TinyFish data for a route
   */
  static async findByRouteId(routeId) {
    const [rows] = await db.execute(
      `SELECT * FROM tinyfish_route_data WHERE route_id = ?`,
      [routeId]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      routeId: row.route_id,
      source: row.source,
      destination: row.destination,
      travelDate: row.travel_date,
      transportationOptions: JSON.parse(row.transportation_options || '[]'),
      flightOptions: row.flight_options ? JSON.parse(row.flight_options) : [],
      rawResponse: row.raw_response ? JSON.parse(row.raw_response) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Update TinyFish data for a route
   */
  static async update(routeId, { transportationOptions, flightOptions = null, rawResponse = null }) {
    const [result] = await db.execute(
      `UPDATE tinyfish_route_data 
       SET transportation_options = ?, flight_options = ?, raw_response = ?
       WHERE route_id = ?`,
      [
        JSON.stringify(transportationOptions),
        flightOptions ? JSON.stringify(flightOptions) : null,
        rawResponse ? JSON.stringify(rawResponse) : null,
        routeId,
      ]
    );
    return result.affectedRows;
  }

  /**
   * Check if route has TinyFish data
   */
  static async exists(routeId) {
    const [rows] = await db.execute(
      `SELECT id FROM tinyfish_route_data WHERE route_id = ? LIMIT 1`,
      [routeId]
    );
    return rows.length > 0;
  }

  /**
   * Delete TinyFish data for a route
   */
  static async delete(routeId) {
    const [result] = await db.execute(
      `DELETE FROM tinyfish_route_data WHERE route_id = ?`,
      [routeId]
    );
    return result.affectedRows;
  }

  /**
   * Get statistics on TinyFish data usage
   */
  static async getStats(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT 
        COUNT(*) as total_routes,
        COUNT(DISTINCT DATE(created_at)) as days_with_data,
        COUNT(CASE WHEN flight_options IS NOT NULL THEN 1 END) as routes_with_flights
       FROM tinyfish_route_data
       WHERE created_at BETWEEN ? AND ?`,
      [startDate, endDate]
    );
    return rows[0];
  }
}

module.exports = TinyFishRouteData;
