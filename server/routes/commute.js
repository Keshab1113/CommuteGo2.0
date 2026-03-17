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

// TinyFish Integration endpoints
router.get('/routes/:routeId/tinyfish/options', CommuteController.getTinyFishOptions);
router.get('/routes/:routeId/tinyfish/pricing/:optionId', CommuteController.getTinyFishPricing);
router.post('/routes/tinyfish/prepare-booking', CommuteController.prepareBooking);

// Flight-specific endpoints
router.get('/routes/:routeId/flights', CommuteController.getFlightOptions);
router.post('/flights/booking', CommuteController.createFlightBooking);
router.get('/flights/booking/:bookingId', CommuteController.getFlightBooking);
router.get('/flights/bookings', CommuteController.getUserFlightBookings);
router.get('/flights/upcoming', CommuteController.getUpcomingFlights);
router.patch('/flights/booking/:bookingId/status', CommuteController.updateFlightBookingStatus);
router.post('/flights/booking/:bookingId/confirm', CommuteController.confirmFlightBooking);
router.post('/flights/booking/:bookingId/cancel', CommuteController.cancelFlightBooking);

module.exports = router;