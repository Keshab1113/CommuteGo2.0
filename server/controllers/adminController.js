// backend/src/controllers/adminController.js
const User = require('../models/User');
const Route = require('../models/Route');
const CommuteHistory = require('../models/CommuteHistory');
const AnalyticsService = require('../services/analyticsService');
const AgentOrchestrator = require('../agents/Orchestrator');
const { db } = require('../config/database');

class AdminController {
    static async getSystemMetrics(req, res) {
        try {
            const metrics = await AnalyticsService.getSystemMetrics();
            res.json(metrics);
        } catch (error) {
            console.error('Get metrics error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getAnalyticsData(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            const defaultEndDate = new Date();
            const defaultStartDate = new Date(defaultEndDate);
            defaultStartDate.setDate(defaultStartDate.getDate() - 30); // Last 30 days
            
            const analyticsData = {
                commutesPerDay: await AnalyticsService.generateCommutesPerDay(
                    startDate || defaultStartDate,
                    endDate || defaultEndDate
                ),
                revenueTrend: await AnalyticsService.generateRevenueTrend(
                    startDate || defaultStartDate,
                    endDate || defaultEndDate
                ),
                peakHours: await AnalyticsService.generatePeakHours(
                    startDate || defaultStartDate,
                    endDate || defaultEndDate
                ),
                modeDistribution: await AnalyticsService.generateModeDistribution(
                    startDate || defaultStartDate,
                    endDate || defaultEndDate
                ),
                generatedAt: new Date().toISOString()
            };
            
            res.json(analyticsData);
        } catch (error) {
            console.error('Get analytics error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    static async getAgentEnhancedAnalytics(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            // Use agent orchestrator for enhanced analytics
            const orchestrator = new AgentOrchestrator();
            const enhancedAnalytics = await orchestrator.generateEnhancedAnalytics(startDate, endDate);
            
            res.json(enhancedAnalytics);
        } catch (error) {
            console.error('Get agent enhanced analytics error:', error);
            res.status(500).json({ error: 'Failed to generate enhanced analytics' });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;
            
            
            
            const [users] = await db.execute(
                `SELECT id, name, email, role, created_at 
                 FROM users 
                 ORDER BY created_at DESC 
                 LIMIT ? OFFSET ?`,
                [parseInt(limit), parseInt(offset)]
            );
            
            const [total] = await db.execute('SELECT COUNT(*) as count FROM users');
            
            res.json({
                users,
                total: total[0].count,
                page: parseInt(page),
                totalPages: Math.ceil(total[0].count / limit)
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getUserStats(req, res) {
        try {
            
            
            const [stats] = await db.execute(`
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
            
            res.json(stats);
        } catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    static async getAgentLogs(req, res) {
        try {
            const { limit = 100 } = req.query;
            
            
            
            const [logs] = await db.execute(
                `SELECT * FROM agent_logs 
                 ORDER BY created_at DESC 
                 LIMIT ?`,
                [parseInt(limit)]
            );
            
            res.json(logs);
        } catch (error) {
            console.error('Get agent logs error:', error);
            res.status(500).json({ error: 'Failed to fetch agent logs' });
        }
    }
    
    static async getAgentHealth(req, res) {
        try {
            
            
            // Get recent agent activity
            const [recentActivity] = await db.execute(`
                SELECT 
                    COUNT(*) as total_requests_last_hour,
                    AVG(processing_time_ms) as avg_response_time,
                    SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as error_count
                FROM agent_logs
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
            `);
            
            // Get agent status
            const orchestrator = new AgentOrchestrator();
            const agentStatus = await orchestrator.checkHealth();
            
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                metrics: recentActivity[0],
                agents: agentStatus
            });
        } catch (error) {
            console.error('Get agent health error:', error);
            res.status(500).json({ error: 'Failed to check agent health' });
        }
    }
}

module.exports = AdminController;