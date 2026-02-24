// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.use(authMiddleware);
router.use(roleCheck(['admin']));

router.get('/metrics', AdminController.getSystemMetrics);
router.get('/analytics', AdminController.getAnalyticsData);
router.get('/analytics/agent-enhanced', AdminController.getAgentEnhancedAnalytics);
router.get('/users', AdminController.getAllUsers);
router.get('/users/stats', AdminController.getUserStats);
router.get('/agents/logs', AdminController.getAgentLogs);
router.get('/agents/health', AdminController.getAgentHealth);

module.exports = router;