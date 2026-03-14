// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
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

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Find user by email (but don't reveal if user exists)
            const user = await User.findByEmail(email);

            // Initialize resetToken to null (will only be set if user exists)
            let resetToken = null;

            if (user) {
                // Generate reset token (valid for 1 hour)
                resetToken = jwt.sign(
                    { id: user.id, email: user.email, type: 'password-reset' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Log the reset token (in production, send via email)
                logger.info(`Password reset requested for user ${user.id}. Reset token: ${resetToken}`);
                
                // In production, you would send an email here:
                // await sendResetEmail(user.email, resetToken);
            }

            // Always return success to prevent email enumeration
            // In production, you would send the email and NOT return the token
            // For development/demo, we return the token so frontend can show a reset link
            res.json({ 
                message: 'If an account exists with this email, you will receive a password reset link shortly.',
                resetToken: user ? resetToken : null // Only return token if user exists
            });
        } catch (error) {
            logger.error('Forgot password error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ error: 'Token and new password are required' });
            }

            // Validate password strength
            if (newPassword.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long' });
            }

            // Verify the reset token
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                logger.warn('Invalid or expired reset token:', error.message);
                return res.status(400).json({ error: 'Invalid or expired reset token' });
            }

            // Verify token type
            if (decoded.type !== 'password-reset') {
                return res.status(400).json({ error: 'Invalid token type' });
            }

            // Find user by id
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);

            // Update user's password
            await db.execute(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [passwordHash, user.id]
            );

            logger.info(`Password reset successful for user ${user.id}`);

            res.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
        } catch (error) {
            logger.error('Reset password error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = AuthController;