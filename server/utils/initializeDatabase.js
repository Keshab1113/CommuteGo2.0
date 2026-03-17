// server/utils/initializeDatabase.js
/**
 * Database initialization and table creation
 * Run this on server startup to ensure all tables exist
 */

const { db } = require('../config/database');
const logger = require('./logger');

const initializeTables = async () => {
  try {
    const conn = await db.getConnection();

    // Create tinyfish_route_data table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS tinyfish_route_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        route_id INT NOT NULL,
        source VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        travel_date TIMESTAMP NOT NULL,
        transportation_options LONGTEXT NOT NULL COMMENT 'JSON array of transportation options from TinyFish',
        flight_options LONGTEXT COMMENT 'JSON array of flight options',
        raw_response LONGTEXT COMMENT 'Raw response from TinyFish API for debugging',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        UNIQUE KEY uk_route_id (route_id),
        KEY idx_created_at (created_at),
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    logger.info('✅ tinyfish_route_data table initialized successfully');

    // Create settings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        category ENUM('general', 'system', 'limits', 'performance', 'auth', 'email', 'payment', 'api', 'notifications') DEFAULT 'general',
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_setting_key (setting_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    logger.info('✅ settings table initialized successfully');

    // Insert default settings if table is empty
    const [existingSettings] = await conn.query('SELECT COUNT(*) as count FROM settings');
    if (existingSettings[0].count === 0) {
      await conn.query(`
        INSERT INTO settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
        ('site_name', 'CommuteGo', 'string', 'general', 'The name of the application', TRUE),
        ('site_description', 'Your intelligent commute planning assistant', 'string', 'general', 'The description of the application', TRUE),
        ('maintenance_mode', 'false', 'boolean', 'system', 'Enable or disable maintenance mode', FALSE),
        ('max_routes_per_user', '100', 'number', 'limits', 'Maximum number of routes a user can save', FALSE),
        ('max_alerts_per_user', '50', 'number', 'limits', 'Maximum number of alerts a user can create', FALSE),
        ('cache_ttl_minutes', '30', 'number', 'performance', 'Time to live for cached data in minutes', FALSE),
        ('session_timeout_hours', '24', 'number', 'auth', 'Session timeout in hours', FALSE),
        ('email_verification_required', 'true', 'boolean', 'auth', 'Require email verification for new users', FALSE),
        ('smtp_host', '', 'string', 'email', 'SMTP server host', FALSE),
        ('smtp_port', '587', 'number', 'email', 'SMTP server port', FALSE),
        ('smtp_from_email', 'noreply@commutego.com', 'string', 'email', 'From email address for outgoing emails', FALSE),
        ('payment_gateway', 'stripe', 'string', 'payment', 'Payment gateway to use', FALSE),
        ('stripe_public_key', '', 'string', 'payment', 'Stripe public key', FALSE),
        ('tinyfish_api_enabled', 'true', 'boolean', 'api', 'Enable TinyFish API integration', FALSE),
        ('analytics_enabled', 'true', 'boolean', 'notifications', 'Enable analytics tracking', FALSE)
      `);
      logger.info('✅ Default settings inserted successfully');
    }

    conn.release();
    return true;
  } catch (error) {
    logger.error('❌ Database initialization error:', error);
    throw error;
  }
};

module.exports = { initializeTables };
