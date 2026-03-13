/**
 * Centralized Application Configuration
 * All configurable values should be defined here
 * Values can be overridden by environment variables
 */

const config = {
  // ============================================
  // SECURITY CONFIGURATION
  // ============================================
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 3600000, // 1 hour
  },

  // ============================================
  // RATE LIMITING CONFIGURATION
  // ============================================
  rateLimit: {
    auth: {
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW) || 60 * 60 * 1000, // 1 hour
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10, // 10 attempts per hour
      skipSuccessfulRequests: true,
    },
    general: {
      windowMs: parseInt(process.env.GENERAL_RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.GENERAL_RATE_LIMIT_MAX) || 200, // 200 requests per 15 min
    },
    api: {
      windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW) || 60 * 1000, // 1 minute
      max: parseInt(process.env.API_RATE_LIMIT_MAX) || 60, // 60 requests per minute
    },
  },

  // ============================================
  // TINYFISH SERVICE CONFIGURATION
  // ============================================
  tinyfish: {
    requestsPerMinute: parseInt(process.env.TINYFISH_RATE_PER_MINUTE) || 60,
    requestsPerHour: parseInt(process.env.TINYFISH_RATE_PER_HOUR) || 1000,
    concurrentRequests: parseInt(process.env.TINYFISH_CONCURRENT) || 5,
    cacheTTL: parseInt(process.env.TINYFISH_CACHE_TTL) || 5 * 60 * 1000, // 5 minutes
    timeout: parseInt(process.env.TINYFISH_TIMEOUT) || 30000, // 30 seconds
    baseUrl: process.env.TINYFISH_BASE_URL || 'https://api.tinyfish.io',
  },

  // ============================================
  // CALCULATIONS CONFIGURATION
  // ============================================
  calculations: {
    // Carbon emission factors (kg CO2 per km)
    carbonEmissionFactors: {
      walk: parseFloat(process.env.CARBON_WALK) || 0,
      metro: parseFloat(process.env.CARBON_METRO) || 0.041,
      train: parseFloat(process.env.CARBON_TRAIN) || 0.041,
      bus: parseFloat(process.env.CARBON_BUS) || 0.089,
      cab: parseFloat(process.env.CARBON_CAB) || 0.192,
      mixed: parseFloat(process.env.CARBON_MIXED) || 0.107,
    },
    // Average speeds (km/h)
    speeds: {
      walk: parseInt(process.env.SPEED_WALK) || 5,
      metro: parseInt(process.env.SPEED_METRO) || 40,
      train: parseInt(process.env.SPEED_TRAIN) || 60,
      bus: parseInt(process.env.SPEED_BUS) || 25,
      cab: parseInt(process.env.SPEED_CAB) || 30,
      mixed: parseInt(process.env.SPEED_MIXED) || 35,
    },
    // Transfer time for mixed mode (minutes)
    transferTime: parseInt(process.env.TRANSFER_TIME) || 15,
    // Default cost rates (base + per km)
    costRates: {
      walk: { base: 0, perKm: 0 },
      metro: { base: 0.3, perKm: 0.15 },
      train: { base: 0.5, perKm: 0.2 },
      bus: { base: 1.0, perKm: 0.1 },
      cab: { base: 3.0, perKm: 1.5, perMinute: 0.3 },
      mixed: { base: 0, perKm: 0.5, perMinute: 0.1 },
    },
  },

  // ============================================
  // ROUTE OPTIMIZATION CONFIGURATION
  // ============================================
  routeOptimization: {
    // Default weights for balanced preference
    defaultWeights: {
      cost: parseFloat(process.env.WEIGHT_COST_DEFAULT) || 0.33,
      time: parseFloat(process.env.WEIGHT_TIME_DEFAULT) || 0.33,
      carbon: parseFloat(process.env.WEIGHT_CARBON_DEFAULT) || 0.34,
    },
    // Weights for cheapest preference
    cheapestWeights: {
      cost: parseFloat(process.env.WEIGHT_COST_CHEAPEST) || 0.6,
      time: parseFloat(process.env.WEIGHT_TIME_CHEAPEST) || 0.2,
      carbon: parseFloat(process.env.WEIGHT_CARBON_CHEAPEST) || 0.2,
    },
    // Weights for fastest preference
    fastestWeights: {
      cost: parseFloat(process.env.WEIGHT_COST_FASTEST) || 0.2,
      time: parseFloat(process.env.WEIGHT_TIME_FASTEST) || 0.6,
      carbon: parseFloat(process.env.WEIGHT_CARBON_FASTEST) || 0.2,
    },
    // Weights for greenest preference
    greenestWeights: {
      cost: parseFloat(process.env.WEIGHT_COST_GREENEST) || 0.2,
      time: parseFloat(process.env.WEIGHT_TIME_GREENEST) || 0.2,
      carbon: parseFloat(process.env.WEIGHT_CARBON_GREENEST) || 0.6,
    },
  },

  // ============================================
  // SERVER CONFIGURATION
  // ============================================
  server: {
    port: parseInt(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    bodyLimit: process.env.BODY_LIMIT || '10mb',
  },

  // ============================================
  // DATABASE CONFIGURATION
  // ============================================
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'commutego',
    connectionLimit: parseInt(process.env.DB_POOL_SIZE) || 10,
  },

  // ============================================
  // CACHE CONFIGURATION
  // ============================================
  cache: {
    routeTTL: parseInt(process.env.ROUTE_CACHE_TTL) || 3600000, // 1 hour
    analyticsTTL: parseInt(process.env.ANALYTICS_CACHE_TTL) || 300000, // 5 minutes
  },
};

// Validate required configuration
function validateConfig() {
  const required = [];
  
  if (!config.security.jwtSecret) {
    required.push('JWT_SECRET');
  }
  
  if (config.server.nodeEnv === 'production') {
    if (!process.env.DB_HOST || !process.env.DB_NAME) {
      required.push('DB_HOST, DB_NAME');
    }
  }
  
  if (required.length > 0) {
    console.warn(`⚠️  Warning: Missing required environment variables: ${required.join(', ')}`);
  }
  
  return required.length === 0;
}

// Export config and validation
module.exports = { config, validateConfig };