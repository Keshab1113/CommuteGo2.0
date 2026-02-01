// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const commuteAPI = {
  plan: (data) => api.post('/commute/plan', data),
  getRoutes: (limit = 10) => api.get(`/commute/routes?limit=${limit}`),
  getRouteOptions: (routeId) => api.get(`/commute/routes/${routeId}`),
  saveHistory: (data) => api.post('/commute/history', data),
  getHistory: (limit = 20) => api.get(`/commute/history?limit=${limit}`),
};

export const adminAPI = {
  getMetrics: () => api.get('/admin/metrics'),
  getAnalytics: (startDate, endDate) => 
    api.get(`/admin/analytics?startDate=${startDate}&endDate=${endDate}`),
  getUsers: (page = 1, limit = 20) => 
    api.get(`/admin/users?page=${page}&limit=${limit}`),
  getUserStats: () => api.get('/admin/users/stats'),
};

export const analyticsAPI = {
  getDashboardData: (cacheKey) => 
    api.get(`/analytics/public/dashboard${cacheKey ? `?cacheKey=${cacheKey}` : ''}`),
  getUserAnalytics: () => api.get('/analytics/user'),
  getRealTimeMetrics: () => api.get('/analytics/admin/real-time'),
};

export const userAPI = {
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/change-password', data),
  getAlerts: (unreadOnly = false, limit = 10) => 
    api.get(`/user/alerts?unreadOnly=${unreadOnly}&limit=${limit}`),
  markAlertAsRead: (alertId) => api.put(`/user/alerts/${alertId}/read`),
  markAllAlertsAsRead: () => api.put('/user/alerts/read-all'),
};

export default api;