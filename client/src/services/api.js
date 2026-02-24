// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Track retry attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

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
        config.headers['X-Client-Version'] = '1.0.0';
        
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
    async (error) => {
        const originalRequest = error.config;
        
        // Handle rate limiting (429)
        if (error.response?.status === 429) {
            console.warn('Rate limit exceeded:', error.response.data);
            
            // Create custom error with retry info
            const rateLimitError = new Error(error.response.data.error || 'Too many requests');
            rateLimitError.isRateLimit = true;
            rateLimitError.retryAfter = error.response.data.retryAfter || 1;
            
            return Promise.reject(rateLimitError);
        }
        
        // Handle token expiration (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for token refresh
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh token
                const response = await api.post('/auth/refresh');
                const { token } = response.data;
                
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                processQueue(null, token);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // Only redirect to login if refresh fails
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Handle other errors
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
    refreshToken: () => api.post('/auth/refresh'),
};

// Commute API
export const commuteAPI = {
    plan: (data) => api.post('/commute/agent/plan', data),
    getRoutes: (limit = 10) => api.get(`/commute/routes?limit=${limit}`),
    getRouteOptions: (routeId) => api.get(`/commute/routes/${routeId}/agent-optimized`),
    saveHistory: (data) => api.post('/commute/history', data),
    getHistory: (limit = 20) => api.get(`/commute/history?limit=${limit}`),
    getAgentInsights: (routeId) => api.get(`/commute/agent/insights/${routeId}`),
};

// Analytics API
export const analyticsAPI = {
    getDashboardData: () => api.get('/analytics/agent/dashboard'),
    getUserAnalytics: () => api.get('/analytics/user/agent-insights'),
    getRealTimeMetrics: () => api.get('/analytics/admin/real-time'),
    getAgentPerformance: () => api.get('/analytics/admin/agent-performance'),
    getAgentInsights: () => api.get('/analytics/agent/insights'), // ← This matches the new route
    getRouteAgentInsights: (routeId) => api.get(`/analytics/agent/insights/${routeId}`),
};

// User API
export const userAPI = {
    updateProfile: (data) => api.put('/user/profile', data),
    changePassword: (data) => api.put('/user/change-password', data),
    getAlerts: (unreadOnly = false, limit = 10) => 
        api.get(`/user/alerts/agent-generated?unreadOnly=${unreadOnly}&limit=${limit}`),
    markAlertAsRead: (alertId) => api.put(`/user/alerts/${alertId}/read`),
    markAllAlertsAsRead: () => api.put('/user/alerts/read-all'),
    getAgentPreferences: () => api.get('/user/agent/preferences'),
    updateAgentPreferences: (prefs) => api.put('/user/agent/preferences', prefs),
};

// Admin API
export const adminAPI = {
    getMetrics: () => api.get('/admin/metrics'),
    getAnalytics: (startDate, endDate) => 
        api.get(`/admin/analytics/agent-enhanced?startDate=${startDate}&endDate=${endDate}`),
    getUsers: (page = 1, limit = 20) => 
        api.get(`/admin/users?page=${page}&limit=${limit}`),
    getUserStats: () => api.get('/admin/users/stats'),
    getAgentLogs: (limit = 100) => api.get(`/admin/agents/logs?limit=${limit}`),
    getAgentHealth: () => api.get('/admin/agents/health'),
};

export default api;