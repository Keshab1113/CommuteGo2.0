// frontend/src/hooks/useAdminQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI, analyticsAPI } from '../services/api';

// Query keys for admin
export const adminQueryKeys = {
    metrics: ['admin', 'metrics'],
    analytics: (timeRange) => ['admin', 'analytics', timeRange],
    realTimeMetrics: ['admin', 'realTimeMetrics'],
    users: (page, limit) => ['admin', 'users', page, limit],
    routes: (page, limit) => ['admin', 'routes', page, limit],
    alerts: (page, limit) => ['admin', 'alerts', page, limit],
    faqs: ['admin', 'faqs'],
    blogs: (status) => ['admin', 'blogs', status],
    contacts: ['admin', 'contacts'],
    jobs: ['admin', 'jobs'],
    pricing: ['admin', 'pricing'],
    settings: ['admin', 'settings']
};

// Hook for admin metrics
export const useAdminMetrics = () => {
    return useQuery({
        queryKey: adminQueryKeys.metrics,
        queryFn: () => adminAPI.getMetrics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        select: (data) => data.data
    });
};

// Hook for admin analytics with time range
export const useAdminAnalytics = (timeRange = '30days') => {
    return useQuery({
        queryKey: adminQueryKeys.analytics(timeRange),
        queryFn: () => {
            const dateRange = getDateRange(timeRange);
            return adminAPI.getAnalytics(dateRange);
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        select: (data) => data.data
    });
};

// Hook for real-time metrics
export const useRealTimeMetrics = () => {
    return useQuery({
        queryKey: adminQueryKeys.realTimeMetrics,
        queryFn: () => analyticsAPI.getRealTimeMetrics(),
        staleTime: 30 * 1000, // 30 seconds for real-time data
        cacheTime: 60 * 1000, // 1 minute
        refetchInterval: 60000, // Auto-refresh every minute
        refetchOnWindowFocus: true,
        select: (data) => data.data
    });
};

// Hook for paginated users
export const useAdminUsers = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: adminQueryKeys.users(page, limit),
        queryFn: () => adminAPI.getUsers(page, limit),
        staleTime: 2 * 60 * 1000, // 2 minutes
        keepPreviousData: true,
        select: (data) => data.data
    });
};

// Hook for paginated routes
export const useAdminRoutes = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: adminQueryKeys.routes(page, limit),
        queryFn: () => adminAPI.getAllRoutes(page, limit),
        staleTime: 2 * 60 * 1000,
        keepPreviousData: true,
        select: (data) => data.data
    });
};

// Hook for paginated alerts
export const useAdminAlerts = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: adminQueryKeys.alerts(page, limit),
        queryFn: () => adminAPI.getAllAlerts(page, limit),
        staleTime: 2 * 60 * 1000,
        keepPreviousData: true,
        select: (data) => data.data
    });
};

// Hook for FAQs
export const useFAQs = () => {
    return useQuery({
        queryKey: adminQueryKeys.faqs,
        queryFn: () => adminAPI.getAllFAQs(),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        select: (data) => data.data
    });
};

// Hook for blogs with optional status filter
export const useBlogs = (status = null) => {
    return useQuery({
        queryKey: adminQueryKeys.blogs(status),
        queryFn: () => adminAPI.getAllBlogs(status),
        staleTime: 2 * 60 * 1000,
        keepPreviousData: true,
        select: (data) => data.data
    });
};

// Hook for contacts
export const useContacts = () => {
    return useQuery({
        queryKey: adminQueryKeys.contacts,
        queryFn: () => adminAPI.getAllContacts(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data
    });
};

// Hook for jobs
export const useJobs = () => {
    return useQuery({
        queryKey: adminQueryKeys.jobs,
        queryFn: () => adminAPI.getAllJobs(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data
    });
};

// Hook for pricing
export const usePricingPlans = () => {
    return useQuery({
        queryKey: adminQueryKeys.pricing,
        queryFn: () => adminAPI.getAllPricing(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data
    });
};

// Hook for settings
export const useSettings = () => {
    return useQuery({
        queryKey: adminQueryKeys.settings,
        queryFn: () => adminAPI.getSettings(),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data
    });
};

// Mutations
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ userId, data }) => adminAPI.updateUser(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (userId) => adminAPI.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });
};

export const useCreateFAQ = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (faqData) => adminAPI.createFAQ(faqData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.faqs });
        }
    });
};

export const useUpdateFAQ = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }) => adminAPI.updateFAQ(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.faqs });
        }
    });
};

export const useDeleteFAQ = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => adminAPI.deleteFAQ(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.faqs });
        }
    });
};

export const useToggleFAQ = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, isActive }) => adminAPI.updateFAQ(id, { is_active: !isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.faqs });
        }
    });
};

export const useReorderFAQs = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (faqs) => adminAPI.reorderFAQs(faqs),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.faqs });
        }
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => adminAPI.deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
        }
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (settings) => adminAPI.updateSettings(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.settings });
        }
    });
};

// Helper function to get date range
function getDateRange(timeRange) {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
        case '7days':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '30days':
            startDate.setDate(startDate.getDate() - 30);
            break;
        case '90days':
            startDate.setDate(startDate.getDate() - 90);
            break;
        case '1year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        default:
            startDate.setDate(startDate.getDate() - 30);
    }
    
    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}