// frontend/src/hooks/useAlertQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';

export const queryKeys = {
    alerts: 'alerts',
    agentAlerts: 'agentAlerts',
    unreadCount: 'unreadCount'
};

export const useAlerts = ({ unreadOnly = false, limit = 10, enabled = true } = {}) => {
    return useQuery({
        queryKey: [queryKeys.alerts, unreadOnly, limit],
        queryFn: () => userAPI.getAlerts(unreadOnly, limit),
        enabled,
        staleTime: 1 * 60 * 1000, // 1 minute
        select: (response) => response.data
    });
};

export const useAgentAlerts = ({ unreadOnly = false, limit = 10, enabled = true } = {}) => {
    return useQuery({
        queryKey: [queryKeys.agentAlerts, unreadOnly, limit],
        queryFn: () => userAPI.getAgentGeneratedAlerts(unreadOnly, limit),
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        select: (response) => response.data
    });
};

export const useMarkAlertAsRead = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (alertId) => userAPI.markAlertAsRead(alertId),
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.alerts]);
            queryClient.invalidateQueries([queryKeys.unreadCount]);
        }
    });
};

export const useMarkAllAlertsAsRead = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => userAPI.markAllAlertsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.alerts]);
            queryClient.invalidateQueries([queryKeys.unreadCount]);
        }
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: [queryKeys.unreadCount],
        queryFn: async () => {
            const response = await userAPI.getAlerts(true, 1);
            return response.data.unreadCount || 0;
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000 // 1 minute
    });
};