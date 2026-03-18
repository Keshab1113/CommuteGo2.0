// backend/src/controllers/commuteController.js
const Route = require("../models/Route");
const RouteOption = require("../models/RouteOption");
const CommuteHistory = require("../models/CommuteHistory");
const TinyFishRouteData = require("../models/TinyFishRouteData");
const OptimizationService = require("../services/optimizationService");
const { TinyFishTransportationService } = require("../services/tinyfishService");
const AgentOrchestrator = require("../agents/Orchestrator");
const logger = require("../utils/logger");

class CommuteController {
  static async planCommute(req, res) {
    try {
      const { source, destination, travelDate } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!source || !destination || !travelDate) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Create route record
      const routeId = await Route.create({
        userId,
        source,
        destination,
        travelDate,
      });

      // Generate optimized route options
      const options = await OptimizationService.calculateRouteOptions(
        source,
        destination,
      );

      // Save route options
      await RouteOption.createBatch(routeId, options);

      // Get complete route with options
      const result = await Route.getRouteWithOptions(routeId);

      res.status(201).json(result);
    } catch (error) {
      console.error("Plan commute error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * SSE endpoint — streams TinyFish progress live to the browser,
   * then sends the final result as the last event.
   *
   * Why SSE: TinyFish takes 2-4 minutes. A plain JSON response gets
   * cancelled by the browser before completion. SSE keeps the connection
   * alive with heartbeats and progress updates, then delivers the result.
   */
  static async agentPlanCommute(req, res) {
    const startTime = Date.now();
    const {
      currency,
      source,
      destination,
      travelDate,
      preferences,
      transportMode,
      travelTime,
    } = req.body;
    const userId = req.user.id;

    // Validate before opening the SSE stream
    if (!source || !destination || !travelDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ── Open SSE stream to browser ──────────────────────────────────────────
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering
    res.flushHeaders();

    // Helper to send a typed SSE event
    const send = (type, data) => {
      try {
        res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
      } catch (_) {}
    };

    // Keep-alive heartbeat every 15s so proxies don't kill the connection
    const heartbeat = setInterval(() => {
      try { res.write(": heartbeat\n\n"); } catch (_) {}
    }, 15000);

    const cleanup = () => clearInterval(heartbeat);
    req.on("close", cleanup);

    try {
      // Create route in DB first so we have a real routeId immediately
      const routeId = await Route.create({ userId, source, destination, travelDate });
      send("ROUTE_CREATED", { routeId });

      const tinyFishService = new TinyFishTransportationService();

      // Forward every TinyFish SSE event straight to the browser
      const onProgress = (event) => {
        if (event.type === "PROGRESS") {
          send("PROGRESS", { purpose: event.purpose, run_id: event.run_id });
        } else if (event.type === "STARTED") {
          send("STARTED", { run_id: event.run_id });
        } else if (event.type === "STREAMING_URL") {
          send("STREAMING_URL", { streaming_url: event.streaming_url, run_id: event.run_id });
        }
      };

      const result = await tinyFishService.getTransportationOptionsWithPrompt({
        source,
        destination,
        travelDate,
        currency: currency || "USD",
        transportMode: transportMode || "flight",
        preferences: preferences || {},
        travelTime,
        onProgress,
      });

      // Cache result in DB for subsequent getTinyFishOptions calls
      const transportationOptions = (result.flights || []).map((f) => ({
        ...f,
        mode: f.mode || "flight",
        provider: f.name || f.airline,
        bookingUrl: f.url || f.booking_url,
      }));

      try {
        await TinyFishRouteData.create({
          routeId,
          source,
          destination,
          travelDate,
          transportationOptions,
        });
      } catch (cacheErr) {
        logger.warn(`Failed to cache TinyFish data: ${cacheErr.message}`);
      }

      // Send the final result as the last SSE event
      send("COMPLETE", {
        success: true,
        routeId,
        tinyFishData: {
          notes: result.notes,
          flights: result.flights,
          description: result.description,
          searchMetadata: result.searchMetadata,
        },
        processingTime: Date.now() - startTime,
      });

      cleanup();
      res.end();
    } catch (error) {
      logger.error(`Agent plan commute error: ${error.message}`);
      send("ERROR", { error: "Agent planning failed", details: error.message });
      cleanup();
      res.end();
    }
  }

  static async getRouteOptions(req, res) {
    try {
      const { routeId } = req.params;
      const result = await Route.getRouteWithOptions(routeId);

      if (!result.route) {
        return res.status(404).json({ error: "Route not found" });
      }

      res.json(result);
    } catch (error) {
      console.error("Get route options error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getAgentOptimizedOptions(req, res) {
    try {
      const { routeId } = req.params;

      // Get base route
      const result = await Route.getRouteWithOptions(routeId);

      if (!result.route) {
        return res.status(404).json({ error: "Route not found" });
      }

      // Apply agent optimization
      const orchestrator = new AgentOrchestrator();
      const optimizedOptions = await orchestrator.optimizeExistingRoutes(
        result.options,
      );

      res.json({
        ...result,
        options: optimizedOptions,
        agentOptimized: true,
      });
    } catch (error) {
      console.error("Get agent optimized options error:", error);
      res.status(500).json({ error: "Agent optimization failed" });
    }
  }

  static async getAgentInsights(req, res) {
    try {
      const { routeId } = req.params;
      const userId = req.user.id;

      // Get route details
      const result = await Route.getRouteWithOptions(routeId);

      if (!result.route) {
        return res.status(404).json({ error: "Route not found" });
      }

      // Generate agent insights
      const orchestrator = new AgentOrchestrator();
      const insights = await orchestrator.generateRouteInsights(result, userId);

      res.json(insights);
    } catch (error) {
      console.error("Get agent insights error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  }

  static async saveCommuteHistory(req, res) {
    try {
      const { routeOptionId, travelledOn } = req.body;
      const userId = req.user.id;

      if (!routeOptionId) {
        return res.status(400).json({ error: "Route option ID is required" });
      }

      // Convert ISO date string to MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
      let parsedDate;
      if (travelledOn) {
        const date = new Date(travelledOn);
        parsedDate = date.toISOString().slice(0, 19).replace("T", " ");
      } else {
        parsedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
      }

      const historyId = await CommuteHistory.create({
        userId,
        routeOptionId,
        travelledOn: parsedDate,
      });

      res.status(201).json({
        message: "Commute saved to history",
        historyId,
      });
    } catch (error) {
      console.error("Save commute error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getCommuteHistory(req, res) {
    try {
      const userId = req.user.id;
      console.log("getCommuteHistory - userId:", userId);
      const { limit = 20 } = req.query;

      const history = await CommuteHistory.getUserHistory(
        userId,
        parseInt(limit),
      );
      console.log("getCommuteHistory - history count:", history.length);
      res.json(history);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getUserRoutes(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10 } = req.query;

      const routes = await Route.getUserRoutes(userId, parseInt(limit));
      res.json(routes);
    } catch (error) {
      console.error("Get user routes error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Get TinyFish data for a route (transportation and flight options)
   * If no cached data exists, fetches fresh data from TinyFish API
   */
  static async getTinyFishOptions(req, res) {
    try {
      const { routeId } = req.params;
      const userId = req.user.id;

      logger.debug(
        `[getTinyFishOptions] Fetching options for routeId: ${routeId}, userId: ${userId}`,
      );

      // Verify route belongs to user
      const route = await Route.findById(routeId);
      if (!route || route.user_id !== userId) {
        logger.warn(
          `[getTinyFishOptions] Unauthorized access attempt to route ${routeId}`,
        );
        return res.status(403).json({ error: "Unauthorized access to route" });
      }

      // Get TinyFish data from database
      logger.debug(
        `[getTinyFishOptions] Querying database for routeId: ${routeId}`,
      );
      let tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
      const dataExists = tinyFishData !== null;

      // Ensure tinyFishData has valid transportationOptions array
      if (tinyFishData && !Array.isArray(tinyFishData.transportationOptions)) {
        logger.warn(
          `[getTinyFishOptions] Invalid transportationOptions in database, resetting for routeId: ${routeId}`,
        );
        tinyFishData.transportationOptions = [];
        tinyFishData.flightOptions = [];
      }

      // If no cached data exists, fetch fresh data from TinyFish API
      if (
        !tinyFishData ||
        !Array.isArray(tinyFishData.transportationOptions) ||
        tinyFishData.transportationOptions.length === 0
      ) {
        logger.info(
          `[getTinyFishOptions] No cached data found, fetching fresh data from TinyFish API for routeId: ${routeId}`,
        );

        try {
          const tinyFishService = new TinyFishTransportationService();
          const tinyFishResponse =
            await tinyFishService.getTransportationOptions(
              route.source,
              route.destination,
              route.travel_date,
            );

          // TinyFish service returns an object with transportationOptions inside
          let transportationOptions =
            tinyFishResponse.transportationOptions || [];

          // Fall back to mock if TinyFish returns empty data
          if (transportationOptions.length === 0) {
            logger.warn(
              `[getTinyFishOptions] TinyFish returned empty data, falling back to mock service`,
            );
            const mockService = new MockTransportationService();
            const mockResponse = await mockService.getTransportationOptions(
              route.source,
              route.destination,
              route.travel_date,
            );
            transportationOptions = mockResponse.transportationOptions || [];
          }

          // Use pre-computed dataExists to avoid race condition
          if (dataExists) {
            await TinyFishRouteData.update(routeId, {
              transportationOptions,
              flightOptions: Array.isArray(transportationOptions)
                ? transportationOptions.filter((o) => o.mode === "flight")
                : [],
            });
            logger.info(
              `[getTinyFishOptions] ✓ Updated existing TinyFish data for routeId: ${routeId}`,
            );
          } else {
            await TinyFishRouteData.create({
              routeId,
              source: route.source,
              destination: route.destination,
              travelDate: route.travel_date,
              transportationOptions,
            });
            logger.info(
              `[getTinyFishOptions] ✓ Created new TinyFish data for routeId: ${routeId}`,
            );
          }

          tinyFishData = {
            transportationOptions,
            flightOptions: Array.isArray(transportationOptions)
              ? transportationOptions.filter((o) => o.mode === "flight")
              : [],
            createdAt: new Date(),
          };

          logger.info(
            `[getTinyFishOptions] ✓ Successfully fetched fresh TinyFish data`,
            {
              routeId,
              totalTransportationOptions: transportationOptions.length,
            },
          );
        } catch (tinyFishError) {
          logger.error(
            `[getTinyFishOptions] Failed to fetch from TinyFish API:`,
            tinyFishError.message,
          );

          // Fall back to mock service if TinyFish fails
          logger.info(
            `[getTinyFishOptions] Falling back to mock transportation service`,
          );
          const mockService = new MockTransportationService();
          const mockResponse = await mockService.getTransportationOptions(
            route.source,
            route.destination,
            route.travel_date,
          );

          // Mock service returns an object with transportationOptions inside
          const mockTransportationOptions = Array.isArray(
            mockResponse.transportationOptions,
          )
            ? mockResponse.transportationOptions
            : [];

          // Use pre-computed dataExists to avoid race condition
          if (dataExists) {
            await TinyFishRouteData.update(routeId, {
              transportationOptions: mockTransportationOptions,
              flightOptions: mockTransportationOptions.filter(
                (o) => o.mode === "flight",
              ),
            });
            logger.info(
              `[getTinyFishOptions] ✓ Updated existing TinyFish data with mock data for routeId: ${routeId}`,
            );
          } else {
            await TinyFishRouteData.create({
              routeId,
              source: route.source,
              destination: route.destination,
              travelDate: route.travel_date,
              transportationOptions: mockTransportationOptions,
            });
            logger.info(
              `[getTinyFishOptions] ✓ Created new TinyFish data with mock data for routeId: ${routeId}`,
            );
          }

          tinyFishData = {
            transportationOptions: mockTransportationOptions,
            flightOptions: mockTransportationOptions.filter(
              (o) => o.mode === "flight",
            ),
            createdAt: new Date(),
            isMockData: true,
          };
        }
      } else {
        // Ensure transportationOptions is always an array
        const transportationOptions = Array.isArray(
          tinyFishData.transportationOptions,
        )
          ? tinyFishData.transportationOptions
          : [];

        logger.info(
          `[getTinyFishOptions] ✓ Successfully retrieved cached TinyFish data`,
          {
            routeId,
            totalTransportationOptions: transportationOptions.length,
            flights: transportationOptions.filter((o) => o.mode === "flight")
              .length,
            buses: transportationOptions.filter((o) => o.mode === "bus").length,
            trains: transportationOptions.filter((o) => o.mode === "train")
              .length,
            rideshare: transportationOptions.filter(
              (o) => o.mode === "rideshare",
            ).length,
            dataAge: new Date() - new Date(tinyFishData.createdAt),
          },
        );

        // Update tinyFishData with ensured array
        tinyFishData.transportationOptions = transportationOptions;
        tinyFishData.flightOptions = transportationOptions.filter(
          (o) => o.mode === "flight",
        );
      }

      // Final defensive check before sending response
      const finalTransportationOptions = Array.isArray(
        tinyFishData.transportationOptions,
      )
        ? tinyFishData.transportationOptions
        : [];
      const finalFlightOptions = Array.isArray(tinyFishData.flightOptions)
        ? tinyFishData.flightOptions
        : finalTransportationOptions.filter((o) => o.mode === "flight");

      res.json({
        routeId,
        transportationOptions: finalTransportationOptions,
        flightOptions: finalFlightOptions,
        dataFreshness: new Date(tinyFishData.createdAt),
        isMockData: tinyFishData.isMockData || false,
      });
    } catch (error) {
      logger.error("[getTinyFishOptions] ERROR", {
        error: error.message,
        stack: error.stack,
        routeId: req.params.routeId,
      });
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Get specific pricing for a transportation option
   */
  static async getTinyFishPricing(req, res) {
    try {
      const { routeId, optionId } = req.params;
      const userId = req.user.id;

      // Verify route belongs to user
      const route = await Route.findById(routeId);
      if (!route || route.user_id !== userId) {
        return res.status(403).json({ error: "Unauthorized access to route" });
      }

      // Get TinyFish data
      const tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
      if (!tinyFishData) {
        return res.status(404).json({ error: "TinyFish data not found" });
      }

      // Find the specific option
      const option = [
        ...tinyFishData.transportationOptions,
        ...tinyFishData.flightOptions,
      ].find((opt) => opt.id === optionId || opt.optionId === optionId);

      if (!option) {
        return res.status(404).json({ error: "Option not found" });
      }

      // Get detailed pricing if available
      const pricingDetails = {
        ...option,
        bookingUrl:
          option.bookingUrl ||
          `${process.env.FRONTEND_URL || ""}/booking/${optionId}`,
        availableUntil:
          option.availableUntil ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      res.json(pricingDetails);
    } catch (error) {
      console.error("Get TinyFish pricing error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Create booking preparation data
   */
  static async prepareBooking(req, res) {
    try {
      const { routeId, optionId } = req.body;
      const userId = req.user.id;

      // Verify route belongs to user
      const route = await Route.findById(routeId);
      if (!route || route.user_id !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Get TinyFish data and find option
      const tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
      if (!tinyFishData) {
        return res.status(404).json({ error: "TinyFish data not found" });
      }

      const option = [
        ...tinyFishData.transportationOptions,
        ...tinyFishData.flightOptions,
      ].find((opt) => opt.id === optionId || opt.optionId === optionId);

      if (!option) {
        return res.status(404).json({ error: "Option not found" });
      }

      // Prepare booking data with auto-filled information
      const bookingData = {
        optionId,
        routeId,
        source: route.source,
        destination: route.destination,
        travelDate: route.travel_date,
        provider: option.provider || option.company,
        class: option.class || "standard",
        price: option.price || option.totalCost,
        passengers: 1,
        bookingUrl: option.bookingUrl,
      };

      res.json({
        success: true,
        bookingData,
        redirectUrl: `${process.env.FRONTEND_URL || ""}/booking?bookingId=${optionId}`,
      });
    } catch (error) {
      console.error("Prepare booking error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Get flight options for a specific route
   */
  static async getFlightOptions(req, res) {
    try {
      const { routeId } = req.params;
      const userId = req.user.id;

      // Verify route belongs to user
      const route = await Route.findById(routeId);
      if (!route || route.user_id !== userId) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      // Get TinyFish data
      const tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
      if (!tinyFishData) {
        return res.status(404).json({ error: "TinyFish data not found" });
      }

      // Extract flights from transportation options
      const flights = tinyFishData.transportationOptions
        .filter((opt) => opt.mode === "flight")
        .sort((a, b) => (a.price || 0) - (b.price || 0));

      res.json({
        routeId,
        totalFlights: flights.length,
        flights,
        source: route.source,
        destination: route.destination,
        travelDate: route.travel_date,
      });
    } catch (error) {
      logger.error("Get flight options error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Create a flight booking record
   */
  static async createFlightBooking(req, res) {
    try {
      const { routeId, flightOption, passengerInfo } = req.body;
      const userId = req.user.id;

      const FlightBooking = require("../models/FlightBooking");

      // Verify route belongs to user
      const route = await Route.findById(routeId);
      if (!route || route.user_id !== userId) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      // Calculate pricing
      const baseFare = flightOption.price || 0;
      const taxes = baseFare * 0.12; // 12% tax
      const fees = baseFare * 0.05; // 5% fees
      const totalPrice = baseFare + taxes + fees;

      // Create booking
      const bookingId = await FlightBooking.create({
        userId,
        routeId,
        flightProvider: flightOption.provider,
        airline: flightOption.airline,
        flightNumber: flightOption.flightNumber,
        departureTime: flightOption.departureTime,
        arrivalTime: flightOption.arrivalTime,
        departLocation: route.source,
        arrivalLocation: route.destination,
        price: baseFare,
        currency: "USD",
        cabinClass: flightOption.cabinClass || "economy",
        stops: flightOption.stops || 0,
        durationMinutes: flightOption.duration || 0,
        baggageAllowance: flightOption.baggageAllowance,
        bookingUrl: flightOption.bookingUrl,
        baseFare,
        taxes,
        fees,
        totalPrice,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      });

      // Add passenger info if provided
      if (passengerInfo) {
        await FlightBooking.addPassengerInfo(bookingId, passengerInfo);
      }

      const booking = await FlightBooking.findById(bookingId);

      res.status(201).json({
        success: true,
        bookingId,
        booking,
        message: "Flight booking created successfully",
      });
    } catch (error) {
      logger.error("Create flight booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }

  /**
   * Get flight booking details
   */
  static async getFlightBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      const FlightBooking = require("../models/FlightBooking");
      const booking = await FlightBooking.findById(bookingId);

      if (!booking || booking.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      res.json(booking);
    } catch (error) {
      logger.error("Get flight booking error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Get user's flight bookings
   */
  static async getUserFlightBookings(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20, offset = 0 } = req.query;

      const FlightBooking = require("../models/FlightBooking");
      const bookings = await FlightBooking.getUserBookings(
        userId,
        parseInt(limit),
        parseInt(offset),
      );
      const stats = await FlightBooking.getBookingStats(userId);

      res.json({
        bookings,
        stats,
        total: bookings.length,
        hasMore: bookings.length === parseInt(limit),
      });
    } catch (error) {
      logger.error("Get user flight bookings error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Update flight booking status
   */
  static async updateFlightBookingStatus(req, res) {
    try {
      const { bookingId } = req.params;
      const { status, paymentStatus } = req.body;
      const userId = req.user.id;

      const FlightBooking = require("../models/FlightBooking");
      const booking = await FlightBooking.findById(bookingId);

      if (!booking || booking.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      const success = await FlightBooking.updateStatus(
        bookingId,
        status,
        paymentStatus,
      );

      if (success) {
        const updated = await FlightBooking.findById(bookingId);
        res.json({
          success: true,
          booking: updated,
          message: "Booking status updated",
        });
      } else {
        res.status(400).json({ error: "Failed to update booking status" });
      }
    } catch (error) {
      logger.error("Update flight booking status error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Confirm flight booking with provider details
   */
  static async confirmFlightBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { bookingReference, providerBookingId, confirmationEmail } =
        req.body;
      const userId = req.user.id;

      const FlightBooking = require("../models/FlightBooking");
      const booking = await FlightBooking.findById(bookingId);

      if (!booking || booking.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      const success = await FlightBooking.confirmBooking(
        bookingId,
        bookingReference,
        providerBookingId,
        confirmationEmail,
      );

      if (success) {
        const updated = await FlightBooking.findById(bookingId);
        res.json({
          success: true,
          booking: updated,
          message: "Flight booking confirmed",
        });
      } else {
        res.status(400).json({ error: "Failed to confirm booking" });
      }
    } catch (error) {
      logger.error("Confirm flight booking error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Cancel flight booking
   */
  static async cancelFlightBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const FlightBooking = require("../models/FlightBooking");
      const booking = await FlightBooking.findById(bookingId);

      if (!booking || booking.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      const success = await FlightBooking.cancelBooking(bookingId, reason);

      if (success) {
        const updated = await FlightBooking.findById(bookingId);
        res.json({
          success: true,
          booking: updated,
          message: "Flight booking cancelled",
        });
      } else {
        res.status(400).json({ error: "Failed to cancel booking" });
      }
    } catch (error) {
      logger.error("Cancel flight booking error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  /**
   * Get upcoming flights for user
   */
  static async getUpcomingFlights(req, res) {
    try {
      const userId = req.user.id;
      const { daysAhead = 30 } = req.query;

      const FlightBooking = require("../models/FlightBooking");
      const upcomingFlights = await FlightBooking.getUpcomingBookings(
        userId,
        parseInt(daysAhead),
      );

      res.json({
        upcomingFlights,
        total: upcomingFlights.length,
        daysAhead: parseInt(daysAhead),
      });
    } catch (error) {
      logger.error("Get upcoming flights error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = CommuteController;