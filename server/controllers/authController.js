// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../utils/validators');
const logger = require('../utils/logger');

class AuthController {
    static async register(req, res) {
        try {
            const { error } = validateRegistration(req.body);
            if (error) {
                logger.warn('Registration validation failed:', error.details[0].message);
                return res.status(400).json({ error: error.details[0].message });
            }

            const { name, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                logger.warn(`Registration attempt with existing email: ${email}`);
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Create user
            const userId = await User.create({ name, email, passwordHash });

            // Generate token
            const token = jwt.sign(
                { id: userId, email, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            logger.info(`New user registered: ${email}`);

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: userId, name, email, role: 'user' }
            });
        } catch (error) {
            logger.error('Registration error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async login(req, res) {
        try {
            const { error } = validateLogin(req.body);
            if (error) {
                logger.warn('Login validation failed:', error.details[0].message);
                return res.status(400).json({ error: error.details[0].message });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                logger.warn(`Login attempt with non-existent email: ${email}`);
                // Use same error message for security
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                logger.warn(`Failed login attempt for: ${email}`);
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check if account is active
            if (user.is_active === false) {
                logger.warn(`Login attempt for inactive account: ${email}`);
                return res.status(403).json({ error: 'Account is deactivated' });
            }

            // Update last active timestamp
            await User.updateLastActive(user.id);

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            logger.info(`Successful login: ${email}`);

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            logger.error('Login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                logger.warn(`Profile fetch failed: User ${req.user.id} not found`);
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json(user);
        } catch (error) {
            logger.error('Get profile error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async refreshToken(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            logger.error('Token refresh error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = AuthController;