// frontend/src/pages/AdminDashboard/AdminRoutes.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminRoutes } from '../../hooks/useAdminQueries';
import { adminAPI } from '../../services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Route,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminRoutes = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const queryClient = useQueryClient();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Wait for auth to finish loading before checking admin status
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check admin status only once after auth finishes loading
  const isUserAdmin = isAdmin();
  if (!hasCheckedAuth) {
    setHasCheckedAuth(true);
    if (!isUserAdmin) {
      navigate('/');
      return null;
    }
  }

  // Redirect if not admin on subsequent renders
  if (!isUserAdmin) {
    return null;
  }

  // TanStack Query hooks - automatically cache and deduplicate requests
  const { data: routesData, isLoading, refetch } = useAdminRoutes(pagination.page, pagination.limit);
  
  // Delete mutation
  const deleteRouteMutation = useMutation({
    mutationFn: (routeId) => adminAPI.deleteRoute(routeId),
    onSuccess: () => {
      toast.success('Route deleted successfully');
      setShowDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'routes'] });
    },
    onError: (error) => {
      console.error('Error deleting route:', error);
      toast.error('Failed to delete route');
    }
  });

  // Derived state from query results
  const routes = routesData?.routes || routesData || [];
  const total = routesData?.total || 0;
  const totalPages = Math.ceil(total / pagination.limit);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    refetch();
  };

  const handleDelete = (routeId) => {
    deleteRouteMutation.mutate(routeId);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price) => {
    if (price == null) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (isLoading && routes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Route Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor commute routes</p>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Routes Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                        {route.source || route.origin || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                        {route.destination || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Route className="h-4 w-4 mr-2" />
                      {route.transport_mode || route.mode || route.travel_mode || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {route.processing_time_ms ? formatDuration(Math.round(route.processing_time_ms / 60000)) : (route.duration || route.estimated_time || 'N/A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatPrice(route.price || route.estimated_cost || route.total_cost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {route.status === 'planned' || route.status === 'active' || route.isActive !== false ? (
                      <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {route.status || 'Active'}
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 dark:text-red-400 text-sm">
                        <XCircle className="h-4 w-4 mr-1" />
                        {route.status || 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedRoute(route)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(route.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Route Details Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">Route Details</h2>
                <button onClick={() => setSelectedRoute(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Origin</label>
                    <p className="text-gray-900 dark:text-white">{selectedRoute.source || selectedRoute.origin || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Destination</label>
                    <p className="text-gray-900 dark:text-white">{selectedRoute.destination || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Travel Date</label>
                    <p className="text-gray-900 dark:text-white">{selectedRoute.travel_date ? new Date(selectedRoute.travel_date).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <p className="text-gray-900 dark:text-white">{selectedRoute.status || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Agent Processed</label>
                    <p className="text-gray-900 dark:text-white">{selectedRoute.agent_processed ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Processing Time</label>
                    <p className="text-gray-900 dark:text-white">{selectedRoute.processing_time_ms ? `${selectedRoute.processing_time_ms}ms` : 'N/A'}</p>
                  </div>
                  {selectedRoute.user_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                      <p className="text-gray-900 dark:text-white">{selectedRoute.user_name}</p>
                    </div>
                  )}
                  {selectedRoute.user_email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedRoute.user_email}</p>
                    </div>
                  )}
                  {selectedRoute.created_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedRoute.created_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Confirm Delete</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this route? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Route
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoutes;