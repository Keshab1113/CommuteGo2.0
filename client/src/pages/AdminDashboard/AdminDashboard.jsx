// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
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
  LineChart
} from 'lucide-react';
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
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalRoutes: 0,
    totalCommutes: 0,
    totalRevenue: 0
  });
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/';
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsResponse, analyticsResponse] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getAnalytics()
      ]);
      
      setMetrics(metricsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Analytics refreshed');
  };

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

  if (!isAdmin()) {
    return null;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                System analytics and performance metrics
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
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
            <div className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(analytics.generatedAt).toLocaleString()}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{formatNumber(metrics.totalUsers)}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MapPin className="text-green-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{formatNumber(metrics.totalRoutes)}</h3>
                <p className="text-gray-600">Routes Planned</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Activity className="text-purple-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{formatNumber(metrics.totalCommutes)}</h3>
                <p className="text-gray-600">Completed Commutes</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="text-yellow-600" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{formatCurrency(metrics.totalRevenue)}</h3>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Commutes per Day */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Commutes per Day</h3>
                    <p className="text-sm text-gray-600">Last 30 days</p>
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Revenue Trend</h3>
                    <p className="text-sm text-gray-600">Daily revenue (USD)</p>
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Peak Commute Hours</h3>
                    <p className="text-sm text-gray-600">Busiest times of day</p>
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Transport Mode Distribution</h3>
                    <p className="text-sm text-gray-600">Most used transport types</p>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4">Data Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Daily Commutes</p>
                  <p className="font-semibold">
                    {analytics.commutesPerDay.length > 0
                      ? Math.round(analytics.commutesPerDay.reduce((sum, day) => sum + day.count, 0) / analytics.commutesPerDay.length)
                      : 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Most Popular Mode</p>
                  <p className="font-semibold capitalize">
                    {analytics.modeDistribution.length > 0 ? analytics.modeDistribution[0].mode.toLowerCase() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Peak Hour</p>
                  <p className="font-semibold">
                    {analytics.peakHours.length > 0
                      ? analytics.peakHours.reduce((prev, current) => (prev.count > current.count) ? prev : current).hour
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Data Period</p>
                  <p className="font-semibold">
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