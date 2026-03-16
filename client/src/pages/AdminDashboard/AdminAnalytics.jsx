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
    <div className="space-y-6 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Advanced Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium dark:text-white">Analytics Period</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select time range for analysis</p>
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
                <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
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
            <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-24 mb-2 dark:bg-gray-700" />
                <Skeleton className="h-4 w-32 dark:bg-gray-700" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-400 dark:border-green-800">
                    +12%
                  </Badge>
                </div>
                <div className="text-2xl font-bold dark:text-white">{formatNumber(metrics.totalUsers)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800">
                    +8%
                  </Badge>
                </div>
                <div className="text-2xl font-bold dark:text-white">{formatNumber(metrics.totalRoutes)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Routes Planned</p>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-400 dark:border-purple-800">
                    +15%
                  </Badge>
                </div>
                <div className="text-2xl font-bold dark:text-white">{formatNumber(metrics.totalCommutes)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed Commutes</p>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-400 dark:border-yellow-800">
                    +22%
                  </Badge>
                </div>
                <div className="text-2xl font-bold dark:text-white">{formatCurrency(metrics.totalRevenue)}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart Tabs */}
      <Tabs value={activeChart} onValueChange={setActiveChart} className="space-y-6">
        <TabsList className="grid grid-cols-4 dark:bg-gray-800">
          <TabsTrigger value="overview" className="flex items-center gap-2 dark:text-gray-400 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2 dark:text-gray-400 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 dark:text-gray-400 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2 dark:text-gray-400 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Transport</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Performance Overview</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Key metrics and trends over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 dark:bg-gray-700" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.commutesPerDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
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
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-2 dark:text-white">Peak Hours</h4>
                        <div className="space-y-2">
                          {analytics.peakHours.slice(0, 3).map((hour, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm dark:text-gray-300">{hour.hour}</span>
                              <span className="font-medium dark:text-white">{hour.count} commutes</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-2 dark:text-white">Revenue Summary</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm dark:text-gray-300">Total Revenue</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm dark:text-gray-300">Average Daily</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(
                                analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-2 dark:text-white">Most Popular Mode</h4>
                        {analytics.modeDistribution.length > 0 && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl font-bold dark:text-white">
                                {analytics.modeDistribution[0].percentage}%
                              </div>
                              <div>
                                <div className="font-medium capitalize dark:text-white">
                                  {analytics.modeDistribution[0].mode.toLowerCase()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
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
                  <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Revenue Analysis</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Revenue trends and projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 dark:bg-gray-700" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={analytics.revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
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
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-4 dark:text-white">Revenue Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Total Revenue</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Average Daily</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(
                                analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Highest Day</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(Math.max(...analytics.revenueTrend.map(day => day.revenue)))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Growth Rate</span>
                            <span className="font-medium text-green-600 dark:text-green-400">+22%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-4 dark:text-white">Revenue Forecast</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Next 7 Days</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(
                                (analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length) * 7
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Next 30 Days</span>
                            <span className="font-medium dark:text-white">
                              {formatCurrency(
                                (analytics.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / analytics.revenueTrend.length) * 30
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Projected Monthly</span>
                            <span className="font-medium dark:text-white">
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
                  <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">User Analytics</CardTitle>
              <CardDescription className="dark:text-gray-400">
                User growth and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 dark:bg-gray-700" />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={analytics.peakHours}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
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
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-4 dark:text-white">Real-Time Activity</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Active Today</span>
                            <span className="font-medium dark:text-white">
                              {formatNumber(realTimeMetrics.activeUsersToday)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Current Hour</span>
                            <span className="font-medium dark:text-white">
                              {formatNumber(realTimeMetrics.currentHourCommutes)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Today's Commutes</span>
                            <span className="font-medium dark:text-white">
                              {formatNumber(realTimeMetrics.todayCommutes)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Peak Hour</span>
                            <span className="font-medium dark:text-white">
                              {realTimeMetrics.mostActiveHour.hour}:00 ({realTimeMetrics.mostActiveHour.count})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="font-medium mb-4 dark:text-white">User Engagement</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Avg. Commutes/User</span>
                            <span className="font-medium dark:text-white">
                              {(metrics.totalCommutes / metrics.totalUsers).toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Retention Rate</span>
                            <span className="font-medium text-green-600 dark:text-green-400">87%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">New Users (7d)</span>
                            <span className="font-medium dark:text-white">+{Math.round(metrics.totalUsers * 0.05)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Active Sessions</span>
                            <span className="font-medium dark:text-white">142</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No user data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Transport Mode Analysis</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Distribution and performance of different transport modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-80 dark:bg-gray-700" />
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
                        ]} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {showDetails && (
                    <div className="space-y-4">
                      <h4 className="font-medium dark:text-white">Mode Performance Metrics</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b dark:border-gray-600">
                              <th className="text-left py-2 px-4 dark:text-white">Mode</th>
                              <th className="text-left py-2 px-4 dark:text-white">Trips</th>
                              <th className="text-left py-2 px-4 dark:text-white">Share</th>
                              <th className="text-left py-2 px-4 dark:text-white">Avg. Cost</th>
                              <th className="text-left py-2 px-4 dark:text-white">Avg. Time</th>
                              <th className="text-left py-2 px-4 dark:text-white">Avg. Carbon</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.modeDistribution.map((mode, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                <td className="py-2 px-4 font-medium capitalize dark:text-white">{mode.mode.toLowerCase()}</td>
                                <td className="py-2 px-4 dark:text-gray-300">{formatNumber(mode.count)}</td>
                                <td className="py-2 px-4 dark:text-gray-300">{mode.percentage}%</td>
                                <td className="py-2 px-4 dark:text-gray-300">{formatCurrency(mode.avg_cost || 0)}</td>
                                <td className="py-2 px-4 dark:text-gray-300">{mode.avg_time ? `${Math.round(mode.avg_time)} min` : 'N/A'}</td>
                                <td className="py-2 px-4 dark:text-gray-300">{mode.avg_carbon ? `${mode.avg_carbon.toFixed(1)} kg` : 'N/A'}</td>
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
                  <p className="text-gray-500 dark:text-gray-400">No transport data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-Time Dashboard */}
      {realTimeMetrics && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <RefreshCw className="h-5 w-5" />
              Real-Time Dashboard
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Live system metrics and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {realTimeMetrics.activeUsersToday}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Users Today</p>
              </div>
              
              <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {realTimeMetrics.todayCommutes}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Commutes Today</p>
              </div>
              
              <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {realTimeMetrics.currentHourCommutes}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">This Hour</p>
              </div>
              
              <div className="p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {realTimeMetrics.mostActiveHour.hour}:00
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Peak Hour ({realTimeMetrics.mostActiveHour.count})</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(realTimeMetrics.lastUpdated).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAnalytics;