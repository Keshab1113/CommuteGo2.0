// frontend/src/pages/PlanCommute.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { commuteAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import {
  Navigation,
  Loader2,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  Leaf
} from 'lucide-react';

const PlanCommute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [currentRouteId, setCurrentRouteId] = useState(null);
  const [tinyFishData, setTinyFishData] = useState(null);
  const [selectedPreference, setSelectedPreference] = useState('balanced');
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    travelTime: '08:00',
    currency: 'USD',
    transportMode: 'all'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePlanCommute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgressMessage('Connecting to AI agent...');

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    const travelDateTime = `${formData.travelDate}T${formData.travelTime}`;

    try {
      // Use fetch with ReadableStream so the browser never times out.
      // The backend streams SSE progress events, then sends COMPLETE with the result.
      const response = await fetch(`${API_BASE_URL}/commute/agent/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          travelDate: travelDateTime,
          preferences: { modePreference: selectedPreference },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to plan commute');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let event;
          try { event = JSON.parse(raw); } catch (_) { continue; }

          if (event.type === 'STARTED') {
            setProgressMessage('AI agent started browsing...');
          } else if (event.type === 'ROUTE_CREATED') {
            setCurrentRouteId(event.routeId);
          } else if (event.type === 'PROGRESS') {
            setProgressMessage(event.purpose);
          } else if (event.type === 'COMPLETE') {
            reader.cancel();
            const { routeId, tinyFishData } = event;
            setCurrentRouteId(routeId);
            setTinyFishData(tinyFishData);
            toast({ title: "Success!", description: "Route planned successfully" });
            navigate(`/route-details/${routeId}`, {
              state: {
                routeId,
                from: formData.source,
                to: formData.destination,
                date: formData.travelDate,
                preference: selectedPreference,
                tinyFishData,
              },
            });
            return;
          } else if (event.type === 'ERROR') {
            throw new Error(event.details || event.error || 'Agent failed');
          }
        }
      }
    } catch (error) {
      console.error('Error planning commute:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to plan commute',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProgressMessage('');
    }
  };

  const preferenceOptions = [
    { value: 'balanced', label: 'Balanced', icon: TrendingUp },
    { value: 'cheapest', label: 'Cheapest', icon: DollarSign },
    { value: 'fastest', label: 'Fastest', icon: Clock },
    { value: 'greenest', label: 'Greenest', icon: Leaf }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' }
  ];

  const transportModeOptions = [
    { value: 'all', label: 'All Modes' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train' },
    { value: 'taxi', label: 'Taxi' },
    { value: 'flight', label: 'Flight' },
    { value: 'metro', label: 'Metro' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">Plan Your Commute</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your journey details and let us find the best routes for you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Form - Route Details & Preferences */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                <Navigation className="h-5 w-5" />
                Route Details
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Enter your journey details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlanCommute} className="space-y-6">
                {/* Source and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source" className="dark:text-gray-200">Starting Point</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="source"
                        name="source"
                        type="text"
                        placeholder="Enter starting address"
                        className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        value={formData.source}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="dark:text-gray-200">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="destination"
                        name="destination"
                        type="text"
                        placeholder="Enter destination address"
                        className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        value={formData.destination}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelDate">Date</Label>
                    <Input
                      id="travelDate"
                      name="travelDate"
                      type="date"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      value={formData.travelDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelTime">Time</Label>
                    <Input
                      id="travelTime"
                      name="travelTime"
                      type="time"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      value={formData.travelTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Currency and Transport Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      name="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      value={formData.currency}
                      onChange={(e) => handleSelectChange('currency', e.target.value)}
                    >
                      {currencyOptions.map((curr) => (
                        <option key={curr.value} value={curr.value}>
                          {curr.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transportMode">Transport Mode</Label>
                    <select
                      id="transportMode"
                      name="transportMode"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      value={formData.transportMode}
                      onChange={(e) => handleSelectChange('transportMode', e.target.value)}
                    >
                      {transportModeOptions.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Route Preference */}
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Route Preference</Label>
                  <Tabs defaultValue="balanced" value={selectedPreference} onValueChange={setSelectedPreference}>
                    <TabsList className="grid grid-cols-4 w-full">
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

                <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="truncate max-w-xs">
                        {progressMessage || 'Connecting to AI agent...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      Find Best Routes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanCommute;