// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds for agent processing
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add agent tracking header
        config.headers['X-Agent-Version'] = '2.0';
        config.headers['X-Request-ID'] = generateRequestId();
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log agent metadata if present
        if (response.data?.agentMetadata) {
            console.log('🤖 Agent Processing:', response.data.agentMetadata);
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper to generate unique request IDs
const generateRequestId = () => {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// Commute API with agent endpoints
export const commuteAPI = {
    plan: (data) => api.post('/commute/agent/plan', data), // Agent-powered planning
    getRoutes: (limit = 10) => api.get(`/commute/routes?limit=${limit}`),
    getRouteOptions: (routeId) => api.get(`/commute/routes/${routeId}/agent-optimized`), // Agent-optimized options
    saveHistory: (data) => api.post('/commute/history', data),
    getHistory: (limit = 20) => api.get(`/commute/history?limit=${limit}`),
    getAgentInsights: (routeId) => api.get(`/commute/agent/insights/${routeId}`),
};

// Analytics API
export const analyticsAPI = {
    getDashboardData: () => api.get('/analytics/agent/dashboard'), // Agent-generated insights
    getUserAnalytics: () => api.get('/analytics/user/agent-insights'),
    getRealTimeMetrics: () => api.get('/analytics/admin/real-time'),
    getAgentPerformance: () => api.get('/analytics/admin/agent-performance'),
};

// User API
export const userAPI = {
    updateProfile: (data) => api.put('/user/profile', data),
    changePassword: (data) => api.put('/user/change-password', data),
    getAlerts: (unreadOnly = false, limit = 10) => 
        api.get(`/user/alerts/agent-generated?unreadOnly=${unreadOnly}&limit=${limit}`), // Agent-generated alerts
    markAlertAsRead: (alertId) => api.put(`/user/alerts/${alertId}/read`),
    markAllAlertsAsRead: () => api.put('/user/alerts/read-all'),
    getAgentPreferences: () => api.get('/user/agent/preferences'),
    updateAgentPreferences: (prefs) => api.put('/user/agent/preferences', prefs),
};

// Admin API
export const adminAPI = {
    getMetrics: () => api.get('/admin/metrics'),
    getAnalytics: (startDate, endDate) => 
        api.get(`/admin/analytics/agent-enhanced?startDate=${startDate}&endDate=${endDate}`), // Agent-enhanced analytics
    getUsers: (page = 1, limit = 20) => 
        api.get(`/admin/users?page=${page}&limit=${limit}`),
    getUserStats: () => api.get('/admin/users/stats'),
    getAgentLogs: (limit = 100) => api.get(`/admin/agents/logs?limit=${limit}`),
    getAgentHealth: () => api.get('/admin/agents/health'),
};

export default api;