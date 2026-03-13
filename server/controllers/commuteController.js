// backend/src/controllers/commuteController.js
const Route = require('../models/Route');
const RouteOption = require('../models/RouteOption');
const CommuteHistory = require('../models/CommuteHistory');
const OptimizationService = require('../services/optimizationService');
const AgentOrchestrator = require('../agents/Orchestrator');

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
        try {
            const startTime = Date.now();
            const { source, destination, travelDate, preferences } = req.body;
            const userId = req.user.id;

            // Validate input
            if (!source || !destination || !travelDate) {
                return res.status(400).json({ error: 'All fields are required' });
            }

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

            // Save agent-optimized options
            await RouteOption.createBatch(routeId, agentResult.routes);

            // Get complete route with options
            const result = await Route.getRouteWithOptions(routeId);

            res.status(201).json({
                ...result,
                agentMetadata: agentResult.agentMetadata,
                alerts: agentResult.alerts
            });
        } catch (error) {
            console.error('Agent plan commute error:', error.message);
            console.error('Error stack:', error.stack);
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
}

module.exports = CommuteController;