// backend/src/routes/commute.js
const express = require('express');
const router = express.Router();
const CommuteController = require('../controllers/commuteController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

// Regular endpoints
router.post('/plan', CommuteController.planCommute);
router.get('/routes', CommuteController.getUserRoutes);
router.get('/routes/:routeId', CommuteController.getRouteOptions);
router.post('/history', CommuteController.saveCommuteHistory);
router.get('/history', CommuteController.getCommuteHistory);

// Agent-specific endpoints
router.post('/agent/plan', CommuteController.agentPlanCommute);
router.get('/routes/:routeId/agent-optimized', CommuteController.getAgentOptimizedOptions);
router.get('/agent/insights/:routeId', CommuteController.getAgentInsights);

module.exports = router;