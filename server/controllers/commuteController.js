// backend/src/controllers/commuteController.js
const Route = require('../models/Route');
const RouteOption = require('../models/RouteOption');
const CommuteHistory = require('../models/CommuteHistory');
const OptimizationService = require('../services/optimizationService');

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
      const options = OptimizationService.calculateRouteOptions(source, destination);

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

  static async saveCommuteHistory(req, res) {
    try {
      const { routeOptionId, travelledOn } = req.body;
      const userId = req.user.id;

      if (!routeOptionId) {
        return res.status(400).json({ error: 'Route option ID is required' });
      }

      const historyId = await CommuteHistory.create({
        userId,
        routeOptionId,
        travelledOn: travelledOn || new Date()
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
      const { limit = 20 } = req.query;
      
      const history = await CommuteHistory.getUserHistory(userId, parseInt(limit));
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