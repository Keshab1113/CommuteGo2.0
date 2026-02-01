// backend/src/controllers/adminController.js
const User = require('../models/User');
const Route = require('../models/Route');
const CommuteHistory = require('../models/CommuteHistory');
const AnalyticsService = require('../services/analyticsService');

class AdminController {
  static async getSystemMetrics(req, res) {
    try {
      const metrics = await AnalyticsService.getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Get metrics error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAnalyticsData(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const defaultEndDate = new Date();
      const defaultStartDate = new Date(defaultEndDate);
      defaultStartDate.setDate(defaultStartDate.getDate() - 30); // Last 30 days
      
      const analyticsData = {
        commutesPerDay: await AnalyticsService.generateCommutesPerDay(
          startDate || defaultStartDate,
          endDate || defaultEndDate
        ),
        revenueTrend: await AnalyticsService.generateRevenueTrend(
          startDate || defaultStartDate,
          endDate || defaultEndDate
        ),
        peakHours: await AnalyticsService.generatePeakHours(
          startDate || defaultStartDate,
          endDate || defaultEndDate
        ),
        modeDistribution: await AnalyticsService.generateModeDistribution(
          startDate || defaultStartDate,
          endDate || defaultEndDate
        ),
        generatedAt: new Date().toISOString()
      };
      
      res.json(analyticsData);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      
      const [users] = await db.execute(
        `SELECT id, name, email, role, created_at 
         FROM users 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
      );
      
      const [total] = await db.execute('SELECT COUNT(*) as count FROM users');
      
      res.json({
        users,
        total: total[0].count,
        page: parseInt(page),
        totalPages: Math.ceil(total[0].count / limit)
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getUserStats(req, res) {
    try {
      const stats = await User.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = AdminController;