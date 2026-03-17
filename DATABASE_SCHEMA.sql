-- CommuteGo Database Schema Migration
-- Created: March 2024
-- Purpose: Setup complete database schema for CommuteGo 2.0 with TinyFish integration

-- =============================================
-- 1. CORE USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_photo_url VARCHAR(500),
    date_of_birth DATE,
    preferred_transport_mode ENUM('flight', 'bus', 'train', 'rideshare') DEFAULT NULL,
    carbon_offset_kg DECIMAL(10, 2) DEFAULT 0,
    preferences JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_role (role)
);

-- =============================================
-- 2. ROUTES TABLE - Main route records
-- =============================================
CREATE TABLE IF NOT EXISTS routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    travel_date DATETIME NOT NULL,
    agent_processed BOOLEAN DEFAULT FALSE,
    processing_time_ms INT,
    agent_metadata JSON,
    is_favorite BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_travel_date (travel_date),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- 3. ROUTE OPTIONS TABLE - Agent-optimized options
-- =============================================
CREATE TABLE IF NOT EXISTS route_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL,
    rank_cheapest INT,
    rank_fastest INT,
    rank_eco INT,
    total_cost DECIMAL(10, 2) NOT NULL,
    total_time INT NOT NULL,
    distance_km DECIMAL(10, 2),
    carbon_kg DECIMAL(10, 4),
    steps JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    INDEX idx_route_id (route_id),
    INDEX idx_rank_cheapest (rank_cheapest),
    INDEX idx_rank_fastest (rank_fastest)
);

-- =============================================
-- 4. TINYFISH ROUTE DATA - Transportation options
-- =============================================
CREATE TABLE IF NOT EXISTS tinyfish_route_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL UNIQUE,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    travel_date DATETIME NOT NULL,
    transportation_options LONGTEXT NOT NULL,
    flight_options LONGTEXT,
    raw_response LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    INDEX idx_route_id (route_id),
    INDEX idx_travel_date (travel_date),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_source_dest (source, destination)
);

-- =============================================
-- 5. COMMUTE HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS commute_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    route_id INT,
    transportation_mode ENUM('flight', 'bus', 'train', 'rideshare') NOT NULL,
    provider VARCHAR(255),
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    travel_date DATETIME NOT NULL,
    actual_departure DATETIME,
    actual_arrival DATETIME,
    cost DECIMAL(10, 2),
    distance_km DECIMAL(10, 2),
    carbon_kg DECIMAL(10, 4),
    user_rating INT DEFAULT NULL,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_travel_date (travel_date),
    INDEX idx_mode (transportation_mode)
);

-- =============================================
-- 6. ALERTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    route_id INT,
    alert_type ENUM('price_drop', 'route_change', 'delay', 'availability') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    transportation_mode ENUM('flight', 'bus', 'train', 'rideshare'),
    previous_value VARCHAR(255),
    current_value VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- 7. ANALYTICS CACHE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS analytics_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_key VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15, 4),
    data_points JSON,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_metric (user_id, metric_type, metric_key),
    INDEX idx_period (period_start, period_end)
);

-- =============================================
-- 8. SETTINGS TABLE
-- =============================================
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
);

-- Insert default settings
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
('analytics_enabled', 'true', 'boolean', 'notifications', 'Enable analytics tracking', FALSE);

-- =============================================
-- Verification Queries
-- =============================================
-- Run these to verify schema:
/*

-- Check all tables exist
SHOW TABLES;

-- Check tinyfish_route_data structure specifically
DESC tinyfish_route_data;

-- Expected output:
-- | Field | Type | Null | Key | Default | Extra |
-- | id | int | NO | PRI | NULL | auto_increment |
-- | route_id | int | NO | UNI | NULL | |
-- | source | varchar(255) | NO | MUL | NULL | |
-- | destination | varchar(255) | NO | | NULL | |
-- | travel_date | datetime | NO | | NULL | |
-- | transportation_options | longtext | NO | | NULL | |
-- | flight_options | longtext | YES | | NULL | |
-- | raw_response | longtext | YES | | NULL | |
-- | created_at | timestamp | NO | MUL | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
-- | updated_at | timestamp | NO | | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |

-- Verify foreign key relationships
SELECT 
    TABLE_NAME, 
    COLUMN_NAME, 
    CONSTRAINT_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_NAME = 'tinyfish_route_data';

-- Should show:
-- tinyfish_route_data | route_id | fk_tinyfish_route | routes | id

-- Test insert (replace with real IDs)
-- INSERT INTO tinyfish_route_data 
-- (route_id, source, destination, travel_date, transportation_options) 
-- VALUES (
--   1, 
--   'New York, NY', 
--   'Boston, MA', 
--   NOW(), 
--   '[{"mode":"flight","provider":"Delta","price":250}]'
-- );

-- Test select
-- SELECT * FROM tinyfish_route_data LIMIT 1;

*/

-- =============================================
-- Notes
-- =============================================
-- 1. All JSON columns use LONGTEXT for compatibility
-- 2. Timestamps automatically track creation and updates
-- 3. Foreign keys cascade delete for data integrity
-- 4. Indices optimized for common queries
-- 5. FULLTEXT index on source/destination for future search
-- 6. All prices stored as DECIMAL for precision
-- 7. Carbon emissions tracked in kg for environmental metrics
