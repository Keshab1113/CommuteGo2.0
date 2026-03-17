// backend/src/routes/faqs.js
const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Public route - no authentication required
// Get all visible FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.findAll(true); // true = visibleOnly
        res.json(faqs);
    } catch (error) {
        console.error('Get FAQs error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get FAQs by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const allFaqs = await FAQ.findAll(true);
        const filteredFaqs = allFaqs.filter(faq => 
            faq.category && faq.category.toLowerCase() === category.toLowerCase()
        );
        res.json(filteredFaqs);
    } catch (error) {
        console.error('Get FAQs by category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;