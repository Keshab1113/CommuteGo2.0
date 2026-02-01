// backend/src/controllers/userController.js
const User = require('../models/User');
const Alert = require('../models/Alert');
const { validateRegistration } = require('../utils/validators');
const bcrypt = require('bcryptjs');

class UserController {
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, preferences } = req.body;
      
      const updates = {};
      if (name) updates.name = name;
      if (preferences) updates.preferences = preferences;
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
      }
      
      if (name) {
        await db.execute(
          'UPDATE users SET name = ? WHERE id = ?',
          [name, userId]
        );
      }
      
      if (preferences) {
        await User.updatePreferences(userId, preferences);
      }
      
      // Get updated user
      const updatedUser = await User.findById(userId);
      
      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
  
  static async getAlerts(req, res) {
    try {
      const userId = req.user.id;
      const { unreadOnly = false, limit = 10 } = req.query;
      
      const alerts = await Alert.getUserAlerts(
        userId,
        parseInt(limit),
        unreadOnly === 'true'
      );
      
      const unreadCount = await Alert.getUnreadCount(userId);
      
      res.json({
        alerts,
        unreadCount,
        total: alerts.length
      });
    } catch (error) {
      console.error('Get alerts error:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }
  
  static async markAlertAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { alertId } = req.params;
      
      await Alert.markAsRead(alertId, userId);
      
      res.json({ message: 'Alert marked as read' });
    } catch (error) {
      console.error('Mark alert as read error:', error);
      res.status(500).json({ error: 'Failed to mark alert as read' });
    }
  }
  
  static async markAllAlertsAsRead(req, res) {
    try {
      const userId = req.user.id;
      
      await Alert.markAllAsRead(userId);
      
      res.json({ message: 'All alerts marked as read' });
    } catch (error) {
      console.error('Mark all alerts as read error:', error);
      res.status(500).json({ error: 'Failed to mark alerts as read' });
    }
  }
  
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new passwords are required' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      
      // Get user with password
      const [users] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      
      const user = users[0];
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);
      
      // Update password
      await db.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [newPasswordHash, userId]
      );
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
}

module.exports = UserController;