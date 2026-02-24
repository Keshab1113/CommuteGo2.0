// frontend/src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCheck,
  Trash2,
  Filter,
  RefreshCw,
  Settings,
  Brain,
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  X,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const Alerts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [notificationSettings, setNotificationSettings] = useState({
    trafficAlerts: true,
    weatherAlerts: true,
    delayAlerts: true,
    systemAlerts: true,
    promotional: false,
    agentInsights: true
  });

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAlerts(filter === 'unread', 50);
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await userAPI.markAlertAsRead(alertId);
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
      toast({
        title: "Alert marked as read",
        description: "Notification has been marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await userAPI.markAllAlertsAsRead();
      setAlerts(alerts.map(alert => ({ ...alert, is_read: true })));
      toast({
        title: "All alerts marked as read",
        description: "Your notification center is now clear",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark alerts as read",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
    toast({
      title: "Alerts refreshed",
      description: "Latest notifications loaded",
    });
  };

  const handleDeleteAlert = async (alertId) => {
    // In production, implement delete API
    setAlerts(alerts.filter(a => a.id !== alertId));
    toast({
      title: "Alert deleted",
      description: "Notification has been removed",
    });
  };

  const getAlertIcon = (type, severity) => {
    const icons = {
      traffic: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      weather: <AlertCircle className="h-5 w-5 text-blue-500" />,
      delay: <Clock className="h-5 w-5 text-yellow-500" />,
      system: <Bell className="h-5 w-5 text-purple-500" />,
      promotional: <TrendingUp className="h-5 w-5 text-green-500" />,
      agent: <Brain className="h-5 w-5 text-indigo-500" />
    };
    return icons[type] || <Info className="h-5 w-5 text-gray-500" />;
  };

  const getSeverityBadge = (severity) => {
    const config = {
      low: { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-500' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' },
      high: { label: 'High', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' }
    };
    
    const c = config[severity] || config.medium;
    
    return (
      <Badge variant="outline" className={`${c.color} flex items-center gap-1`}>
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {c.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary-600" />
            Alerts & Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">
            Stay updated with AI-powered commute alerts and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="gap-2"
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Settings & Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Notification Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Customize your AI alert settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <motion.div
                  key={key}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium capitalize flex items-center gap-2">
                      {key === 'agentInsights' && <Brain className="h-4 w-4 text-primary-600" />}
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'trafficAlerts' && 'Real-time traffic updates'}
                      {key === 'weatherAlerts' && 'Weather-related commute alerts'}
                      {key === 'delayAlerts' && 'Public transport delays'}
                      {key === 'systemAlerts' && 'System maintenance'}
                      {key === 'promotional' && 'Promotional offers'}
                      {key === 'agentInsights' && 'AI-generated commute insights'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Filter Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Alerts', icon: Bell },
                  { value: 'unread', label: 'Unread Only', icon: AlertCircle },
                  { value: 'read', label: 'Read Only', icon: CheckCircle },
                ].map((filterOption) => {
                  const Icon = filterOption.icon;
                  const count = filterOption.value === 'all' ? alerts.length :
                               filterOption.value === 'unread' ? unreadCount :
                               alerts.length - unreadCount;
                  
                  return (
                    <button
                      key={filterOption.value}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                        filter === filterOption.value
                          ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setFilter(filterOption.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${
                            filter === filterOption.value ? 'text-primary-600' : 'text-gray-400'
                          }`} />
                          <span className="font-medium">{filterOption.label}</span>
                        </div>
                        <Badge variant={filter === filterOption.value ? 'default' : 'secondary'}>
                          {count}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Quick Filters</h4>
                {['traffic', 'weather', 'delay', 'system', 'agent'].map(type => (
                  <button
                    key={type}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg capitalize"
                    onClick={() => {/* Implement type filter */}}
                  >
                    {type} alerts
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Summary Card */}
          <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold">AI Summary</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}. Most are ${alerts.filter(a => !a.is_read)[0]?.type || 'updates'}.`
                  : 'All caught up! No unread notifications.'}
              </p>
              <Progress 
                value={(unreadCount / (alerts.length || 1)) * 100} 
                className="h-1.5"
              />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((alerts.length - unreadCount) / (alerts.length || 1) * 100)}% read rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts List */}
        <div className="lg:col-span-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Recent Alerts
                    {alerts.length > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {alerts.length} total
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {filter === 'all' && 'All your notifications'}
                    {filter === 'unread' && `${unreadCount} unread notifications`}
                    {filter === 'read' && `${alerts.length - unreadCount} read notifications`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-20" />
                    </div>
                  ))}
                </div>
              ) : alerts.length > 0 ? (
                <AnimatePresence>
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 rounded-lg border transition-all ${
                          alert.is_read
                            ? 'bg-white border-gray-200 hover:border-gray-300'
                            : 'bg-blue-50 border-blue-200 hover:border-blue-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-full ${
                              alert.is_read ? 'bg-gray-100' : 'bg-blue-100'
                            }`}>
                              {getAlertIcon(alert.type, alert.severity)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold">{alert.title}</h3>
                                {getSeverityBadge(alert.severity)}
                                <Badge variant="outline" className="text-xs capitalize">
                                  {alert.type}
                                </Badge>
                                {alert.agent_generated && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                              
                              <div className="flex items-center gap-4 text-xs">
                                <span className="text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(alert.created_at)}
                                </span>
                                {alert.action_url && (
                                  <a 
                                    href={alert.action_url}
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                  >
                                    View details →
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!alert.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(alert.id)}
                                className="h-8 w-8 p-0"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteAlert(alert.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Expandable details - could add more info */}
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BellOff className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {filter === 'unread' ? 'No unread alerts' : 'No alerts found'}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    {filter === 'unread' 
                      ? 'You\'re all caught up! Check back later for new notifications.'
                      : 'Alerts will appear here when there are important updates from our AI agents.'}
                  </p>
                  {filter !== 'all' && (
                    <Button variant="outline" onClick={() => setFilter('all')}>
                      View All Alerts
                    </Button>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Alert Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Alerts', value: alerts.length, icon: Bell, color: 'text-blue-600' },
                  { label: 'Unread', value: unreadCount, icon: AlertCircle, color: 'text-yellow-600' },
                  { label: 'High Priority', value: alerts.filter(a => a.severity === 'high').length, icon: AlertTriangle, color: 'text-red-600' },
                  { label: 'AI Generated', value: alerts.filter(a => a.agent_generated).length, icon: Brain, color: 'text-purple-600' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  const percentage = stat.value > 0 ? Math.round((stat.value / alerts.length) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      className="text-center p-4 border rounded-lg bg-gradient-to-b from-white to-gray-50"
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                      {alerts.length > 0 && (
                        <>
                          <Progress value={percentage} className="h-1 mb-1" />
                          <span className="text-xs text-gray-400">{percentage}%</span>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Activity Timeline */}
              {alerts.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-3">Activity Timeline</h4>
                  <div className="space-y-2">
                    {alerts.slice(0, 3).map(alert => (
                      <div key={alert.id} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'high' ? 'bg-red-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-gray-600">{formatDate(alert.created_at)}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium truncate">{alert.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Alerts;