// backend/src/routes/analytics.js
const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// Public analytics (cached, no auth required)
router.get('/public/dashboard', AnalyticsController.getDashboardData);
router.get('/agent/dashboard', AnalyticsController.getAgentDashboardData); // AI-powered dashboard

// User analytics (requires auth)
router.get('/user', authMiddleware, AnalyticsController.getUserAnalytics);
router.get('/user/agent-insights', authMiddleware, AnalyticsController.getUserAgentInsights);

// Agent insights (requires auth)
router.get('/agent/insights', authMiddleware, AnalyticsController.getAgentInsights); // ← MISSING ROUTE
router.get('/agent/insights/:routeId', authMiddleware, AnalyticsController.getRouteAgentInsights);

// Admin analytics (requires admin role)
router.get('/admin/real-time', authMiddleware, roleCheck(['admin']), AnalyticsController.getRealTimeMetrics);
router.get('/admin/agent-performance', authMiddleware, roleCheck(['admin']), AnalyticsController.getAgentPerformance);

module.exports = router;