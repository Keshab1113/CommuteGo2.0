// frontend/src/pages/PlanCommute.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { commuteAPI } from '../services/api';
import RouteCard from '../components/commute/RouteCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../hooks/use-toast';
import {
  Search,
  Calendar,
  Clock,
  Navigation,
  Loader2,
  ArrowLeftRight,
  MapPin,
  Settings,
  TrendingUp,
  DollarSign,
  Leaf,
  Filter
} from 'lucide-react';

const PlanCommute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [routeOptions, setRouteOptions] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [selectedPreference, setSelectedPreference] = useState('balanced');
  const [filters, setFilters] = useState({
    maxCost: 50,
    maxTime: 120,
    ecoOnly: false,
    avoidTolls: true
  });
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    travelTime: '08:00'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlanCommute = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const travelDateTime = `${formData.travelDate}T${formData.travelTime}`;
      const response = await commuteAPI.plan({
        ...formData,
        travelDate: travelDateTime,
        preferences: {
          modePreference: selectedPreference,
          ...filters
        }
      });
      
      setCurrentRoute(response.data.route);
      
      // Filter and sort options based on preferences
      let filteredOptions = response.data.options;
      
      if (filters.maxCost) {
        filteredOptions = filteredOptions.filter(opt => opt.totalCost <= filters.maxCost);
      }
      
      if (filters.maxTime) {
        filteredOptions = filteredOptions.filter(opt => opt.totalTime <= filters.maxTime);
      }
      
      if (filters.ecoOnly) {
        filteredOptions = filteredOptions.filter(opt => opt.rankEco <= 2);
      }
      
      // Sort by selected preference
      filteredOptions = [...filteredOptions].sort((a, b) => {
        if (selectedPreference === 'cheapest') return a.rankCheapest - b.rankCheapest;
        if (selectedPreference === 'fastest') return a.rankFastest - b.rankFastest;
        if (selectedPreference === 'greenest') return a.rankEco - b.rankEco;
        return (a.rankCheapest + a.rankFastest + a.rankEco) - (b.rankCheapest + b.rankFastest + b.rankEco);
      });
      
      setRouteOptions(filteredOptions);
      toast({
        title: "Success!",
        description: `Found ${filteredOptions.length} optimized routes for your commute`,
      });
    } catch (error) {
      console.error('Error planning commute:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || 'Failed to plan commute',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async (option) => {
    try {
      await commuteAPI.saveHistory({
        routeOptionId: option.id,
        travelledOn: new Date().toISOString()
      });
      
      toast({
        title: "Commute Saved",
        description: "Route has been saved to your history",
      });
      
      navigate('/history');
    } catch (error) {
      console.error('Error saving commute:', error);
      toast({
        title: "Error",
        description: 'Failed to save commute to history',
        variant: "destructive",
      });
    }
  };

  const preferenceOptions = [
    { value: 'balanced', label: 'Balanced', icon: TrendingUp },
    { value: 'cheapest', label: 'Cheapest', icon: DollarSign },
    { value: 'fastest', label: 'Fastest', icon: Clock },
    { value: 'greenest', label: 'Greenest', icon: Leaf }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Plan Your Commute</h1>
          <p className="text-gray-600">
            Enter your journey details and let us find the best routes for you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form & Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlanCommute} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Starting Point</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="source"
                      name="source"
                      type="text"
                      placeholder="Enter starting address"
                      className="pl-10"
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="destination"
                      name="destination"
                      type="text"
                      placeholder="Enter destination address"
                      className="pl-10"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelDate">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="travelDate"
                        name="travelDate"
                        type="date"
                        className="pl-10"
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelTime">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="travelTime"
                        name="travelTime"
                        type="time"
                        className="pl-10"
                        value={formData.travelTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing Routes...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Best Routes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Preferences & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Route Preference</Label>
                <Tabs defaultValue="balanced" value={selectedPreference} onValueChange={setSelectedPreference}>
                  <TabsList className="grid grid-cols-4">
                    {preferenceOptions.map((pref) => {
                      const Icon = pref.icon;
                      return (
                        <TabsTrigger key={pref.value} value={pref.value} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{pref.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Max Cost</Label>
                    <p className="text-sm text-gray-500">${filters.maxCost}</p>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxCost}
                    onChange={(e) => setFilters({...filters, maxCost: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Max Time</Label>
                    <p className="text-sm text-gray-500">{filters.maxTime} min</p>
                  </div>
                  <Input
                    type="range"
                    min="15"
                    max="240"
                    step="15"
                    value={filters.maxTime}
                    onChange={(e) => setFilters({...filters, maxTime: parseInt(e.target.value)})}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Eco-friendly only</Label>
                    <p className="text-sm text-gray-500">Show greenest routes</p>
                  </div>
                  <Switch
                    checked={filters.ecoOnly}
                    onCheckedChange={(checked) => setFilters({...filters, ecoOnly: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Avoid tolls</Label>
                    <p className="text-sm text-gray-500">Exclude toll roads</p>
                  </div>
                  <Switch
                    checked={filters.avoidTolls}
                    onCheckedChange={(checked) => setFilters({...filters, avoidTolls: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {currentRoute && (
            <Card>
              <CardHeader>
                <CardTitle>Current Route</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">From:</span>
                    <span className="font-medium">{currentRoute.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">To:</span>
                    <span className="font-medium">{currentRoute.destination}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="font-medium">
                      {new Date(currentRoute.travel_date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2">
          {routeOptions ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Optimized Routes</CardTitle>
                      <CardDescription>
                        Found {routeOptions.length} routes matching your preferences
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {selectedPreference.charAt(0).toUpperCase() + selectedPreference.slice(1)} First
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {routeOptions.map((option, index) => (
                      <RouteCard
                        key={`${option.mode}_${index}`}
                        option={option}
                        onSelect={handleSaveToHistory}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {routeOptions.length === 0 && (
                <Alert>
                  <AlertDescription>
                    No routes found matching your filters. Try adjusting your preferences.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ArrowLeftRight className="text-gray-400 h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No Routes Planned Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Enter your commute details to see optimized routes based on cost, time, and environmental impact.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                    {preferenceOptions.map((pref) => {
                      const Icon = pref.icon;
                      return (
                        <div key={pref.value} className="flex items-center gap-1">
                          <Icon className="h-4 w-4" />
                          <span>{pref.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCommute;