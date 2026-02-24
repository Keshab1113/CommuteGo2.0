// frontend/src/hooks/useCommuteQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commuteAPI } from '../services/api';

// Query keys
export const queryKeys = {
    routes: 'routes',
    history: 'history',
    alerts: 'alerts',
    analytics: 'analytics',
    routeOptions: (routeId) => ['routeOptions', routeId]
};

// Custom hooks for agentic data fetching
export const useRoutes = (limit = 10) => {
    return useQuery({
        queryKey: [queryKeys.routes, limit],
        queryFn: () => commuteAPI.getRoutes(limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
        select: (data) => data.data
    });
};

export const useCommuteHistory = (limit = 20) => {
    return useQuery({
        queryKey: [queryKeys.history, limit],
        queryFn: () => commuteAPI.getHistory(limit),
        staleTime: 5 * 60 * 1000,
        select: (data) => data.data
    });
};

export const useRouteOptions = (routeId) => {
    return useQuery({
        queryKey: queryKeys.routeOptions(routeId),
        queryFn: () => commuteAPI.getRouteOptions(routeId),
        enabled: !!routeId,
        staleTime: 30 * 60 * 1000, // 30 minutes - route options don't change often
        select: (data) => data.data
    });
};

export const usePlanCommute = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (commuteData) => commuteAPI.plan(commuteData),
        onSuccess: (data) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries([queryKeys.routes]);
            // Show success message
        },
        onError: (error) => {
            // Handle error
        }
    });
};

export const useSaveHistory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (historyData) => commuteAPI.saveHistory(historyData),
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeys.history]);
            queryClient.invalidateQueries([queryKeys.analytics]);
        }
    });
};