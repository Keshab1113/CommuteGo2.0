// backend/src/controllers/adminController.js
const User = require('../models/User');
const Route = require('../models/Route');
const CommuteHistory = require('../models/CommuteHistory');
const Alert = require('../models/Alert');
const Setting = require('../models/Setting');
const AnalyticsService = require('../services/analyticsService');
const AgentOrchestrator = require('../agents/Orchestrator');
const Blog = require('../models/Blog');
const FAQ = require('../models/FAQ');
const Contact = require('../models/Contact');
const Job = require('../models/Job');
const PricingPlan = require('../models/PricingPlan');
const { db } = require('../config/database');

class AdminController {
    // ==================== METRICS & ANALYTICS ====================
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
                `SELECT id, name as full_name, email, role, created_at 
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

    // ==================== USER MANAGEMENT ====================
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, role, isActive } = req.body;
            
            const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
            if (existingUser.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const updates = [];
            const values = [];
            
            if (name) {
                updates.push('name = ?');
                values.push(name);
            }
            if (email) {
                updates.push('email = ?');
                values.push(email);
            }
            if (role) {
                updates.push('role = ?');
                values.push(role);
            }
            if (typeof isActive === 'boolean') {
                updates.push('is_active = ?');
                values.push(isActive ? 1 : 0);
            }
            
            if (updates.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }
            
            values.push(id);
            
            await db.execute(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
            
            const [updatedUser] = await db.execute(
                'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?',
                [id]
            );
            
            res.json({ message: 'User updated successfully', user: updatedUser[0] });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            
            // Prevent self-deletion
            if (req.user.id === parseInt(id)) {
                return res.status(400).json({ error: 'Cannot delete your own account' });
            }
            
            const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
            if (existingUser.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            // Delete related data first (commute history, alerts)
            await db.execute('DELETE FROM commute_history WHERE user_id = ?', [id]);
            await db.execute('DELETE FROM alerts WHERE user_id = ?', [id]);
            
            // Delete user
            await db.execute('DELETE FROM users WHERE id = ?', [id]);
            
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== ROUTE MANAGEMENT ====================
    static async getAllRoutes(req, res) {
        try {
            const { page = 1, limit = 20, search = '' } = req.query;
            const offset = (page - 1) * limit;
            
            let query = `
                SELECT r.*, u.name as user_name, u.email as user_email
                FROM routes r
                LEFT JOIN users u ON r.user_id = u.id
            `;
            let countQuery = 'SELECT COUNT(*) as count FROM routes';
            const params = [];
            
            if (search) {
                query += ' WHERE r.origin LIKE ? OR r.destination LIKE ?';
                countQuery += ' WHERE origin LIKE ? OR destination LIKE ?';
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm);
            }
            
            query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
            
            const [routes] = await db.execute(query, [...params, parseInt(limit), parseInt(offset)]);
            const [total] = await db.execute(countQuery, params);
            
            res.json({
                routes,
                total: total[0].count,
                page: parseInt(page),
                totalPages: Math.ceil(total[0].count / limit)
            });
        } catch (error) {
            console.error('Get routes error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteRoute(req, res) {
        try {
            const { id } = req.params;
            
            const [existingRoute] = await db.execute('SELECT id FROM routes WHERE id = ?', [id]);
            if (existingRoute.length === 0) {
                return res.status(404).json({ error: 'Route not found' });
            }
            
            // Delete related route options and tinyfish data
            await db.execute('DELETE FROM route_options WHERE route_id = ?', [id]);
            await db.execute('DELETE FROM tinyfish_route_data WHERE route_id = ?', [id]);
            await db.execute('DELETE FROM routes WHERE id = ?', [id]);
            
            res.json({ message: 'Route deleted successfully' });
        } catch (error) {
            console.error('Delete route error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== ALERT MANAGEMENT ====================
    static async getAllAlerts(req, res) {
        try {
            const { page = 1, limit = 20, type = '', status = '' } = req.query;
            const offset = (page - 1) * limit;
            
            let query = `
                SELECT a.*, u.name as user_name, u.email as user_email
                FROM alerts a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE 1=1
            `;
            const params = [];
            
            if (type) {
                query += ' AND a.type = ?';
                params.push(type);
            }
            if (status) {
                query += ' AND a.status = ?';
                params.push(status);
            }
            
            query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
            
            const [alerts] = await db.execute(query, [...params, parseInt(limit), parseInt(offset)]);
            
            const [total] = await db.execute('SELECT COUNT(*) as count FROM alerts');
            
            res.json({
                alerts,
                total: total[0].count,
                page: parseInt(page),
                totalPages: Math.ceil(total[0].count / limit)
            });
        } catch (error) {
            console.error('Get alerts error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateAlert(req, res) {
        try {
            const { id } = req.params;
            const { title, message, type, status, priority } = req.body;
            
            const [existingAlert] = await db.execute('SELECT id FROM alerts WHERE id = ?', [id]);
            if (existingAlert.length === 0) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            
            const updates = [];
            const values = [];
            
            if (title) {
                updates.push('title = ?');
                values.push(title);
            }
            if (message) {
                updates.push('message = ?');
                values.push(message);
            }
            if (type) {
                updates.push('type = ?');
                values.push(type);
            }
            if (status) {
                updates.push('status = ?');
                values.push(status);
            }
            if (priority) {
                updates.push('priority = ?');
                values.push(priority);
            }
            
            if (updates.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }
            
            values.push(id);
            
            await db.execute(
                `UPDATE alerts SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
            
