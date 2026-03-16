// backend/src/controllers/commuteController.js
const Route = require('../models/Route');
const RouteOption = require('../models/RouteOption');
const CommuteHistory = require('../models/CommuteHistory');
const TinyFishRouteData = require('../models/TinyFishRouteData');
const OptimizationService = require('../services/optimizationService');
const TinyFishTransportationService = require('../services/tinyFishTransportationService');
const MockTransportationService = require('../services/mockTransportationService');
const AgentOrchestrator = require('../agents/Orchestrator');
const logger = require('../utils/logger');

class CommuteController {
    static async planCommute(req, res) {
        try {
            const { source, destination, travelDate } = req.body;
            const userId = req.user.id;

            // Validate input
            if (!source || !destination || !travelDate) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Create route record
            const routeId = await Route.create({
                userId,
                source,
                destination,
                travelDate
            });

            // Generate optimized route options
            const options = await OptimizationService.calculateRouteOptions(source, destination);

            // Save route options
            await RouteOption.createBatch(routeId, options);

            // Get complete route with options
            const result = await Route.getRouteWithOptions(routeId);

            res.status(201).json(result);
        } catch (error) {
            console.error('Plan commute error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    static async agentPlanCommute(req, res) {
        const startTime = Date.now();
        const { source, destination, travelDate, preferences } = req.body;
        const userId = req.user.id;

        try {
            // Validate input
            if (!source || !destination || !travelDate) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            logger.info(`Planning commute from ${source} to ${destination}`);

            // Use agent orchestrator for intelligent planning
            const orchestrator = new AgentOrchestrator();
            const agentResult = await orchestrator.planCommute(userId, source, destination, preferences);

            // Create route record
            const routeId = await Route.create({
                userId,
                source,
                destination,
                travelDate,
                agent_processed: true,
                processing_time_ms: Date.now() - startTime
            });

            logger.info(`Created route ID: ${routeId}`);

            // Save agent-optimized options
            await RouteOption.createBatch(routeId, agentResult.routes);

            // ============================================
            // CALL TINYFISH API OR USE MOCK DATA
            // ============================================
            let tinyFishData = {
                transportationOptions: [],
                flightOptions: []
            };

            let usingMockData = false;

            try {
                // Check if TinyFish API key is configured
                if (process.env.TINYFISH_API_KEY && process.env.TINYFISH_API_KEY !== 'your_tinyfish_api_key_here') {
                    logger.info('[Controller] Using real TinyFish API for transportation data');
                    const tinyFishService = new TinyFishTransportationService();
                    const tinyFishResponse = await tinyFishService.getTransportationOptions(
                        source,
                        destination,
                        travelDate,
                        preferences
                    );

                    // Check if TinyFish returned actual data
                    const hasTinyFishData = tinyFishResponse && 
                        tinyFishResponse.transportationOptions && 
                        tinyFishResponse.transportationOptions.length > 0;
                    
                    if (hasTinyFishData) {
                        logger.info(`[Controller] TinyFish returned ${tinyFishResponse.transportationOptions.length} transportation options`);
                        tinyFishData = {
                            transportationOptions: tinyFishResponse.transportationOptions || [],
                            flightOptions: tinyFishResponse.flightOptions || []
                        };
                    } else {
                        // TinyFish returned empty data, fall back to mock
                        logger.warn('[Controller] TinyFish returned empty data, falling back to mock transportation data');
                        usingMockData = true;
                        const mockService = new MockTransportationService();
                        const mockResponse = await mockService.getTransportationOptions(
                            source,
                            destination,
                            travelDate,
                            preferences
                        );

                        if (mockResponse && mockResponse.transportationOptions) {
                            logger.info(`[Controller] Mock service returned ${mockResponse.transportationOptions.length} transportation options`);
                            tinyFishData = {
                                transportationOptions: mockResponse.transportationOptions || [],
                                flightOptions: mockResponse.flightOptions || [],
                                mockMode: true
                            };
                        }
                    }
                } else {
                    // Use mock data for development/testing
                    logger.info('[Controller] No TinyFish API key found, using mock transportation data');
                    usingMockData = true;
                    const mockService = new MockTransportationService();
                    const mockResponse = await mockService.getTransportationOptions(
                        source,
                        destination,
                        travelDate,
                        preferences
                    );

                    if (mockResponse && mockResponse.transportationOptions) {
                        logger.info(`[Controller] Mock service returned ${mockResponse.transportationOptions.length} transportation options`);
                        tinyFishData = {
                            transportationOptions: mockResponse.transportationOptions || [],
                            flightOptions: mockResponse.flightOptions || [],
                            mockMode: true
                        };
                    }
                }

                // Store transportation data in database
                if (tinyFishData.transportationOptions.length > 0) {
                    logger.info(`[Controller] Storing ${tinyFishData.transportationOptions.length} transportation options to database for routeId: ${routeId}`);
                    
                    // Check if record exists to avoid duplicate key error
                    const recordExists = await TinyFishRouteData.exists(routeId);
                    const dataToStore = {
                        transportationOptions: tinyFishData.transportationOptions,
                        flightOptions: tinyFishData.flightOptions || [],
                        rawResponse: {
                            mockMode: usingMockData,
                            count: tinyFishData.transportationOptions.length,
                            timestamp: new Date().toISOString()
                        }
                    };
                    
                    if (recordExists) {
                        await TinyFishRouteData.update(routeId, dataToStore);
                    } else {
                        await TinyFishRouteData.create({
                            routeId,
                            source,
                            destination,
                            travelDate,
                            ...dataToStore
                        });
                    }

                    logger.info(`[Controller] ✓ Successfully stored ${tinyFishData.transportationOptions.length} transportation options for route ${routeId}`, {
                        flights: tinyFishData.transportationOptions.filter(o => o.mode === 'flight').length,
                        buses: tinyFishData.transportationOptions.filter(o => o.mode === 'bus').length,
                        trains: tinyFishData.transportationOptions.filter(o => o.mode === 'train').length,
                        rideshare: tinyFishData.transportationOptions.filter(o => o.mode === 'rideshare').length
                    });
                }
            } catch (tinyFishError) {
                logger.warn('[Controller] TinyFish/Mock service error, attempting fallback mock data:', {
                    error: tinyFishError.message,
                    stack: tinyFishError.stack
                });
                
                // Always have fallback mock data
                try {
                    const mockService = new MockTransportationService();
                    const fallbackResponse = await mockService.getTransportationOptions(
                        source,
                        destination,
                        travelDate,
                        preferences
                    );
                    
                    if (fallbackResponse && fallbackResponse.transportationOptions) {
                        logger.info(`[Controller] Fallback mock returned ${fallbackResponse.transportationOptions.length} options`);
                        tinyFishData = {
                            transportationOptions: fallbackResponse.transportationOptions || [],
                            flightOptions: fallbackResponse.flightOptions || [],
                            mockMode: true,
                            fallback: true
                        };

                        // Store fallback data
                        logger.info(`[Controller] Storing fallback data (${tinyFishData.transportationOptions.length} options) for routeId: ${routeId}`);
                        
                        // Check if record exists to avoid duplicate key error
                        const recordExists = await TinyFishRouteData.exists(routeId);
                        const fallbackData = {
                            transportationOptions: tinyFishData.transportationOptions,
                            flightOptions: tinyFishData.flightOptions || [],
                            rawResponse: {
                                mockMode: true,
                                fallback: true,
                                error: tinyFishError.message,
                                timestamp: new Date().toISOString()
                            }
                        };
                        
                        if (recordExists) {
                            await TinyFishRouteData.update(routeId, fallbackData);
                        } else {
                            await TinyFishRouteData.create({
                                routeId,
                                source,
                                destination,
                                travelDate,
                                ...fallbackData
                            });
                        }
                    }
                } catch (fallbackError) {
                    logger.error('Fallback mock service also failed:', fallbackError);
                }
            }

            // Get complete route with options
            const result = await Route.getRouteWithOptions(routeId);

            logger.info(`[Controller] ✓ Successfully completed agentPlanCommute`, {
                routeId,
                totalTransportationOptions: tinyFishData.transportationOptions.length,
                totalFlights: tinyFishData.flightOptions.length,
                usingMockData,
                processingTimeMs: Date.now() - startTime
            });

            res.status(201).json({
                ...result,
                routeId,
                tinyFishData,
                usingMockData,
                agentMetadata: agentResult.agentMetadata,
                alerts: agentResult.alerts
            });
        } catch (error) {
            logger.error('[Controller] CRITICAL ERROR in agentPlanCommute', {
                error: error.message,
                stack: error.stack,
                processingTimeMs: Date.now() - startTime
            });
            res.status(500).json({ error: 'Agent planning failed', details: error.message });
        }
    }

    static async getRouteOptions(req, res) {
        try {
            const { routeId } = req.params;
            const result = await Route.getRouteWithOptions(routeId);
            
            if (!result.route) {
                return res.status(404).json({ error: 'Route not found' });
            }
            
            res.json(result);
        } catch (error) {
            console.error('Get route options error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    static async getAgentOptimizedOptions(req, res) {
        try {
            const { routeId } = req.params;
            
            // Get base route
            const result = await Route.getRouteWithOptions(routeId);
            
            if (!result.route) {
                return res.status(404).json({ error: 'Route not found' });
            }
            
            // Apply agent optimization
            const orchestrator = new AgentOrchestrator();
            const optimizedOptions = await orchestrator.optimizeExistingRoutes(result.options);
            
            res.json({
                ...result,
                options: optimizedOptions,
                agentOptimized: true
            });
        } catch (error) {
            console.error('Get agent optimized options error:', error);
            res.status(500).json({ error: 'Agent optimization failed' });
        }
    }
    
    static async getAgentInsights(req, res) {
        try {
            const { routeId } = req.params;
            const userId = req.user.id;
            
            // Get route details
            const result = await Route.getRouteWithOptions(routeId);
            
            if (!result.route) {
                return res.status(404).json({ error: 'Route not found' });
            }
            
            // Generate agent insights
            const orchestrator = new AgentOrchestrator();
            const insights = await orchestrator.generateRouteInsights(result, userId);
            
            res.json(insights);
        } catch (error) {
            console.error('Get agent insights error:', error);
            res.status(500).json({ error: 'Failed to generate insights' });
        }
    }

    static async saveCommuteHistory(req, res) {
        try {
            const { routeOptionId, travelledOn } = req.body;
            const userId = req.user.id;

            if (!routeOptionId) {
                return res.status(400).json({ error: 'Route option ID is required' });
            }

            // Convert ISO date string to MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
            let parsedDate;
            if (travelledOn) {
                const date = new Date(travelledOn);
                parsedDate = date.toISOString().slice(0, 19).replace('T', ' ');
            } else {
                parsedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            }

            const historyId = await CommuteHistory.create({
                userId,
                routeOptionId,
                travelledOn: parsedDate
            });

            res.status(201).json({
                message: 'Commute saved to history',
                historyId
            });
        } catch (error) {
            console.error('Save commute error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getCommuteHistory(req, res) {
        try {
            const userId = req.user.id;
            console.log('getCommuteHistory - userId:', userId);
            const { limit = 20 } = req.query;
            
            const history = await CommuteHistory.getUserHistory(userId, parseInt(limit));
            console.log('getCommuteHistory - history count:', history.length);
            res.json(history);
        } catch (error) {
            console.error('Get history error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getUserRoutes(req, res) {
        try {
            const userId = req.user.id;
            const { limit = 10 } = req.query;
            
            const routes = await Route.getUserRoutes(userId, parseInt(limit));
            res.json(routes);
        } catch (error) {
            console.error('Get user routes error:', error);
            res.status(500).json({ error: 'Server error' });
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

            logger.debug(`[getTinyFishOptions] Fetching options for routeId: ${routeId}, userId: ${userId}`);

            // Verify route belongs to user
            const route = await Route.findById(routeId);
            if (!route || route.user_id !== userId) {
                logger.warn(`[getTinyFishOptions] Unauthorized access attempt to route ${routeId}`);
                return res.status(403).json({ error: 'Unauthorized access to route' });
            }

            // Get TinyFish data from database
            logger.debug(`[getTinyFishOptions] Querying database for routeId: ${routeId}`);
            let tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
            const dataExists = tinyFishData !== null;

            // Ensure tinyFishData has valid transportationOptions array
            if (tinyFishData && !Array.isArray(tinyFishData.transportationOptions)) {
                logger.warn(`[getTinyFishOptions] Invalid transportationOptions in database, resetting for routeId: ${routeId}`);
                tinyFishData.transportationOptions = [];
                tinyFishData.flightOptions = [];
            }

            // If no cached data exists, fetch fresh data from TinyFish API
            if (!tinyFishData || !Array.isArray(tinyFishData.transportationOptions) || tinyFishData.transportationOptions.length === 0) {
                logger.info(`[getTinyFishOptions] No cached data found, fetching fresh data from TinyFish API for routeId: ${routeId}`);
                
                try {
                    const tinyFishService = new TinyFishTransportationService();
                    const tinyFishResponse = await tinyFishService.getTransportationOptions(
                        route.source,
                        route.destination,
                        route.travel_date
                    );

                    // TinyFish service returns an object with transportationOptions inside
                    let transportationOptions = tinyFishResponse.transportationOptions || [];

                    // Fall back to mock if TinyFish returns empty data
                    if (transportationOptions.length === 0) {
                        logger.warn(`[getTinyFishOptions] TinyFish returned empty data, falling back to mock service`);
                        const mockService = new MockTransportationService();
                        const mockResponse = await mockService.getTransportationOptions(
                            route.source,
                            route.destination,
                            route.travel_date
                        );
                        transportationOptions = mockResponse.transportationOptions || [];
                    }

                    // Use pre-computed dataExists to avoid race condition
                    if (dataExists) {
                        await TinyFishRouteData.update(routeId, {
                            transportationOptions,
                            flightOptions: Array.isArray(transportationOptions) ? transportationOptions.filter(o => o.mode === 'flight') : []
                        });
                        logger.info(`[getTinyFishOptions] ✓ Updated existing TinyFish data for routeId: ${routeId}`);
                    } else {
                        await TinyFishRouteData.create({
                            routeId,
                            source: route.source,
                            destination: route.destination,
                            travelDate: route.travel_date,
                            transportationOptions
                        });
                        logger.info(`[getTinyFishOptions] ✓ Created new TinyFish data for routeId: ${routeId}`);
                    }

                    tinyFishData = {
                        transportationOptions,
                        flightOptions: Array.isArray(transportationOptions) ? transportationOptions.filter(o => o.mode === 'flight') : [],
                        createdAt: new Date()
                    };

                    logger.info(`[getTinyFishOptions] ✓ Successfully fetched fresh TinyFish data`, {
                        routeId,
                        totalTransportationOptions: transportationOptions.length
                    });
                } catch (tinyFishError) {
                    logger.error(`[getTinyFishOptions] Failed to fetch from TinyFish API:`, tinyFishError.message);
                    
                    // Fall back to mock service if TinyFish fails
                    logger.info(`[getTinyFishOptions] Falling back to mock transportation service`);
                    const mockService = new MockTransportationService();
                    const mockResponse = await mockService.getTransportationOptions(
                        route.source,
                        route.destination,
                        route.travel_date
                    );

                    // Mock service returns an object with transportationOptions inside
                    const mockTransportationOptions = Array.isArray(mockResponse.transportationOptions) ? mockResponse.transportationOptions : [];

                    // Use pre-computed dataExists to avoid race condition
                    if (dataExists) {
                        await TinyFishRouteData.update(routeId, {
                            transportationOptions: mockTransportationOptions,
                            flightOptions: mockTransportationOptions.filter(o => o.mode === 'flight')
                        });
                        logger.info(`[getTinyFishOptions] ✓ Updated existing TinyFish data with mock data for routeId: ${routeId}`);
                    } else {
                        await TinyFishRouteData.create({
                            routeId,
                            source: route.source,
                            destination: route.destination,
                            travelDate: route.travel_date,
                            transportationOptions: mockTransportationOptions
                        });
                        logger.info(`[getTinyFishOptions] ✓ Created new TinyFish data with mock data for routeId: ${routeId}`);
                    }

                    tinyFishData = {
                        transportationOptions: mockTransportationOptions,
                        flightOptions: mockTransportationOptions.filter(o => o.mode === 'flight'),
                        createdAt: new Date(),
                        isMockData: true
                    };
                }
            } else {
                // Ensure transportationOptions is always an array
                const transportationOptions = Array.isArray(tinyFishData.transportationOptions) 
                    ? tinyFishData.transportationOptions 
                    : [];
                
                logger.info(`[getTinyFishOptions] ✓ Successfully retrieved cached TinyFish data`, {
                    routeId,
                    totalTransportationOptions: transportationOptions.length,
                    flights: transportationOptions.filter(o => o.mode === 'flight').length,
                    buses: transportationOptions.filter(o => o.mode === 'bus').length,
                    trains: transportationOptions.filter(o => o.mode === 'train').length,
                    rideshare: transportationOptions.filter(o => o.mode === 'rideshare').length,
                    dataAge: new Date() - new Date(tinyFishData.createdAt)
                });

                // Update tinyFishData with ensured array
                tinyFishData.transportationOptions = transportationOptions;
                tinyFishData.flightOptions = transportationOptions.filter(o => o.mode === 'flight');
            }

            // Final defensive check before sending response
            const finalTransportationOptions = Array.isArray(tinyFishData.transportationOptions) 
                ? tinyFishData.transportationOptions 
                : [];
            const finalFlightOptions = Array.isArray(tinyFishData.flightOptions) 
                ? tinyFishData.flightOptions 
                : finalTransportationOptions.filter(o => o.mode === 'flight');

            res.json({
                routeId,
                transportationOptions: finalTransportationOptions,
                flightOptions: finalFlightOptions,
                dataFreshness: new Date(tinyFishData.createdAt),
                isMockData: tinyFishData.isMockData || false
            });
        } catch (error) {
            logger.error('[getTinyFishOptions] ERROR', {
                error: error.message,
                stack: error.stack,
                routeId: req.params.routeId
            });
            res.status(500).json({ error: 'Server error' });
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
                return res.status(403).json({ error: 'Unauthorized access to route' });
            }

            // Get TinyFish data
            const tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
            if (!tinyFishData) {
                return res.status(404).json({ error: 'TinyFish data not found' });
            }

            // Find the specific option
            const option = [
                ...tinyFishData.transportationOptions,
                ...tinyFishData.flightOptions
            ].find(opt => opt.id === optionId || opt.optionId === optionId);

            if (!option) {
                return res.status(404).json({ error: 'Option not found' });
            }

            // Get detailed pricing if available
            const pricingDetails = {
                ...option,
                bookingUrl: option.bookingUrl || `${process.env.FRONTEND_URL || ''}/booking/${optionId}`,
                availableUntil: option.availableUntil || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            res.json(pricingDetails);
        } catch (error) {
            console.error('Get TinyFish pricing error:', error);
            res.status(500).json({ error: 'Server error' });
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
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Get TinyFish data and find option
            const tinyFishData = await TinyFishRouteData.findByRouteId(routeId);
            if (!tinyFishData) {
                return res.status(404).json({ error: 'TinyFish data not found' });
            }

            const option = [
                ...tinyFishData.transportationOptions,
                ...tinyFishData.flightOptions
            ].find(opt => opt.id === optionId || opt.optionId === optionId);

            if (!option) {
                return res.status(404).json({ error: 'Option not found' });
            }

            // Prepare booking data with auto-filled information
            const bookingData = {
                optionId,
                routeId,
                source: route.source,
                destination: route.destination,
                travelDate: route.travel_date,
                provider: option.provider || option.company,
                class: option.class || 'standard',
                price: option.price || option.totalCost,
                passengers: 1,
                bookingUrl: option.bookingUrl
            };

            res.json({
                success: true,
                bookingData,
                redirectUrl: `${process.env.FRONTEND_URL || ''}/booking?bookingId=${optionId}`
            });
        } catch (error) {
            console.error('Prepare booking error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = CommuteController;