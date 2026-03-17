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

// User management
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

// Route management
router.get('/routes', AdminController.getAllRoutes);
router.delete('/routes/:id', AdminController.deleteRoute);

// Alert management
router.get('/alerts', AdminController.getAllAlerts);
router.put('/alerts/:id', AdminController.updateAlert);
router.delete('/alerts/:id', AdminController.deleteAlert);

// Settings management
router.get('/settings', AdminController.getSettings);
router.get('/settings/:key', AdminController.getSetting);
router.post('/settings', AdminController.createSetting);
router.put('/settings/:key', AdminController.updateSetting);
router.delete('/settings/:key', AdminController.deleteSetting);

// Dashboard stats
router.get('/dashboard-stats', AdminController.getDashboardStats);

// Blog management
router.get('/blogs', AdminController.getAllBlogs);
router.get('/blogs/:id', AdminController.getBlog);
router.post('/blogs', AdminController.createBlog);
router.put('/blogs/:id', AdminController.updateBlog);
router.delete('/blogs/:id', AdminController.deleteBlog);

// FAQ management
router.get('/faqs', AdminController.getAllFAQs);
router.get('/faqs/:id', AdminController.getFAQ);
router.post('/faqs', AdminController.createFAQ);
router.put('/faqs/:id', AdminController.updateFAQ);
router.delete('/faqs/:id', AdminController.deleteFAQ);
router.put('/faqs/reorder', AdminController.reorderFAQs);

// Contact management
router.get('/contacts', AdminController.getAllContacts);
router.get('/contacts/:id', AdminController.getContact);
router.put('/contacts/:id', AdminController.updateContact);
router.delete('/contacts/:id', AdminController.deleteContact);

// Job management
router.get('/jobs', AdminController.getAllJobs);
router.get('/jobs/:id', AdminController.getJob);
router.post('/jobs', AdminController.createJob);
router.put('/jobs/:id', AdminController.updateJob);
router.delete('/jobs/:id', AdminController.deleteJob);
router.patch('/jobs/:id/toggle', AdminController.toggleJobActive);

// Pricing management
router.get('/pricing', AdminController.getAllPricingPlans);
router.get('/pricing/:id', AdminController.getPricingPlan);
router.post('/pricing', AdminController.createPricingPlan);
router.put('/pricing/:id', AdminController.updatePricingPlan);
router.delete('/pricing/:id', AdminController.deletePricingPlan);
router.put('/pricing/reorder', AdminController.reorderPricingPlans);

module.exports = router;