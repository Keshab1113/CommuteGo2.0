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

    conn.release();
    return true;
  } catch (error) {
    logger.error('❌ Database initialization error:', error);
    throw error;
  }
};

module.exports = { initializeTables };
