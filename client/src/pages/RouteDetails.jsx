import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { commuteAPI } from '../services/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Plane,
  Train,
  Bus,
  Car,
  Clock,
  DollarSign,
  Leaf,
  MapPin,
  Users,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Star,
  Wifi,
  Utensils,
  Zap,
} from 'lucide-react';

const RouteDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId: urlRouteId } = useParams();
  const { toast } = useToast();

  // Get route data from location state OR URL params
  const selectedRoute = location.state?.option;
  const from = location.state?.from;
  const to = location.state?.to;
  // Prefer URL param routeId, fallback to location state
  const routeId = urlRouteId || location.state?.routeId;
  const tinyFishData = location.state?.tinyFishData;

  const [loading, setLoading] = useState(false);
  const [transportationOptions, setTransportationOptions] = useState([]);
  const [flightOptions, setFlightOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [pricingDetails, setPricingDetails] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  // Fetch or use provided TinyFish options
  useEffect(() => {
    if (!routeId && !selectedRoute) {
      toast({
        title: 'Error',
        description: 'No route selected. Please go back and select a route.',
        variant: 'destructive',
      });
      navigate('/plan');
      return;
    }

    const fetchOrUseOptions = async () => {
      try {
        setLoading(true);

        let options = [];
        let flights = [];

        // First try to use data passed from PlanCommute
        if (tinyFishData && tinyFishData.transportationOptions && tinyFishData.transportationOptions.length > 0) {
          console.log('Using TinyFish data from navigation state');
          options = tinyFishData.transportationOptions || [];
          flights = tinyFishData.flightOptions || [];
        } else if (routeId) {
          // Fallback: fetch from backend
          console.log('Fetching TinyFish data from backend for routeId:', routeId);
          try {
            const response = await commuteAPI.getTinyFishOptions(routeId);
            options = response.data.transportationOptions || [];
            flights = response.data.flightOptions || [];
          } catch (fetchError) {
            console.warn('Could not fetch from api, will try to use fallback:', fetchError);
            // Data might be passed in location state, just continue
          }
        }

        if (options.length === 0) {
          console.warn('No transportation options available');
          toast({
            title: 'No Options',
            description: 'No transportation options found for this route.',
            variant: 'default',
          });
        } else {
          console.log(`Loaded ${options.length} transportation options`);
          toast({
            title: 'Success',
            description: `Found ${options.length} transportation options`,
          });
        }

        setTransportationOptions(options);
        setFlightOptions(flights);
      } catch (error) {
        console.error('Error loading options:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transportation options. Using fallback data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrUseOptions();
  }, [routeId, selectedRoute, tinyFishData, toast, navigate]);

  // Get pricing details when option is selected
  const handleSelectOption = async (option) => {
    setSelectedOption(option);
    setPricingDetails(null);

    try {
      setLoadingPricing(true);
      
      // Calculate simple pricing breakdown
      const baseFare = option.price || 0;
      const taxRate = 0.1; // 10% tax
      const feeRate = 0.05; // 5% fees

      const pricing = {
        optionId: option.id,
        baseFare: baseFare,
        taxes: baseFare * taxRate,
        fees: baseFare * feeRate,
        totalPrice: baseFare * (1 + taxRate + feeRate),
        currency: option.currency || 'USD',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      setPricingDetails(pricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      setPricingDetails({
        optionId: option.id,
        baseFare: option.price || 0,
        totalPrice: option.price || 0,
        currency: option.currency || 'USD',
      });
    } finally {
      setLoadingPricing(false);
    }
  };

  // Open booking in new tab with auto-filled data
  const handleBook = async (option) => {
    try {
      const bookingData = {
        provider: option.provider || 'Unknown',
        source: from,
        destination: to,
        departureTime: option.departureTime,
        arrivalTime: option.arrivalTime,
        price: pricingDetails?.totalPrice || option.price,
        mode: option.mode,
        bookingUrl: option.bookingUrl || '#',
      };

      // Open booking in new tab with auto-filled data
      const bookingWindow = window.open('about:blank', '_blank');
      const bookingHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Complete Booking - ${bookingData.provider}</title>
          <link rel="stylesheet" href="data:text/css,
            * { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; }
            body { padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
            h1 { color: #333; margin-top: 0; }
            .booking-details { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #666; }
            .value { color: #333; font-size: 16px; }
            .price { font-size: 24px; font-weight: 700; color: #667eea; }
            .loading { text-align: center; color: #999; }
            .status { text-align: center; margin-top: 20px; }
            .status.success { color: #4caf50; }
          ">
        </head>
        <body>
          <div class="container">
            <h1>✓ Booking Confirmation</h1>
            <div class="booking-details">
              <h2 style="margin-top: 0; color: #667eea;">${bookingData.provider}</h2>
              <div class="detail-row">
                <span class="label">Route:</span>
                <span class="value">${bookingData.source} → ${bookingData.destination}</span>
              </div>
              <div class="detail-row">
                <span class="label">Departure:</span>
                <span class="value">${bookingData.departureTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">Arrival:</span>
                <span class="value">${bookingData.arrivalTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">Total Price:</span>
                <span class="price">$${(bookingData.price || 0).toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Mode:</span>
                <span class="value">${bookingData.mode.toUpperCase()}</span>
              </div>
            </div>
            <div class="status success">
              <p>Your booking information has been prepared.</p>
              <p class="loading">Redirecting to booking page in 3 seconds...</p>
            </div>
            <script>
              setTimeout(() => {
                window.close();
              }, 3500);
            </script>
          </div>
        </body>
        </html>
      `;

      bookingWindow.document.write(bookingHtml);
      bookingWindow.document.close();

      toast({
        title: 'Booking Prepared',
        description: `Ready to book with ${bookingData.provider}`,
      });
    } catch (error) {
      console.error('Error preparing booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare booking',
        variant: 'destructive',
      });
    }
  };

  // Get icon for transport mode
  const getModeIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'flight':
        return <Plane className="h-5 w-5" />;
      case 'train':
        return <Train className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'rideshare':
        return <Car className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  // Filter options by selected tab
  const filteredOptions = selectedTab === 'flights' 
    ? (flightOptions.length > 0 ? flightOptions : transportationOptions.filter(o => o.mode === 'flight'))
    : transportationOptions;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="dark:text-foreground">Loading transportation options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 dark:bg-background">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/plan')}
          className="dark:hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 dark:text-foreground" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold dark:text-foreground">Route Options</h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            {from} → {to}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="dark:bg-muted/50">
              <TabsTrigger value="all" className="dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                All Options ({transportationOptions.length})
              </TabsTrigger>
              {(flightOptions.length > 0 || transportationOptions.filter(o => o.mode === 'flight').length > 0) && (
                <TabsTrigger value="flights" className="dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                  Flights ({flightOptions.length || transportationOptions.filter(o => o.mode === 'flight').length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4 mt-4">
              {filteredOptions.length === 0 ? (
                <Card className="dark:bg-card dark:border-border">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-muted-foreground dark:text-muted-foreground">No {selectedTab === 'flights' ? 'flight' : ''} options available for this route.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 dark:border-input dark:hover:bg-muted"
                        onClick={() => navigate('/plan')}
                      >
                        Go Back and Try Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition dark:bg-card dark:border-border ${
                      selectedOption?.id === option.id
                        ? 'ring-2 ring-blue-500 dark:bg-blue-900/30'
                        : 'hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-slate-900/50'
                    }`}
                    onClick={() => handleSelectOption(option)}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left: Provider & Times */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            {getModeIcon(option.mode)}
                            <div>
                              <h3 className="font-semibold text-lg dark:text-foreground">
                                {option.provider}
                              </h3>
                              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                                {option.mode?.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm dark:text-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
                              <span className="dark:text-foreground">Departure: {option.departureTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
                              <span className="dark:text-foreground">Arrival: {option.arrivalTime}</span>
                            </div>
                            {option.carbon_kg && (
                              <div className="flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-green-600" />
                                <span className="dark:text-foreground">{option.carbon_kg?.toFixed(1)} kg CO₂</span>
                              </div>
                            )}
                          </div>

                          {/* Flight specific info */}
                          {option.mode === 'flight' && (
                            <div className="mt-3 space-y-1 text-sm dark:text-foreground">
                              {option.airline && (
                                <p className="dark:text-foreground">
                                  <strong className="dark:text-foreground">Airline:</strong> {option.airline}
                                </p>
                              )}
                              {option.stops !== undefined && (
                                <p className="dark:text-foreground">
                                  <strong className="dark:text-foreground">Stops:</strong> {option.stops}
                                </p>
                              )}
                              {option.cabinClass && (
                                <Badge variant="outline" className="dark:border-input dark:text-foreground">
                                  {option.cabinClass}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right: Price & Action */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="flex items-end gap-1 mb-4">
                              <span className="text-3xl font-bold dark:text-foreground">
                                ${(option.price || 0).toFixed(0)}
                              </span>
                              <span className="text-muted-foreground dark:text-muted-foreground">
                                {option.currency}
                              </span>
                            </div>

                            {option.duration && (
                              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                                Duration: {Math.floor(option.duration / 60)}h {option.duration % 60}m
                              </p>
                            )}

                            {/* Amenities */}
                            {option.amenities && option.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {option.amenities.slice(0, 3).map((amenity) => (
                                  <Badge key={amenity} variant="secondary" className="text-xs dark:bg-secondary dark:text-secondary-foreground">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleSelectOption(option)}
                            className="w-full mt-4"
                            disabled={loadingPricing}
                          >
                            {loadingPricing && selectedOption?.id === option.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                Select Route
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: Selected Option Summary */}
        {selectedOption && (
          <div>
            <Card className="sticky top-6 dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="dark:text-foreground">Selection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Provider</p>
                  <p className="font-semibold text-lg dark:text-foreground">{selectedOption.provider}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">Departure</p>
                    <p className="font-mono text-sm dark:text-foreground">{selectedOption.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">Arrival</p>
                    <p className="font-mono text-sm dark:text-foreground">{selectedOption.arrivalTime}</p>
                  </div>
                </div>

                <div className="border-t pt-4 dark:border-border">
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-2">Pricing Breakdown</p>
                  <div className="space-y-1 text-sm dark:text-foreground">
                    {pricingDetails ? (
                      <>
                        <div className="flex justify-between">
                          <span className="dark:text-foreground">Base Fare</span>
                          <span className="dark:text-foreground">${pricingDetails.baseFare?.toFixed(2)}</span>
                        </div>
                        {pricingDetails.taxes && (
                          <div className="flex justify-between">
                            <span className="dark:text-foreground">Taxes (10%)</span>
                            <span className="dark:text-foreground">${pricingDetails.taxes.toFixed(2)}</span>
                          </div>
                        )}
                        {pricingDetails.fees && (
                          <div className="flex justify-between">
                            <span className="dark:text-foreground">Fees (5%)</span>
                            <span className="dark:text-foreground">${pricingDetails.fees.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold border-t pt-2 dark:border-border">
                          <span className="dark:text-foreground">Total</span>
                          <span className="dark:text-foreground">${pricingDetails.totalPrice?.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between font-bold">
                        <span className="dark:text-foreground">Total</span>
                        <span className="dark:text-foreground">${(selectedOption.price || 0).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleBook(selectedOption)}
                  className="w-full"
                  size="lg"
                  disabled={loadingPricing}
                >
                  {loadingPricing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Book Now
                    </>
                  )}
                </Button>

                {pricingDetails?.validUntil && (
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground text-center mt-2">
                    Prices valid until{' '}
                    {new Date(pricingDetails.validUntil).toLocaleTimeString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetails;
