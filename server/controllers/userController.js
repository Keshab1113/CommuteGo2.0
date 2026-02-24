// backend/src/controllers/userController.js
const User = require("../models/User");
const Alert = require("../models/Alert");
const AgentOrchestrator = require("../agents/Orchestrator");
const { validateRegistration } = require("../utils/validators");
const bcrypt = require("bcryptjs");
const { db } = require("../config/database");

class UserController {
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, preferences } = req.body;

      const updates = {};
      if (name) updates.name = name;
      if (preferences) updates.preferences = preferences;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No updates provided" });
      }

      if (name) {
        await db.execute("UPDATE users SET name = ? WHERE id = ?", [
          name,
          userId,
        ]);
      }

      if (preferences) {
        await db.execute("UPDATE users SET preferences = ? WHERE id = ?", [
          JSON.stringify(preferences),
          userId,
        ]);
      }

      // Get updated user
      const [users] = await db.execute(
        "SELECT id, name, email, role, created_at, preferences FROM users WHERE id = ?",
        [userId],
      );

      res.json({
        message: "Profile updated successfully",
        user: users[0],
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }

  static async getAlerts(req, res) {
    try {
      const userId = req.user.id;
      const { unreadOnly = false, limit = 10 } = req.query;

      let query = `SELECT * FROM alerts WHERE user_id = ?`;
      const params = [userId];

      if (unreadOnly === "true") {
        query += " AND is_read = FALSE";
      }

      query += " ORDER BY created_at DESC LIMIT ?";
      params.push(parseInt(limit));

      const [alerts] = await db.execute(query, params);

      // Get unread count
      const [countResult] = await db.execute(
        "SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND is_read = FALSE",
        [userId],
      );

      res.json({
        alerts,
        unreadCount: countResult[0].count,
        total: alerts.length,
      });
    } catch (error) {
      console.error("Get alerts error:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  }

  static async getAgentGeneratedAlerts(req, res) {
    try {
      const userId = req.user.id;
      const { unreadOnly = false, limit = 10 } = req.query;

      // Use agent orchestrator to generate intelligent alerts
      const orchestrator = new AgentOrchestrator();
      const agentAlerts = await orchestrator.generatePersonalizedAlerts(userId);

      // Save agent-generated alerts to database

      for (const alert of agentAlerts) {
        await db.execute(
          `INSERT INTO alerts (user_id, type, title, message, severity, agent_generated, expires_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            alert.type,
            alert.title,
            alert.message,
            alert.severity,
            true,
            alert.expires_at,
          ],
        );
      }

      // Fetch alerts with agent-generated flag
      let query = `SELECT * FROM alerts WHERE user_id = ? AND agent_generated = TRUE`;
      const params = [userId];

      if (unreadOnly === "true") {
        query += " AND is_read = FALSE";
      }

      query += " ORDER BY created_at DESC LIMIT ?";
      params.push(parseInt(limit));

      const [alerts] = await db.execute(query, params);

      res.json({
        alerts,
        agentMetadata: {
          generated: agentAlerts.length,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Get agent-generated alerts error:", error);
      res.status(500).json({ error: "Failed to fetch agent alerts" });
    }
  }

  static async markAlertAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { alertId } = req.params;

      await db.execute(
        "UPDATE alerts SET is_read = TRUE WHERE id = ? AND user_id = ?",
        [alertId, userId],
      );

      res.json({ message: "Alert marked as read" });
    } catch (error) {
      console.error("Mark alert as read error:", error);
      res.status(500).json({ error: "Failed to mark alert as read" });
    }
  }

  static async markAllAlertsAsRead(req, res) {
    try {
      const userId = req.user.id;

      await db.execute(
        "UPDATE alerts SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
        [userId],
      );

      res.json({ message: "All alerts marked as read" });
    } catch (error) {
      console.error("Mark all alerts as read error:", error);
      res.status(500).json({ error: "Failed to mark alerts as read" });
    }
  }

  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Current and new passwords are required" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "New password must be at least 6 characters" });
      }

      // Get user with password
      const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);

      const user = users[0];
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Update password
      await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [
        newPasswordHash,
        userId,
      ]);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  }

  static async getAgentPreferences(req, res) {
    try {
      const userId = req.user.id;

      const [users] = await db.execute(
        "SELECT preferences FROM users WHERE id = ?",
        [userId],
      );

      const preferences = users[0]?.preferences || {};

      // Default agent preferences
      const agentPrefs = {
        optimizationGoal: preferences.optimizationGoal || "balanced",
        learningEnabled: preferences.learningEnabled !== false,
        alertSensitivity: preferences.alertSensitivity || "medium",
        favoriteModes: preferences.favoriteModes || [],
        maxBudget: preferences.maxBudget || 50,
        ...preferences.agentPreferences,
      };

      res.json(agentPrefs);
    } catch (error) {
      console.error("Get agent preferences error:", error);
      res.status(500).json({ error: "Failed to fetch agent preferences" });
    }
  }

  static async updateAgentPreferences(req, res) {
    try {
      const userId = req.user.id;
      const agentPrefs = req.body;

      // Get current preferences
      const [users] = await db.execute(
        "SELECT preferences FROM users WHERE id = ?",
        [userId],
      );

      const currentPrefs = users[0]?.preferences || {};

      // Update agent preferences
      const updatedPrefs = {
        ...currentPrefs,
        agentPreferences: {
          ...(currentPrefs.agentPreferences || {}),
          ...agentPrefs,
        },
      };

      await db.execute("UPDATE users SET preferences = ? WHERE id = ?", [
        JSON.stringify(updatedPrefs),
        userId,
      ]);

      res.json({
        message: "Agent preferences updated successfully",
        preferences: agentPrefs,
      });
    } catch (error) {
      console.error("Update agent preferences error:", error);
      res.status(500).json({ error: "Failed to update agent preferences" });
    }
  }

  static async getAgentGeneratedAlerts(req, res) {
    try {
        const userId = req.user.id;
        const { unreadOnly = false, limit = 10 } = req.query;
        
        // Use agent orchestrator to generate intelligent alerts
        const orchestrator = new AgentOrchestrator();
        const agentAlerts = await orchestrator.generatePersonalizedAlerts(userId);
        
        // Save agent-generated alerts to database
        const { db } = require('../config/database');
        
        for (const alert of agentAlerts) {
            // Format the expires_at date for MySQL
            let expiresAt = null;
            if (alert.expires_at) {
                // Convert ISO string to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
                const date = new Date(alert.expires_at);
                expiresAt = date.toISOString().slice(0, 19).replace('T', ' ');
            }
            
            await db.execute(
                `INSERT INTO alerts (user_id, type, title, message, severity, agent_generated, expires_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, alert.type, alert.title, alert.message, alert.severity, true, expiresAt]
            );
        }
        
        // Fetch alerts with agent-generated flag
        let query = `SELECT * FROM alerts WHERE user_id = ? AND agent_generated = TRUE`;
        const params = [userId];
        
        if (unreadOnly === 'true') {
            query += ' AND is_read = FALSE';
        }
        
        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(parseInt(limit));
        
        const [alerts] = await db.execute(query, params);
        
        res.json({
            alerts,
            agentMetadata: {
                generated: agentAlerts.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Get agent-generated alerts error:', error);
        res.status(500).json({ error: 'Failed to fetch agent alerts' });
    }
}
}

module.exports = UserController;
