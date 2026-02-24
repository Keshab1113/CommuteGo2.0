// backend/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const commuteRoutes = require("./routes/commute");
const adminRoutes = require("./routes/admin");
const analyticsRoutes = require("./routes/analytics");
const userRoutes = require("./routes/user");
const logger = require("./utils/logger");
const { ipKeyGenerator } = require("express-rate-limit");

const app = express();

// Redis client for production (optional, falls back to memory store)
let redisClient;
if (process.env.NODE_ENV === "production" && process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
}

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Create a custom rate limit handler
const createRateLimiter = (options) => {
  const limiterOptions = {
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message:
      options.message ||
      "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use IP + user ID if authenticated for more granular limiting
      if (req.user) {
        // For authenticated users, use user ID + IP (with proper IPv6 handling)
        return `${ipKeyGenerator(req.ip)}-${req.user.id}`;
      }
      // For unauthenticated users, use ipKeyGenerator to handle IPv6 subnets
      return ipKeyGenerator(req.ip);
    },
    skip: (req) => {
      return req.path === "/health";
    },
    handler: (req, res) => {
      logger.warn(
        `Rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.url}`,
      );
      res.status(429).json({
        error: options.message || "Too many requests",
        retryAfter: Math.ceil(options.windowMs / 1000 / 60),
      });
    },
  };

  return rateLimit(limiterOptions);
};

// Rate limiting configurations
const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: "Too many login attempts, please try again later.",
  prefix: "auth",
  skipSuccessfulRequests: true, // Don't count successful logins
});

const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased from 100 to 200
  message: "Too many requests, please slow down.",
  prefix: "general",
});

const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: "Too many API requests, please slow down.",
  prefix: "api",
});

// Apply rate limiting
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/", generalLimiter);
app.use("/api/", apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/commute", commuteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint with database status
app.get("/health", async (req, res) => {
  try {
    const { db } = require("./config/database");
    await db.execute("SELECT 1");

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      rateLimits: {
        auth: "10 per hour",
        general: "200 per 15min",
        api: "60 per minute",
      },
    });
  } catch (error) {
    logger.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    message: "CommuteGo API Documentation",
    version: "2.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/profile": "Get user profile",
      },
      commute: {
        "POST /api/commute/plan": "Plan new commute",
        "POST /api/commute/agent/plan": "AI-powered commute planning",
        "GET /api/commute/routes": "Get user routes",
        "GET /api/commute/routes/:id/agent-optimized":
          "Get AI-optimized route options",
        "GET /api/commute/agent/insights/:routeId": "Get AI insights",
        "POST /api/commute/history": "Save commute to history",
        "GET /api/commute/history": "Get commute history",
      },
      user: {
        "PUT /api/user/profile": "Update profile",
        "PUT /api/user/change-password": "Change password",
        "GET /api/user/alerts": "Get user alerts",
        "GET /api/user/alerts/agent-generated": "Get AI-generated alerts",
        "GET /api/user/agent/preferences": "Get AI preferences",
        "PUT /api/user/agent/preferences": "Update AI preferences",
      },
      admin: {
        "GET /api/admin/metrics": "Get system metrics",
        "GET /api/admin/analytics": "Get analytics data",
        "GET /api/admin/analytics/agent-enhanced": "Get AI-enhanced analytics",
        "GET /api/admin/users": "Get all users",
        "GET /api/admin/agents/logs": "Get AI agent logs",
        "GET /api/admin/agents/health": "Get AI agent health",
      },
      analytics: {
        "GET /api/analytics/public/dashboard": "Public dashboard data",
        "GET /api/analytics/agent/dashboard": "AI-generated dashboard",
        "GET /api/analytics/user": "User analytics",
        "GET /api/analytics/user/agent-insights": "AI user insights",
        "GET /api/analytics/admin/real-time": "Admin real-time metrics",
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error("Global error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
