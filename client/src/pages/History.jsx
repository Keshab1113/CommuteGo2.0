// frontend/src/pages/History.jsx
import React, { useState, useEffect } from 'react';
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
  TramFront ,
  Footprints,
  GitBranch,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const History = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchQuery, filterMode, sortBy]);

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

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply mode filter
    if (filterMode !== 'all') {
      filtered = filtered.filter(item => item.mode === filterMode);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.travelled_on || a.created_at);
      const dateB = new Date(b.travelled_on || b.created_at);
      
      switch (sortBy) {
        case 'date-desc': return dateB - dateA;
        case 'date-asc': return dateA - dateB;
        case 'cost-desc': return b.total_cost - a.total_cost;
        case 'cost-asc': return a.total_cost - b.total_cost;
        case 'time-desc': return b.total_time - a.total_time;
        case 'time-asc': return a.total_time - b.total_time;
        default: return dateB - dateA;
      }
    });

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'cab': return <Car className="h-4 w-4 text-blue-600" />;
      case 'bus': return <Bus className="h-4 w-4 text-green-600" />;
      case 'train': return <Train className="h-4 w-4 text-purple-600" />;
      case 'metro': return <TramFront  className="h-4 w-4 text-pink-600" />;
      case 'walk': return <Footprints className="h-4 w-4 text-yellow-600" />;
      case 'mixed': return <GitBranch className="h-4 w-4 text-indigo-600" />;
      default: return null;
    }
  };

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'cab': return 'Taxi/Cab';
      case 'bus': return 'Bus';
      case 'train': return 'Train';
      case 'metro': return 'Subway/Metro';
      case 'walk': return 'Walk';
      case 'mixed': return 'Mixed';
      default: return mode;
    }
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
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, endIndex);

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `commutego-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDelete = async (id) => {
    // In a real app, you would call an API endpoint to delete
    toast({
      title: "Feature Coming Soon",
      description: "Delete functionality will be available soon",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Commute History</h1>
          <p className="text-gray-600">
            Track and analyze your past commutes
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
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
            
            <div className="flex gap-2">
              <Select value={filterMode} onValueChange={setFilterMode}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Transport Mode" />
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Commutes</p>
                <p className="text-2xl font-bold">{filteredHistory.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(filteredHistory.reduce((sum, item) => sum + (item.total_cost || 0), 0))}
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
                <p className="text-sm text-gray-500">Avg. Time</p>
                <p className="text-2xl font-bold">
                  {formatTime(filteredHistory.length > 0 
                    ? filteredHistory.reduce((sum, item) => sum + (item.total_time || 0), 0) / filteredHistory.length
                    : 0
                  )}
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
                <p className="text-2xl font-bold">
                  {filteredHistory.reduce((sum, item) => sum + (item.carbon_kg || 0), 0).toFixed(1)} kg
                </p>
              </div>
              <Leaf className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commutes</CardTitle>
          <CardDescription>
            Showing {currentItems.length} of {filteredHistory.length} commutes
          </CardDescription>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Carbon</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(item.travelled_on)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.source} → {item.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModeIcon(item.mode)}
                          <span>{getModeLabel(item.mode)}</span>
                          {item.rank_cheapest === 1 && (
                            <Badge variant="outline" className="text-xs">
                              $
                            </Badge>
                          )}
                          {item.rank_fastest === 1 && (
                            <Badge variant="outline" className="text-xs">
                              ⚡
                            </Badge>
                          )}
                          {item.rank_eco === 1 && (
                            <Badge variant="outline" className="text-xs">
                              ♻️
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(item.total_time)}</TableCell>
                      <TableCell>{formatCurrency(item.total_cost)}</TableCell>
                      <TableCell>{item.carbon_kg.toFixed(1)} kg</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Commute Details</DialogTitle>
                                <DialogDescription>
                                  Full details for your commute on {formatDate(item.travelled_on)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">From</p>
                                    <p className="font-medium">{item.source}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">To</p>
                                    <p className="font-medium">{item.destination}</p>
                                  </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <Clock className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-medium">{formatTime(item.total_time)}</p>
                                  </div>
                                  <div className="text-center">
                                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Cost</p>
                                    <p className="font-medium">{formatCurrency(item.total_cost)}</p>
                                  </div>
                                  <div className="text-center">
                                    <Leaf className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Carbon</p>
                                    <p className="font-medium">{item.carbon_kg.toFixed(1)} kg</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No commutes found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterMode !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start planning your first commute to see history here'
                }
              </p>
              {(!searchQuery && filterMode === 'all') && (
                <Button asChild>
                  <a href="/plan">Plan Your First Commute</a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;