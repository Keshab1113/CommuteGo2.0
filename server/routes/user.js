// backend/src/routes/user.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

// All user routes require authentication
router.use(authMiddleware);

// Profile management
router.put("/profile", UserController.updateProfile);
router.put("/change-password", UserController.changePassword);

// Alerts management
router.get("/alerts", UserController.getAlerts); // Base endpoint
router.get("/alerts/agent-generated", UserController.getAgentGeneratedAlerts); // Agent-specific
router.put("/alerts/:alertId/read", UserController.markAlertAsRead);
router.put("/alerts/read-all", UserController.markAllAlertsAsRead);

// Agent preferences
router.get("/agent/preferences", UserController.getAgentPreferences);
router.put("/agent/preferences", UserController.updateAgentPreferences);

module.exports = router;