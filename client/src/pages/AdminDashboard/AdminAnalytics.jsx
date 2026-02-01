// frontend/src/pages/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI, analyticsAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Skeleton } from '../../components/ui/skeleton';
import { useToast } from '../../hooks/use-toast';
import {
  LineChart,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

// Recharts imports for charts
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const AdminAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30days');
  const [activeChart, setActiveChart] = useState('overview');
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalRoutes: 0,
    totalCommutes: 0,
    totalRevenue: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsResponse, analyticsResponse, realTimeResponse] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getAnalytics(getDateRange()),
        analyticsAPI.getRealTimeMetrics()
      ]);
      
      setMetrics(metricsResponse.data);
      setAnalytics(analyticsResponse.data);
      setRealTimeMetrics(realTimeResponse.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
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
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
    toast({
      title: "Analytics Refreshed",
      description: "Latest data has been loaded",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ metrics, analytics, realTimeMetrics }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `commutego-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Analytics data has been downloaded",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
          <p className="text-gray-600">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Analytics Period</h3>
              <p className="text-sm text-gray-500">Select time range for analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="hidden sm:flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {getDateRange().startDate} to {getDateRange().endDate}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    +12%
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{formatNumber(metrics.totalUsers)}</div>
                <p className="text-sm text-gray-500">Total Users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    +8%
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{formatNumber(metrics.totalRoutes)}</div>
                <p className="text-sm text-gray-500">Routes Planned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    +15%
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{formatNumber(metrics.totalCommutes)}</div>
                <p className="text-sm text-gray-500">Completed Commutes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    +22%
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart Tabs */}
      <Tabs value={activeChart} onValueChange={setActiveChart} className="space-y-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Transport</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Key metrics and trends over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.commutesPerDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.1}
                          strokeWidth={2}
                          name="Daily Commutes"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {showDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Peak Hours</h4>
                        <div className="space-y-2">
                          {analytics.peakHours.slice(0, 3).map((hour, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{hour.hour}</span>
                              <span className="font-medium">{hour.count} commutes</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Revenue Summary</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Total Revenue</span>
                            <span className="font-medium">
                              {formatCurrency(analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Average Daily</span>
                            <span className="font-medium">
                              {formatCurrency(
                                analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Most Popular Mode</h4>
                        {analytics.modeDistribution.length > 0 && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl font-bold">
                                {analytics.modeDistribution[0].percentage}%
                              </div>
                              <div>
                                <div className="font-medium capitalize">
                                  {analytics.modeDistribution[0].mode.toLowerCase()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {analytics.modeDistribution[0].count} trips
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Revenue trends and projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={analytics.revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Daily Revenue"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {showDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-4">Revenue Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="font-medium">
                              {formatCurrency(analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Average Daily</span>
                            <span className="font-medium">
                              {formatCurrency(
                                analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Highest Day</span>
                            <span className="font-medium">
                              {formatCurrency(Math.max(...analytics.revenueTrend.map(day => day.revenue)))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Growth Rate</span>
                            <span className="font-medium text-green-600">+22%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-4">Revenue Forecast</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Next 7 Days</span>
                            <span className="font-medium">
                              {formatCurrency(
                                (analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length) * 7
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Next 30 Days</span>
                            <span className="font-medium">
                              {formatCurrency(
                                (analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length) * 30
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Projected Monthly</span>
                            <span className="font-medium">
                              {formatCurrency(metrics.totalRevenue * 1.22)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No revenue data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                User growth and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={analytics.peakHours}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          fill="#8b5cf6" 
                          radius={[4, 4, 0, 0]}
                          name="Commutes per Hour"
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {showDetails && realTimeMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-4">Real-Time Activity</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Active Today</span>
                            <span className="font-medium">
                              {formatNumber(realTimeMetrics.activeUsersToday)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Current Hour</span>
                            <span className="font-medium">
                              {formatNumber(realTimeMetrics.currentHourCommutes)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Today's Commutes</span>
                            <span className="font-medium">
                              {formatNumber(realTimeMetrics.todayCommutes)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Peak Hour</span>
                            <span className="font-medium">
                              {realTimeMetrics.mostActiveHour.hour}:00 ({realTimeMetrics.mostActiveHour.count})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-4">User Engagement</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Avg. Commutes/User</span>
                            <span className="font-medium">
                              {(metrics.totalCommutes / metrics.totalUsers).toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Retention Rate</span>
                            <span className="font-medium text-green-600">87%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">New Users (7d)</span>
                            <span className="font-medium">+{Math.round(metrics.totalUsers * 0.05)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Active Sessions</span>
                            <span className="font-medium">142</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No user data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle>Transport Mode Analysis</CardTitle>
              <CardDescription>
                Distribution and performance of different transport modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.modeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ mode, percentage }) => `${mode}: ${percentage}%`}
                          outerRadius={100}
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
                  
                  {showDetails && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Mode Performance Metrics</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4">Mode</th>
                              <th className="text-left py-2 px-4">Trips</th>
                              <th className="text-left py-2 px-4">Share</th>
                              <th className="text-left py-2 px-4">Avg. Cost</th>
                              <th className="text-left py-2 px-4">Avg. Time</th>
                              <th className="text-left py-2 px-4">Avg. Carbon</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.modeDistribution.map((mode, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 font-medium capitalize">{mode.mode.toLowerCase()}</td>
                                <td className="py-2 px-4">{formatNumber(mode.count)}</td>
                                <td className="py-2 px-4">{mode.percentage}%</td>
                                <td className="py-2 px-4">{formatCurrency(mode.avg_cost || 0)}</td>
                                <td className="py-2 px-4">{mode.avg_time ? `${Math.round(mode.avg_time)} min` : 'N/A'}</td>
                                <td className="py-2 px-4">{mode.avg_carbon ? `${mode.avg_carbon.toFixed(1)} kg` : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No transport data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-Time Dashboard */}
      {realTimeMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Real-Time Dashboard
            </CardTitle>
            <CardDescription>
              Live system metrics and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {realTimeMetrics.activeUsersToday}
                </div>
                <p className="text-sm text-gray-500">Active Users Today</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {realTimeMetrics.todayCommutes}
                </div>
                <p className="text-sm text-gray-500">Commutes Today</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {realTimeMetrics.currentHourCommutes}
                </div>
                <p className="text-sm text-gray-500">This Hour</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {realTimeMetrics.mostActiveHour.hour}:00
                </div>
                <p className="text-sm text-gray-500">Peak Hour ({realTimeMetrics.mostActiveHour.count})</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(realTimeMetrics.lastUpdated).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAnalytics;