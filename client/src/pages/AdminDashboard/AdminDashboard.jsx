// frontend/src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminMetrics, useAdminAnalytics } from '../../hooks/useAdminQueries';
import toast from 'react-hot-toast';
import {
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  Download,
  Activity,
  PieChart,
  BarChart3,
  LineChart,
  FileText,
  MessageCircle,
  Briefcase,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // TanStack Query hooks - MUST be called unconditionally at the top level
  // Use enabled option to conditionally enable queries based on admin status
  const { data: metricsData, isLoading, isRefetching: metricsRefetching, refetch: refetchMetrics } = useAdminMetrics();
  const { data: analyticsData, isRefetching: analyticsRefetching, refetch: refetchAnalytics } = useAdminAnalytics('30days');

  // Wait for auth to finish loading before checking admin status
  // This prevents the "Rendered more hooks than during the previous render" error
  // that occurs when isAdmin() returns false during loading and causes a redirect
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only check admin status once after auth finishes loading
  // Store result to prevent re-checking which could cause hook inconsistency
  const isUserAdmin = isAdmin();
  if (!hasCheckedAuth) {
    setHasCheckedAuth(true);
    if (!isUserAdmin) {
      navigate('/');
      return null;
    }
  }

  // If we navigated away, don't render anything
  if (!isUserAdmin) {
    return null;
  }

  // Derived state from query results
  const metrics = metricsData || { totalUsers: 0, totalRoutes: 0, totalCommutes: 0, totalRevenue: 0 };
  const analytics = analyticsData;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMetrics(), refetchAnalytics()]);
    setRefreshing(false);
    toast.success('Analytics refreshed');
  };

  // Combine refetching states
  const loading = isLoading || refreshing;

  const handleExport = () => {
    const dataStr = JSON.stringify({ metrics, analytics }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `commutego-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                System analytics and performance metrics
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                <span>Refresh Data</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
          {analytics && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date(analytics.generatedAt).toLocaleString()}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1 dark:text-white">{formatNumber(metrics.totalUsers)}</h3>
                <p className="text-gray-600 dark:text-gray-400">Total Users</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MapPin className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1 dark:text-white">{formatNumber(metrics.totalRoutes)}</h3>
                <p className="text-gray-600 dark:text-gray-400">Routes Planned</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Activity className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1 dark:text-white">{formatNumber(metrics.totalCommutes)}</h3>
                <p className="text-gray-600 dark:text-gray-400">Completed Commutes</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <DollarSign className="text-yellow-600 dark:text-yellow-400" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1 dark:text-white">{formatCurrency(metrics.totalRevenue)}</h3>
                <p className="text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
            </div>

            {/* Management Quick Access */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Content Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link
                  to="/admin/blogs"
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                  </div>
                  <h3 className="font-semibold dark:text-white mb-1">Blog Posts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage blog articles</p>
                </Link>

                <Link
                  to="/admin/faqs"
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <MessageCircle className="text-green-600 dark:text-green-400" size={20} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                  </div>
                  <h3 className="font-semibold dark:text-white mb-1">FAQs</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage FAQ entries</p>
                </Link>

                <Link
                  to="/admin/contacts"
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <MessageCircle className="text-purple-600 dark:text-purple-400" size={20} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                  </div>
                  <h3 className="font-semibold dark:text-white mb-1">Contacts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View contact submissions</p>
                </Link>

                <Link
                  to="/admin/jobs"
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Briefcase className="text-orange-600 dark:text-orange-400" size={20} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                  </div>
                  <h3 className="font-semibold dark:text-white mb-1">Jobs</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage job postings</p>
                </Link>

                <Link
                  to="/admin/pricing"
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Tag className="text-yellow-600 dark:text-yellow-400" size={20} />
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
                  </div>
                  <h3 className="font-semibold dark:text-white mb-1">Pricing</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage pricing plans</p>
                </Link>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Commutes per Day */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1 dark:text-white">Commutes per Day</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
                  </div>
                  <LineChart className="text-primary-600" size={24} />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analytics.commutesPerDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1 dark:text-white">Revenue Trend</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily revenue (USD)</p>
                  </div>
                  <BarChart3 className="text-green-600" size={24} />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1 dark:text-white">Peak Commute Hours</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Busiest times of day</p>
                  </div>
                  <Clock className="text-purple-600" size={24} />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.peakHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mode Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1 dark:text-white">Transport Mode Distribution</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Most used transport types</p>
                  </div>
                  <PieChart className="text-pink-600" size={24} />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics.modeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ mode, percentage }) => `${mode}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.modeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [
                        `${value} trips (${props.payload.percentage}%)`,
                        props.payload.mode
                      ]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Data Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Daily Commutes</p>
                  <p className="font-semibold dark:text-white">
                    {analytics.commutesPerDay.length > 0
                      ? Math.round(analytics.commutesPerDay.reduce((sum, day) => sum + day.count, 0) / analytics.commutesPerDay.length)
                      : 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Most Popular Mode</p>
                  <p className="font-semibold capitalize dark:text-white">
                    {analytics.modeDistribution.length > 0 ? analytics.modeDistribution[0].mode.toLowerCase() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peak Hour</p>
                  <p className="font-semibold dark:text-white">
                    {analytics.peakHours.length > 0
                      ? analytics.peakHours.reduce((prev, current) => (prev.count > current.count) ? prev : current).hour
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Period</p>
                  <p className="font-semibold dark:text-white">
                    {analytics.commutesPerDay.length > 0
                      ? `${analytics.commutesPerDay[0].date} - ${analytics.commutesPerDay[analytics.commutesPerDay.length - 1].date}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;