            const [updatedAlert] = await db.execute('SELECT * FROM alerts WHERE id = ?', [id]);
            
            res.json({ message: 'Alert updated successfully', alert: updatedAlert[0] });
        } catch (error) {
            console.error('Update alert error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteAlert(req, res) {
        try {
            const { id } = req.params;
            
            const [existingAlert] = await db.execute('SELECT id FROM alerts WHERE id = ?', [id]);
            if (existingAlert.length === 0) {
                return res.status(404).json({ error: 'Alert not found' });
            }
            
            await db.execute('DELETE FROM alerts WHERE id = ?', [id]);
            
            res.json({ message: 'Alert deleted successfully' });
        } catch (error) {
            console.error('Delete alert error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== SETTINGS MANAGEMENT ====================
    static async getSettings(req, res) {
        try {
            const { category } = req.query;
            let settings;
            
            if (category && category !== 'all') {
                settings = await Setting.findByCategory(category);
            } else {
                settings = await Setting.findAll();
            }
            
            // Transform to frontend format
            const transformedSettings = settings.map(s => ({
                id: s.id,
                key: s.setting_key,
                value: s.setting_value,
                type: s.setting_type,
                category: s.category,
                description: s.description,
                isPublic: s.is_public,
                createdAt: s.created_at,
                updatedAt: s.updated_at
            }));
            
            res.json(transformedSettings);
        } catch (error) {
            console.error('Get settings error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getSetting(req, res) {
        try {
            const { key } = req.params;
            const setting = await Setting.findByKey(key);
            
            if (!setting) {
                return res.status(404).json({ error: 'Setting not found' });
            }
            
            res.json({
                id: setting.id,
                key: setting.setting_key,
                value: setting.setting_value,
                type: setting.setting_type,
                category: setting.category,
                description: setting.description,
                isPublic: setting.is_public
            });
        } catch (error) {
            console.error('Get setting error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateSetting(req, res) {
        try {
            const { key } = req.params;
            const { value } = req.body;
            
            const success = await Setting.update(key, value);
            
            if (!success) {
                return res.status(404).json({ error: 'Setting not found' });
            }
            
            res.json({ message: 'Setting updated successfully', key, value });
        } catch (error) {
            console.error('Update setting error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async createSetting(req, res) {
        try {
            const { key, value, type, category, description, isPublic } = req.body;
            
            if (!key || !value) {
                return res.status(400).json({ error: 'Key and value are required' });
            }
            
            const existing = await Setting.findByKey(key);
            if (existing) {
                return res.status(400).json({ error: 'Setting key already exists' });
            }
            
            const newSetting = await Setting.create({
                setting_key: key,
                setting_value: value,
                setting_type: type || 'string',
                category: category || 'general',
                description: description || '',
                is_public: isPublic || false
            });
            
            res.status(201).json({ message: 'Setting created successfully', setting: newSetting });
        } catch (error) {
            console.error('Create setting error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteSetting(req, res) {
        try {
            const { key } = req.params;
            
            const success = await Setting.delete(key);
            
            if (!success) {
                return res.status(404).json({ error: 'Setting not found' });
            }
            
            res.json({ message: 'Setting deleted successfully' });
        } catch (error) {
            console.error('Delete setting error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== DASHBOARD STATS ====================
    static async getDashboardStats(req, res) {
        try {
            // Get various stats for dashboard
            const [userStats] = await db.execute(`
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_users_7d,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
                FROM users
            `);
            
            const [routeStats] = await db.execute(`
                SELECT 
                    COUNT(*) as total_routes,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_routes_7d
                FROM routes
            `);
            
            const [commuteStats] = await db.execute(`
                SELECT 
                    COUNT(*) as total_commutes,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as commutes_7d
                FROM commute_history
            `);
            
            const [alertStats] = await db.execute(`
                SELECT 
                    COUNT(*) as total_alerts,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_alerts,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) as alerts_24h
                FROM alerts
            `);
            
            // Get blog, FAQ, job counts
            const [blogStats] = await db.execute('SELECT COUNT(*) as total_blogs FROM blogs');
            const [faqStats] = await db.execute('SELECT COUNT(*) as total_faqs FROM faqs');
            const [jobStats] = await db.execute('SELECT COUNT(*) as total_jobs FROM jobs WHERE is_active = 1');
            const [contactStats] = await db.execute('SELECT COUNT(*) as total_contacts, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END as unread_contacts FROM contacts');
            
            res.json({
                users: userStats[0],
                routes: routeStats[0],
                commutes: commuteStats[0],
                alerts: alertStats[0],
                blogs: { total: blogStats[0].total_blogs },
                faqs: { total: faqStats[0].total_faqs },
                jobs: { active: jobStats[0].total_jobs },
                contacts: { total: contactStats[0].total_contacts, unread: contactStats[0].unread_contacts },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== BLOG MANAGEMENT ====================
    static async getAllBlogs(req, res) {
        try {
            const { page = 1, limit = 10, status = '' } = req.query;
            const blogs = await Blog.findAll(parseInt(page), parseInt(limit), status);
            res.json(blogs);
        } catch (error) {
            console.error('Get all blogs error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getBlog(req, res) {
        try {
            const { id } = req.params;
            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            res.json(blog);
        } catch (error) {
            console.error('Get blog error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async createBlog(req, res) {
        try {
            const { title, content, excerpt, image_url, author, status, tags } = req.body;
            
            if (!title || !content) {
                return res.status(400).json({ error: 'Title and content are required' });
            }
            
            // Generate slug from title
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            const blog = await Blog.create({
                title,
                slug,
                content,
                excerpt: excerpt || content.substring(0, 150) + '...',
                image_url: image_url || '',
                author: author || 'Admin',
                status: status || 'draft',
                tags: tags || ''
            });
            
            res.status(201).json({ message: 'Blog created successfully', blog });
        } catch (error) {
            console.error('Create blog error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateBlog(req, res) {
        try {
            const { id } = req.params;
            const { title, content, excerpt, image_url, author, status, tags } = req.body;
            
            const existing = await Blog.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            
            const updates = {};
            if (title) updates.title = title;
            if (content) updates.content = content;
            if (excerpt) updates.excerpt = excerpt;
            if (image_url !== undefined) updates.image_url = image_url;
            if (author) updates.author = author;
            if (status) updates.status = status;
            if (tags) updates.tags = tags;
            
            const blog = await Blog.update(id, updates);
            res.json({ message: 'Blog updated successfully', blog });
        } catch (error) {
            console.error('Update blog error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            const success = await Blog.delete(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            
            res.json({ message: 'Blog deleted successfully' });
        } catch (error) {
            console.error('Delete blog error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== FAQ MANAGEMENT ====================
    static async getAllFAQs(req, res) {
        try {
            const faqs = await FAQ.findAll();
            res.json(faqs);
        } catch (error) {
            console.error('Get all FAQs error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getFAQ(req, res) {
        try {
            const { id } = req.params;
            const faq = await FAQ.findById(id);
            if (!faq) {
                return res.status(404).json({ error: 'FAQ not found' });
            }
            res.json(faq);
        } catch (error) {
            console.error('Get FAQ error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async createFAQ(req, res) {
        try {
            const { question, answer, category, order_index, is_active } = req.body;
            
            if (!question || !answer) {
                return res.status(400).json({ error: 'Question and answer are required' });
            }
            
            const faq = await FAQ.create({
                question,
                answer,
                category: category || 'general',
                order_index: order_index || 0,
                is_active: is_active !== false
            });
            
            res.status(201).json({ message: 'FAQ created successfully', faq });
        } catch (error) {
            console.error('Create FAQ error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateFAQ(req, res) {
        try {
            const { id } = req.params;
            const { question, answer, category, order_index, is_active } = req.body;
            
            const existing = await FAQ.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'FAQ not found' });
            }
            
            const updates = {};
            if (question) updates.question = question;
            if (answer) updates.answer = answer;
            if (category) updates.category = category;
            if (order_index !== undefined) updates.order_index = order_index;
            if (is_active !== undefined) updates.is_active = is_active;
            
            const faq = await FAQ.update(id, updates);
            res.json({ message: 'FAQ updated successfully', faq });
        } catch (error) {
            console.error('Update FAQ error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteFAQ(req, res) {
        try {
            const { id } = req.params;
            const success = await FAQ.delete(id);
            
            if (!success) {
                return res.status(404).json({ error: 'FAQ not found' });
            }
            
            res.json({ message: 'FAQ deleted successfully' });
        } catch (error) {
            console.error('Delete FAQ error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async reorderFAQs(req, res) {
        try {
            const { faqIds } = req.body;
            
            if (!faqIds || !Array.isArray(faqIds)) {
                return res.status(400).json({ error: 'FAQ IDs array is required' });
            }
            
            await FAQ.reorder(faqIds);
            res.json({ message: 'FAQs reordered successfully' });
        } catch (error) {
            console.error('Reorder FAQs error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== CONTACT MANAGEMENT ====================
    static async getAllContacts(req, res) {
        try {
            const { page = 1, limit = 20, is_read } = req.query;
            const contacts = await Contact.findAll(parseInt(page), parseInt(limit), is_read);
            res.json(contacts);
        } catch (error) {
            console.error('Get all contacts error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getContact(req, res) {
        try {
            const { id } = req.params;
            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json(contact);
        } catch (error) {
            console.error('Get contact error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateContact(req, res) {
        try {
            const { id } = req.params;
            const { is_read, notes } = req.body;
            
            const existing = await Contact.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            
            const updates = {};
            if (is_read !== undefined) updates.is_read = is_read;
            if (notes !== undefined) updates.notes = notes;
            
            const contact = await Contact.update(id, updates);
            res.json({ message: 'Contact updated successfully', contact });
        } catch (error) {
            console.error('Update contact error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteContact(req, res) {
        try {
            const { id } = req.params;
            const success = await Contact.delete(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            
            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            console.error('Delete contact error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== JOB MANAGEMENT ====================
    static async getAllJobs(req, res) {
        try {
            const { page = 1, limit = 10, is_active } = req.query;
            const jobs = await Job.findAll(parseInt(page), parseInt(limit), is_active);
            res.json(jobs);
        } catch (error) {
            console.error('Get all jobs error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getJob(req, res) {
        try {
            const { id } = req.params;
            const job = await Job.findById(id);
            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }
            res.json(job);
        } catch (error) {
            console.error('Get job error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async createJob(req, res) {
        try {
            const { title, department, location, type, description, requirements, salary_range, is_active } = req.body;
            
            if (!title || !department || !location || !description) {
                return res.status(400).json({ error: 'Title, department, location, and description are required' });
            }
            
            // Generate slug from title
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            const job = await Job.create({
                title,
                slug,
                department,
                location,
                type: type || 'full-time',
                description,
                requirements: requirements || '',
                salary_range: salary_range || '',
                is_active: is_active !== false
            });
            
            res.status(201).json({ message: 'Job created successfully', job });
        } catch (error) {
            console.error('Create job error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateJob(req, res) {
        try {
            const { id } = req.params;
            const { title, department, location, type, description, requirements, salary_range, is_active } = req.body;
            
            const existing = await Job.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Job not found' });
            }
            
            const updates = {};
            if (title) updates.title = title;
            if (department) updates.department = department;
            if (location) updates.location = location;
            if (type) updates.type = type;
            if (description) updates.description = description;
            if (requirements !== undefined) updates.requirements = requirements;
            if (salary_range !== undefined) updates.salary_range = salary_range;
            if (is_active !== undefined) updates.is_active = is_active;
            
            const job = await Job.update(id, updates);
            res.json({ message: 'Job updated successfully', job });
        } catch (error) {
            console.error('Update job error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteJob(req, res) {
        try {
            const { id } = req.params;
            const success = await Job.delete(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Job not found' });
            }
            
            res.json({ message: 'Job deleted successfully' });
        } catch (error) {
            console.error('Delete job error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async toggleJobActive(req, res) {
        try {
            const { id } = req.params;
            const job = await Job.toggleActive(id);
            
            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }
            
            res.json({ message: 'Job status toggled', job });
        } catch (error) {
            console.error('Toggle job error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // ==================== PRICING MANAGEMENT ====================
    static async getAllPricingPlans(req, res) {
        try {
            const plans = await PricingPlan.findAll();
            res.json(plans);
        } catch (error) {
            console.error('Get all pricing plans error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getPricingPlan(req, res) {
        try {
            const { id } = req.params;
            const plan = await PricingPlan.findById(id);
            if (!plan) {
                return res.status(404).json({ error: 'Pricing plan not found' });
            }
            res.json(plan);
        } catch (error) {
            console.error('Get pricing plan error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async createPricingPlan(req, res) {
        try {
            const { name, description, price, billing_period, features, is_active, is_featured, order_index } = req.body;
            
            if (!name || price === undefined) {
                return res.status(400).json({ error: 'Name and price are required' });
            }
            
            // Generate slug from name
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            const plan = await PricingPlan.create({
                name,
                slug,
                description: description || '',
                price: parseFloat(price),
                billing_period: billing_period || 'monthly',
                features: features || '',
                is_active: is_active !== false,
                is_featured: is_featured || false,
                order_index: order_index || 0
            });
            
            res.status(201).json({ message: 'Pricing plan created successfully', plan });
        } catch (error) {
            console.error('Create pricing plan error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updatePricingPlan(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, billing_period, features, is_active, is_featured, order_index } = req.body;
            
            const existing = await PricingPlan.findById(id);
            if (!existing) {
                return res.status(404).json({ error: 'Pricing plan not found' });
            }
            
            const updates = {};
            if (name) updates.name = name;
            if (description !== undefined) updates.description = description;
            if (price !== undefined) updates.price = parseFloat(price);
            if (billing_period) updates.billing_period = billing_period;
            if (features !== undefined) updates.features = features;
            if (is_active !== undefined) updates.is_active = is_active;
            if (is_featured !== undefined) updates.is_featured = is_featured;
            if (order_index !== undefined) updates.order_index = order_index;
            
            const plan = await PricingPlan.update(id, updates);
            res.json({ message: 'Pricing plan updated successfully', plan });
        } catch (error) {
            console.error('Update pricing plan error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deletePricingPlan(req, res) {
        try {
            const { id } = req.params;
            const success = await PricingPlan.delete(id);
            
            if (!success) {
                return res.status(404).json({ error: 'Pricing plan not found' });
            }
            
            res.json({ message: 'Pricing plan deleted successfully' });
        } catch (error) {
            console.error('Delete pricing plan error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async reorderPricingPlans(req, res) {
        try {
            const { planIds } = req.body;
            
            if (!planIds || !Array.isArray(planIds)) {
                return res.status(400).json({ error: 'Plan IDs array is required' });
            }
            
            await PricingPlan.reorder(planIds);
            res.json({ message: 'Pricing plans reordered successfully' });
        } catch (error) {
            console.error('Reorder pricing plans error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = AdminController;