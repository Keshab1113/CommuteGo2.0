// frontend/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { commuteAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import {
  Calendar,
  Clock,
  DollarSign,
  Leaf,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Car,
  Bus,
  Train,
  TramFront,
  Footprints,
  GitBranch,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Share2,
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const History = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'analytics', 'calendar'
  const [stats, setStats] = useState({
    totalDistance: 0,
    totalCost: 0,
    totalTime: 0,
    totalCarbon: 0,
    avgCost: 0,
    avgTime: 0,
    avgCarbon: 0
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
    calculateStats();
  }, [history, searchQuery, filterMode, filterDate, sortBy]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await commuteAPI.getHistory(100);
      setHistory(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "Failed to load commute history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (filteredHistory.length === 0) return;

    const totalDistance = filteredHistory.reduce((sum, item) => sum + (item.distance_km || 0), 0);
    const totalCost = filteredHistory.reduce((sum, item) => sum + (item.total_cost || 0), 0);
    const totalTime = filteredHistory.reduce((sum, item) => sum + (item.total_time || 0), 0);
    const totalCarbon = filteredHistory.reduce((sum, item) => sum + (item.carbon_kg || 0), 0);

    setStats({
      totalDistance,
      totalCost,
      totalTime,
      totalCarbon,
      avgCost: totalCost / filteredHistory.length,
      avgTime: totalTime / filteredHistory.length,
      avgCarbon: totalCarbon / filteredHistory.length
    });
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply mode filter
    if (filterMode !== 'all') {
      filtered = filtered.filter(item => item.mode === filterMode);
    }

    // Apply date filter
    if (filterDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.travelled_on || item.created_at);
        
        switch (filterDate) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.travelled_on || a.created_at);
      const dateB = new Date(b.travelled_on || b.created_at);
      
      switch (sortBy) {
        case 'date-desc': return dateB - dateA;
        case 'date-asc': return dateA - dateB;
        case 'cost-desc': return (b.total_cost || 0) - (a.total_cost || 0);
        case 'cost-asc': return (a.total_cost || 0) - (b.total_cost || 0);
        case 'time-desc': return (b.total_time || 0) - (a.total_time || 0);
        case 'time-asc': return (a.total_time || 0) - (b.total_time || 0);
        default: return dateB - dateA;
      }
    });

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const getModeIcon = (mode) => {
    const icons = {
      cab: <Car className="h-4 w-4 text-blue-600" />,
      bus: <Bus className="h-4 w-4 text-green-600" />,
      train: <Train className="h-4 w-4 text-purple-600" />,
      metro: <TramFront className="h-4 w-4 text-pink-600" />,
      walk: <Footprints className="h-4 w-4 text-yellow-600" />,
      mixed: <GitBranch className="h-4 w-4 text-indigo-600" />
    };
    return icons[mode] || null;
  };

  const getModeLabel = (mode) => {
    const labels = {
      cab: 'Taxi/Cab',
      bus: 'Bus',
      train: 'Train',
      metro: 'Subway/Metro',
      walk: 'Walk',
      mixed: 'Mixed'
    };
    return labels[mode] || mode;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins === 0) return '0m';
    return `${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDistance = (km) => {
    if (km < 1) return `${(km * 1000).toFixed(0)}m`;
    return `${km.toFixed(1)}km`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, endIndex);

  const handleExport = (format = 'json') => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `commutego-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export Started",
      description: `Exporting ${filteredHistory.length} records`,
    });
  };

  const handleDelete = async (id) => {
    // In production, implement delete API
    setHistory(history.filter(item => item.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Commute history entry has been removed",
    });
  };

  const handleShare = (item) => {
    // Implement share functionality
    navigator.clipboard?.writeText(
      `${item.source} → ${item.destination} | ${formatTime(item.total_time)} | ${formatCurrency(item.total_cost)}`
    );
    toast({
      title: "Copied to Clipboard",
      description: "Route details copied successfully",
    });
  };

  // Prepare chart data
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = days.map(day => ({ day, commutes: 0, cost: 0, time: 0 }));
    
    filteredHistory.forEach(item => {
      const date = new Date(item.travelled_on || item.created_at);
      const dayIndex = date.getDay();
      weekly[dayIndex].commutes++;
      weekly[dayIndex].cost += item.total_cost || 0;
      weekly[dayIndex].time += item.total_time || 0;
    });
    
    return weekly;
  };

  const getModeDistribution = () => {
    const modes = {};
    filteredHistory.forEach(item => {
      modes[item.mode] = (modes[item.mode] || 0) + 1;
    });
    
    return Object.entries(modes).map(([mode, count]) => ({
      mode: getModeLabel(mode),
      count,
      percentage: (count / filteredHistory.length * 100).toFixed(1)
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
            <Calendar className="h-8 w-8 text-primary-600" />
            Commute History
            {filteredHistory.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {filteredHistory.length} trips
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">
            Track, analyze, and optimize your past commutes with AI insights
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-4">
        <TabsList>
          <TabsTrigger value="table" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* Filters Card - Common for all views */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by location..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={filterMode} onValueChange={setFilterMode}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="cab">Taxi/Cab</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="walk">Walk</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="w-32">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="cost-asc">Cost: Low to High</SelectItem>
                    <SelectItem value="cost-desc">Cost: High to Low</SelectItem>
                    <SelectItem value="time-asc">Time: Short to Long</SelectItem>
                    <SelectItem value="time-desc">Time: Long to Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {filteredHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Distance</p>
                    <p className="text-2xl font-bold">{formatDistance(stats.totalDistance)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {formatDistance(stats.totalDistance / filteredHistory.length)}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalCost)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {formatCurrency(stats.avgCost)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Time</p>
                    <p className="text-2xl font-bold">{formatTime(stats.totalTime)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {formatTime(stats.avgTime)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Carbon Footprint</p>
                    <p className="text-2xl font-bold">{stats.totalCarbon.toFixed(1)} kg</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {stats.avgCarbon.toFixed(1)} kg
                    </p>
                  </div>
                  <Leaf className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Commutes</CardTitle>
                  <CardDescription>
                    Showing {currentItems.length} of {filteredHistory.length} commutes
                  </CardDescription>
                </div>
                {filteredHistory.length > 0 && (
                  <Badge variant="outline">
                    Page {currentPage} of {totalPages}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : currentItems.length > 0 ? (
                <>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Carbon</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {currentItems.map((item, idx) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: idx * 0.02 }}
                              className="border-b hover:bg-gray-50"
                            >
                              <TableCell>
                                <div className="text-sm font-medium">
                                  {formatDate(item.travelled_on)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(item.travelled_on).toLocaleTimeString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium flex items-center gap-1">
                                  <span className="truncate max-w-[100px]">{item.source}</span>
                                  <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                  <span className="truncate max-w-[100px]">{item.destination}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getModeIcon(item.mode)}
                                  <span className="text-sm">{getModeLabel(item.mode)}</span>
                                  <div className="flex gap-1">
                                    {item.rank_cheapest === 1 && (
                                      <Badge variant="outline" className="text-[10px] px-1 bg-green-50">
                                        💰
                                      </Badge>
                                    )}
                                    {item.rank_fastest === 1 && (
                                      <Badge variant="outline" className="text-[10px] px-1 bg-blue-50">
                                        ⚡
                                      </Badge>
                                    )}
                                    {item.rank_eco === 1 && (
                                      <Badge variant="outline" className="text-[10px] px-1 bg-emerald-50">
                                        🌱
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDistance(item.distance_km)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatTime(item.total_time)}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {formatCurrency(item.total_cost)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {item.carbon_kg?.toFixed(1)} kg
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Commute Details</DialogTitle>
                                        <DialogDescription>
                                          Full details for your commute on {formatDate(item.travelled_on)}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                            <p className="text-sm text-gray-500">From</p>
                                            <p className="font-medium">{item.source}</p>
                                            {item.source_coords && (
                                              <p className="text-xs text-gray-400">
                                                Lat: {item.source_coords.lat}, Lng: {item.source_coords.lng}
                                              </p>
                                            )}
                                          </div>
                                          <div className="space-y-2">
                                            <p className="text-sm text-gray-500">To</p>
                                            <p className="font-medium">{item.destination}</p>
                                            {item.dest_coords && (
                                              <p className="text-xs text-gray-400">
                                                Lat: {item.dest_coords.lat}, Lng: {item.dest_coords.lng}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-3 gap-4">
                                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <Clock className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                                            <p className="text-sm text-gray-500">Time</p>
                                            <p className="font-semibold">{formatTime(item.total_time)}</p>
                                            {item.actual_time && (
                                              <p className="text-xs text-green-600">
                                                Actual: {formatTime(item.actual_time)}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <DollarSign className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                                            <p className="text-sm text-gray-500">Cost</p>
                                            <p className="font-semibold">{formatCurrency(item.total_cost)}</p>
                                            {item.actual_cost && (
                                              <p className="text-xs text-green-600">
                                                Actual: {formatCurrency(item.actual_cost)}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <Leaf className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                                            <p className="text-sm text-gray-500">Carbon</p>
                                            <p className="font-semibold">{item.carbon_kg?.toFixed(1)} kg</p>
                                          </div>
                                        </div>

                                        {item.steps && item.steps.length > 0 && (
                                          <>
                                            <Separator />
                                            <div>
                                              <h4 className="font-medium mb-3">Route Steps</h4>
                                              <div className="space-y-2">
                                                {item.steps.map((step, idx) => (
                                                  <div key={idx} className="flex items-center text-sm p-2 bg-gray-50 rounded">
                                                    <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full mr-3 text-xs font-medium">
                                                      {idx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                      <span className="font-medium capitalize">{step.mode}</span>
                                                      <span className="mx-2 text-gray-400">→</span>
                                                      <span className="text-gray-600">{step.from} to {step.to}</span>
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                      {step.duration}m • {step.distance}km
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </>
                                        )}

                                        {item.feedback_score && (
                                          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm">Your feedback: {item.feedback_score}/5</span>
                                            {item.feedback_comment && (
                                              <span className="text-sm text-gray-600">"{item.feedback_comment}"</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleShare(item)}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No commutes found</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    {searchQuery || filterMode !== 'all' || filterDate !== 'all'
                      ? 'Try adjusting your search or filters to see more results'
                      : 'Start planning your first commute to see history here'}
                  </p>
                  {(!searchQuery && filterMode === 'all' && filterDate === 'all') && (
                    <Button asChild>
                      <a href="/plan">Plan Your First Commute</a>
                    </Button>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics View */}
        <TabsContent value="analytics">
          {filteredHistory.length > 0 ? (
            <div className="space-y-6">
              {/* Weekly Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>
                    Your commute patterns over the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getWeeklyData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                        <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="commutes" fill="#3b82f6" name="Number of Commutes" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="cost" fill="#22c55e" name="Total Cost ($)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mode Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Transport Mode Distribution
                    </CardTitle>
                    <CardDescription>
                      Your preferred ways to travel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={getModeDistribution()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ mode, percentage }) => `${mode}: ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {getModeDistribution().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {getModeDistribution().map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span>{item.mode}</span>
                          </div>
                          <span className="font-medium">{item.count} trips ({item.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Time & Cost Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>
                      How your commutes are performing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Average Time</span>
                          <span className="font-medium">{formatTime(stats.avgTime)}</span>
                        </div>
                        <Progress value={(stats.avgTime / 120) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.avgTime < 30 ? 'Great!' : stats.avgTime < 45 ? 'Good' : 'Could be better'}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Average Cost</span>
                          <span className="font-medium">{formatCurrency(stats.avgCost)}</span>
                        </div>
                        <Progress value={(stats.avgCost / 20) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.avgCost < 10 ? 'Budget-friendly' : stats.avgCost < 15 ? 'Moderate' : 'Premium'}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Carbon Efficiency</span>
                          <span className="font-medium">{stats.avgCarbon.toFixed(1)} kg</span>
                        </div>
                        <Progress value={(stats.avgCarbon / 5) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.avgCarbon < 1 ? 'Eco-friendly' : stats.avgCarbon < 2.5 ? 'Moderate' : 'High impact'}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">AI Insights</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                          <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                          <p className="text-sm text-blue-700">
                            {stats.avgTime < 30 
                              ? 'Your commutes are faster than average! Keep up the good route choices.'
                              : 'Consider trying alternative modes to reduce your commute time.'}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                          <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                          <p className="text-sm text-green-700">
                            {stats.avgCarbon < 1
                              ? 'Great job keeping your carbon footprint low!'
                              : 'Try more eco-friendly options like public transport to reduce emissions.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <PieChart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Data for Analytics</h3>
                <p className="text-gray-500">Start planning commutes to see detailed analytics</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Commute Calendar</CardTitle>
              <CardDescription>
                View your commute history in calendar format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p>Calendar view coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default History;