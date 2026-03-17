// server/models/FlightBooking.js
const { db } = require('../config/database');

class FlightBooking {
  /**
   * Create a new flight booking
   */
  static async create({
    userId,
    routeId,
    flightProvider,
    airline,
    flightNumber,
    departureTime,
    arrivalTime,
    departLocation,
    arrivalLocation,
    price,
    currency = 'USD',
    cabinClass = 'economy',
    stops = 0,
    durationMinutes,
    bookingDetails = {},
    baseFare,
    taxes,
    fees,
    totalPrice,
    baggageAllowance,
    bookingUrl,
    expiresAt
  }) {
    try {
      const [result] = await db.execute(
        `INSERT INTO flight_bookings (
          user_id, route_id, flight_provider, airline, flight_number,
          departure_time, arrival_time, depart_location, arrival_location,
          price, currency, cabin_class, stops, duration_minutes,
          booking_details, base_fare, taxes, fees, total_price,
          baggage_allowance, booking_url, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          routeId,
          flightProvider,
          airline,
          flightNumber,
          departureTime,
          arrivalTime,
          departLocation,
          arrivalLocation,
          price,
          currency,
          cabinClass,
          stops,
          durationMinutes,
          JSON.stringify(bookingDetails),
          baseFare,
          taxes,
          fees,
          totalPrice,
          baggageAllowance,
          bookingUrl,
          expiresAt
        ]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Failed to create flight booking: ${error.message}`);
    }
  }

  /**
   * Get booking by ID
   */
  static async findById(bookingId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM flight_bookings WHERE id = ?',
        [bookingId]
      );

      if (rows.length === 0) return null;

      return this.parseBooking(rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }
  }

  /**
   * Get user's flight bookings
   */
  static async getUserBookings(userId, limit = 20, offset = 0) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM flight_bookings 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      return rows.map(row => this.parseBooking(row));
    } catch (error) {
      throw new Error(`Failed to fetch user bookings: ${error.message}`);
    }
  }

  /**
   * Get route bookings
   */
  static async getRouteBookings(routeId) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM flight_bookings 
         WHERE route_id = ? 
         ORDER BY created_at DESC`,
        [routeId]
      );

      return rows.map(row => this.parseBooking(row));
    } catch (error) {
      throw new Error(`Failed to fetch route bookings: ${error.message}`);
    }
  }

  /**
   * Update booking status
   */
  static async updateStatus(bookingId, status, paymentStatus = null) {
    try {
      const updateFields = ['booking_status = ?'];
      const values = [status];

      if (paymentStatus) {
        updateFields.push('payment_status = ?');
        values.push(paymentStatus);
      }

      values.push(bookingId);

      const [result] = await db.execute(
        `UPDATE flight_bookings SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
  }

  /**
   * Update booking with confirmation details
   */
  static async confirmBooking(bookingId, bookingReference, providerBookingId, confirmationEmail) {
    try {
      const [result] = await db.execute(
        `UPDATE flight_bookings 
         SET booking_reference = ?, provider_booking_id = ?, 
             confirmation_email = ?, booking_status = 'confirmed',
             payment_status = 'completed'
         WHERE id = ?`,
        [bookingReference, providerBookingId, confirmationEmail, bookingId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to confirm booking: ${error.message}`);
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId, reason = null) {
    try {
      let notes = 'Cancelled by user';
      if (reason) notes += `: ${reason}`;

      const [result] = await db.execute(
        'UPDATE flight_bookings SET booking_status = ?, notes = ? WHERE id = ?',
        ['cancelled', notes, bookingId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    }
  }

  /**
   * Add passenger info to booking
   */
  static async addPassengerInfo(bookingId, passengerInfo) {
    try {
      const [result] = await db.execute(
        'UPDATE flight_bookings SET passenger_info = ? WHERE id = ?',
        [JSON.stringify(passengerInfo), bookingId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to add passenger info: ${error.message}`);
    }
  }

  /**
   * Add seat selection
   */
  static async addSeatSelection(bookingId, seatSelection) {
    try {
      const [result] = await db.execute(
        'UPDATE flight_bookings SET seat_selection = ? WHERE id = ?',
        [JSON.stringify(seatSelection), bookingId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to add seat selection: ${error.message}`);
    }
  }

  /**
   * Add add-ons (insurance, lounge, etc)
   */
  static async addAddOns(bookingId, addOns) {
    try {
      const currentBooking = await this.findById(bookingId);
      let totalAddOnsCost = 0;

      for (const addon of addOns) {
        totalAddOnsCost += addon.price || 0;
      }

      const newTotalPrice = (currentBooking.totalPrice || 0) + totalAddOnsCost;
      const newFees = (currentBooking.fees || 0) + totalAddOnsCost;

      const [result] = await db.execute(
        `UPDATE flight_bookings 
         SET add_ons = ?, fees = ?, total_price = ? 
         WHERE id = ?`,
        [JSON.stringify(addOns), newFees, newTotalPrice, bookingId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to add add-ons: ${error.message}`);
    }
  }

  /**
   * Get bookings with upcoming flights
   */
  static async getUpcomingBookings(userId, daysAhead = 30) {
    try {
      const futureDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
      
      const [rows] = await db.execute(
        `SELECT * FROM flight_bookings 
         WHERE user_id = ? 
         AND booking_status = 'confirmed'
         AND departure_time BETWEEN NOW() AND ?
         ORDER BY departure_time ASC`,
        [userId, futureDate]
      );

      return rows.map(row => this.parseBooking(row));
    } catch (error) {
      throw new Error(`Failed to fetch upcoming bookings: ${error.message}`);
    }
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats(userId) {
    try {
      const [stats] = await db.execute(
        `SELECT 
          COUNT(*) as total_bookings,
          SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
          SUM(total_price) as total_spent,
          AVG(total_price) as avg_price
         FROM flight_bookings 
         WHERE user_id = ?`,
        [userId]
      );

      return stats[0] || {};
    } catch (error) {
      throw new Error(`Failed to fetch booking stats: ${error.message}`);
    }
  }

  /**
   * Parse booking row from database
   */
  static parseBooking(row) {
    return {
      id: row.id,
      userId: row.user_id,
      routeId: row.route_id,
      flightProvider: row.flight_provider,
      airline: row.airline,
      flightNumber: row.flight_number,
      departureTime: row.departure_time,
      arrivalTime: row.arrival_time,
      departLocation: row.depart_location,
      arrivalLocation: row.arrival_location,
      price: parseFloat(row.price),
      currency: row.currency,
      cabinClass: row.cabin_class,
      stops: row.stops,
      durationMinutes: row.duration_minutes,
      bookingReference: row.booking_reference,
      bookingStatus: row.booking_status,
      paymentStatus: row.payment_status,
      passengerInfo: row.passenger_info ? JSON.parse(row.passenger_info) : null,
      bookingDetails: row.booking_details ? JSON.parse(row.booking_details) : {},
      baseFare: parseFloat(row.base_fare),
      taxes: parseFloat(row.taxes),
      fees: parseFloat(row.fees),
      totalPrice: parseFloat(row.total_price),
      baggageAllowance: row.baggage_allowance,
      seatSelection: row.seat_selection ? JSON.parse(row.seat_selection) : null,
      addOns: row.add_ons ? JSON.parse(row.add_ons) : [],
      confirmationEmail: row.confirmation_email,
      bookingUrl: row.booking_url,
      providerBookingId: row.provider_booking_id,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      expiresAt: row.expires_at
    };
  }
}

module.exports = FlightBooking;
