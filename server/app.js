// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const commuteRoutes = require('./routes/commute');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/user');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - different limits for different routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  message: 'Too many login attempts, please try again later.'
});

// Apply rate limiting
app.use('/api/auth/', authLimiter);
app.use('/api/', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/commute', commuteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    const { db } = require('./config/database');
    await db.execute('SELECT 1');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'CommuteGo API Documentation',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile'
      },
      commute: {
        'POST /api/commute/plan': 'Plan new commute',
        'GET /api/commute/routes': 'Get user routes',
        'GET /api/commute/routes/:id': 'Get route options',
        'POST /api/commute/history': 'Save commute to history',
        'GET /api/commute/history': 'Get commute history'
      },
      user: {
        'PUT /api/user/profile': 'Update profile',
        'PUT /api/user/change-password': 'Change password',
        'GET /api/user/alerts': 'Get user alerts'
      },
      admin: {
        'GET /api/admin/metrics': 'Get system metrics',
        'GET /api/admin/analytics': 'Get analytics data',
        'GET /api/admin/users': 'Get all users',
        'GET /api/admin/users/stats': 'Get user statistics'
      },
      analytics: {
        'GET /api/analytics/public/dashboard': 'Public dashboard data',
        'GET /api/analytics/user': 'User analytics',
        'GET /api/analytics/admin/real-time': 'Admin real-time metrics'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.url,
    method: req.method 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;