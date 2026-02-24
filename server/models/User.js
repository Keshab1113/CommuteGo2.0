// backend/src/models/User.js
const { db } = require('../config/database');
const logger = require('../utils/logger');

class User {
    static async create({ name, email, passwordHash, role = 'user' }) {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [name, email, passwordHash, role]
            );
            logger.debug(`User created with ID: ${result.insertId}`);
            return result.insertId;
        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            logger.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT id, name, email, role, created_at, preferences, is_active FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            logger.error('Error finding user by id:', error);
            throw error;
        }
    }

    static async updateLastActive(id) {
        try {
            await db.execute(
                'UPDATE users SET last_active = NOW() WHERE id = ?',
                [id]
            );
        } catch (error) {
            logger.error('Error updating last active:', error);
            // Non-critical error, don't throw
        }
    }

    static async updatePreferences(userId, preferences) {
        try {
            await db.execute(
                'UPDATE users SET preferences = ? WHERE id = ?',
                [JSON.stringify(preferences), userId]
            );
            logger.debug(`Preferences updated for user ${userId}`);
        } catch (error) {
            logger.error('Error updating preferences:', error);
            throw error;
        }
    }

    static async getStats() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admins,
                    DATE(created_at) as date,
                    COUNT(*) as daily_signups
                FROM users
                GROUP BY DATE(created_at)
                ORDER BY date DESC
                LIMIT 30
            `);
            return rows;
        } catch (error) {
            logger.error('Error getting user stats:', error);
            throw error;
        }
    }
}

module.exports = User;