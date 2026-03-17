// frontend/src/pages/AdminDashboard/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Settings,
  Save,
  RefreshCw,
  Trash2,
  Plus,
  X,
  Edit,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminSettings = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingSetting, setEditingSetting] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', category: 'general', description: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Query and mutations - MUST be called unconditionally at the top level
  const { data: settings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      try {
        const response = await adminAPI.getSettings();
        return response.data || [];
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Using default settings');
        return getDefaultSettings();
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }) => adminAPI.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Setting saved successfully');
      setEditingSetting(null);
    },
    onError: (error) => {
      console.error('Error saving setting:', error);
      toast.error('Failed to save setting');
    },
  });

  const createSettingMutation = useMutation({
    mutationFn: (setting) => adminAPI.createSetting(setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Setting created successfully');
      setShowAddModal(false);
      setNewSetting({ key: '', value: '', category: 'general', description: '' });
    },
    onError: (error) => {
      console.error('Error creating setting:', error);
      toast.error('Failed to create setting');
    },
  });

  const deleteSettingMutation = useMutation({
    mutationFn: (key) => adminAPI.deleteSetting(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Setting deleted successfully');
      setShowDeleteConfirm(null);
    },
    onError: (error) => {
      console.error('Error deleting setting:', error);
      toast.error('Failed to delete setting');
    },
  });

  const getDefaultSettings = () => [
    { id: 1, key: 'site_name', value: 'CommuteGo', category: 'general', description: 'Website name' },
    { id: 2, key: 'site_email', value: 'support@commutego.com', category: 'general', description: 'Contact email' },
    { id: 3, key: 'maintenance_mode', value: 'false', category: 'system', description: 'Enable maintenance mode' },
    { id: 4, key: 'max_route_options', value: '10', category: 'limits', description: 'Maximum route options per search' },
    { id: 5, key: 'cache_duration', value: '3600', category: 'performance', description: 'Cache duration in seconds' },
    { id: 6, key: 'allow_registration', value: 'true', category: 'auth', description: 'Allow new user registration' },
    { id: 7, key: 'email_verification', value: 'true', category: 'auth', description: 'Require email verification' },
    { id: 8, key: 'session_timeout', value: '86400', category: 'auth', description: 'Session timeout in seconds' },
  ];

  const handleSave = (setting) => {
    updateSettingMutation.mutate({ key: setting.key, value: setting.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    createSettingMutation.mutate(newSetting);
  };

  const handleDelete = (settingKey) => {
    deleteSettingMutation.mutate(settingKey);
  };

  const getCategories = () => {
    const categories = new Set(settings.map(s => s.category));
    return ['all', ...Array.from(categories)];
  };

  const filteredSettings = activeTab === 'all' 
    ? settings 
    : settings.filter(s => s.category === activeTab);

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      system: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      limits: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      performance: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      auth: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      email: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      payment: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  // Auth check - must come AFTER all hooks
  useEffect(() => {
    if (!authLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  if (authLoading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6  min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure system settings and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Setting
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {getCategories().map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Settings List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSettings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p>No settings found</p>
                  </td>
                </tr>
              ) : (
                filteredSettings.map((setting) => (
                  <tr key={setting.key} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {setting.key}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {editingSetting?.key === setting.key ? (
                        <input
                          type="text"
                          value={editingSetting.value}
                          onChange={(e) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white font-mono">
                          {setting.value.length > 50 ? setting.value.substring(0, 50) + '...' : setting.value}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(setting.category)}`}>
                        {setting.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingSetting?.key === setting.key ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSave(editingSetting)}
                            disabled={updateSettingMutation.isPending}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setEditingSetting(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingSetting({ ...setting })}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(setting.key)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Setting Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">Add New Setting</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key</label>
                  <input
                    type="text"
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                    placeholder="e.g., site_name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                  <input
                    type="text"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    placeholder="e.g., CommuteGo"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={newSetting.category}
                    onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="general">General</option>
                    <option value="system">System</option>
                    <option value="limits">Limits</option>
                    <option value="performance">Performance</option>
                    <option value="auth">Authentication</option>
                    <option value="email">Email</option>
                    <option value="payment">Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                    placeholder="Optional description"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createSettingMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createSettingMutation.isPending ? 'Creating...' : 'Create Setting'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-bold dark:text-white">Confirm Delete</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this setting? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Setting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;