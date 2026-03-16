const express = require('express');
const router = express.Router();

// In-memory storage for contact messages (in production, use a database)
const contactMessages = [];

// POST /api/contact - Submit contact form
router.post('/', (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Create contact message object
    const contactMessage = {
      id: contactMessages.length + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : '',
      category: category || 'general',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    // Store the message
    contactMessages.push(contactMessage);

    // Log the contact message (in production, send email notification)
    console.log('📧 New Contact Form Submission:');
    console.log(`  Name: ${contactMessage.name}`);
    console.log(`  Email: ${contactMessage.email}`);
    console.log(`  Category: ${contactMessage.category}`);
    console.log(`  Subject: ${contactMessage.subject}`);
    console.log(`  Message: ${contactMessage.message}`);
    console.log(`  Time: ${contactMessage.createdAt}`);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.',
      data: {
        id: contactMessage.id,
        createdAt: contactMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
});

// GET /api/contact - Get all contact messages (admin only in production)
router.get('/', (req, res) => {
  try {
    // In production, add admin authentication check
    return res.status(200).json({
      success: true,
      data: contactMessages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching messages.'
    });
  }
});

module.exports = router;