// backend/src/routes/commute.js
const express = require('express');
const router = express.Router();
const CommuteController = require('../controllers/commuteController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/plan', CommuteController.planCommute);
router.get('/routes', CommuteController.getUserRoutes);
router.get('/routes/:routeId', CommuteController.getRouteOptions);
router.post('/history', CommuteController.saveCommuteHistory);
router.get('/history', CommuteController.getCommuteHistory);

module.exports = router;