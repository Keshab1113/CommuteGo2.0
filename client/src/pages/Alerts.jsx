// frontend/src/pages/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
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
  Settings
} from 'lucide-react';

const Alerts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [notificationSettings, setNotificationSettings] = useState({
    trafficAlerts: true,
    weatherAlerts: true,
    delayAlerts: true,
    systemAlerts: true,
    promotional: false
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
    });
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'traffic':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'weather':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'delay':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      low: { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
      medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      high: { label: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
    };
    
    const config = severityConfig[severity] || severityConfig.medium;
    
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alerts & Notifications</h1>
          <p className="text-gray-600">
            Stay updated with commute alerts and notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Choose what type of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'trafficAlerts' && 'Real-time traffic updates'}
                      {key === 'weatherAlerts' && 'Weather-related commute alerts'}
                      {key === 'delayAlerts' && 'Public transport delays'}
                      {key === 'systemAlerts' && 'System maintenance notifications'}
                      {key === 'promotional' && 'Promotional offers and deals'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Alerts', count: alerts.length },
                  { value: 'unread', label: 'Unread Only', count: alerts.filter(a => !a.is_read).length },
                  { value: 'read', label: 'Read Only', count: alerts.filter(a => a.is_read).length },
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filter === filterOption.value
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setFilter(filterOption.value)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{filterOption.label}</span>
                      <Badge variant="secondary">{filterOption.count}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alerts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>
                    {filter === 'all' && 'All your alerts'}
                    {filter === 'unread' && 'Unread alerts only'}
                    {filter === 'read' && 'Read alerts only'}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {alerts.filter(a => !a.is_read).length} unread
                </Badge>
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
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.is_read
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h3 className="font-medium">{alert.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {formatDate(alert.created_at)}
                              </span>
                              {getSeverityBadge(alert.severity)}
                              <Badge variant="outline" className="text-xs capitalize">
                                {alert.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {!alert.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(alert.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{alert.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BellOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {filter === 'unread' ? 'No unread alerts' : 'No alerts found'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {filter === 'unread' 
                      ? 'You\'re all caught up!'
                      : 'Alerts will appear here when there are important updates.'
                    }
                  </p>
                  {filter !== 'all' && (
                    <Button variant="outline" onClick={() => setFilter('all')}>
                      View All Alerts
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Alerts', value: alerts.length, icon: Bell },
                  { label: 'Unread', value: alerts.filter(a => !a.is_read).length, icon: AlertCircle },
                  { label: 'High Priority', value: alerts.filter(a => a.severity === 'high').length, icon: AlertTriangle },
                  { label: 'This Week', value: alerts.filter(a => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(a.created_at) > weekAgo;
                  }).length, icon: Info },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;