-- CommuteGo Database Migration Script
-- Add Flight Booking Support and enhance existing schema
-- Run this after the initial DATABASE_SCHEMA.sql

-- =============================================
-- 1. FLIGHT BOOKING TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS flight_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    route_id INT NOT NULL,
    flight_provider VARCHAR(255) NOT NULL,
    airline VARCHAR(255) NOT NULL,
    flight_number VARCHAR(50) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    depart_location VARCHAR(255) NOT NULL,
    arrival_location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    cabin_class VARCHAR(50) DEFAULT 'economy',
    stops INT DEFAULT 0,
    duration_minutes INT,
    booking_reference VARCHAR(100),
    booking_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    passenger_info JSON,
    booking_details JSON,
    confirmation_email VARCHAR(255),
    booking_url VARCHAR(500),
    provider_booking_id VARCHAR(255),
    baggage_allowance VARCHAR(255),
    seat_selection JSON,
    add_ons JSON,
    base_fare DECIMAL(10, 2),
    taxes DECIMAL(10, 2),
    fees DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_route_id (route_id),
    INDEX idx_booking_status (booking_status),
    INDEX idx_created_at (created_at),
    INDEX idx_airline (airline),
    INDEX idx_flight_number (flight_number)
);

-- =============================================
-- 2. TRANSPORTATION OPTIONS CACHE
-- =============================================
CREATE TABLE IF NOT EXISTS transportation_options_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL UNIQUE,
    mode VARCHAR(50) NOT NULL,
    provider VARCHAR(255),
    price DECIMAL(10, 2),
    departure_time VARCHAR(50),
    arrival_time VARCHAR(50),
    duration INT,
    rating DECIMAL(3, 2),
    booking_url VARCHAR(500),
    additional_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    INDEX idx_route_id (route_id),
    INDEX idx_mode (mode),
    INDEX idx_provider (provider),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- 3. FLIGHT PREFERENCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS flight_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    preferred_airlines JSON,
    preferred_cabin_class VARCHAR(50),
    max_stops INT DEFAULT 2,
    preferred_airports JSON,
    seat_preference VARCHAR(50),
    meal_preference VARCHAR(50),
    baggage_preference JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- =============================================
-- 4. PRICING CACHE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS flight_pricing_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL,
    flight_id VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    base_fare DECIMAL(10, 2),
    taxes DECIMAL(10, 2),
    fees DECIMAL(10, 2),
    total_fare DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    cabin_class VARCHAR(50),
    seat_availability INT,
    price_valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    INDEX idx_route_id (route_id),
    INDEX idx_flight_id (flight_id),
    INDEX idx_provider (provider),
    INDEX idx_price_valid_until (price_valid_until),
    INDEX idx_is_active (is_active)
);

-- =============================================
-- 5. SEAT AVAILABILITY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS flight_seat_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT NOT NULL,
    flight_id VARCHAR(255) NOT NULL,
    cabin_class VARCHAR(50),
    seats_available INT,
    seats_booked INT,
    total_seats INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_flight_cabin (flight_id, cabin_class),
    INDEX idx_route_id (route_id),
    INDEX idx_flight_id (flight_id),
    INDEX idx_last_updated (last_updated)
);
