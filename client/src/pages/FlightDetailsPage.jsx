import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  AlertTriangle,
  Bookmark,
  Share2,
  MoreVertical,
} from 'lucide-react';

const FlightDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [pricingDetails, setPricingDetails] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [saveWishlist, setSaveWishlist] = useState(false);

  const routeInfo = location.state || {
    from: 'Starting Point',
    to: 'Destination',
    date: new Date().toISOString().split('T')[0],
  };

  useEffect(() => {
    fetchFlights();
  }, [routeId]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await commuteAPI.getFlightOptions(routeId);
      
      const sortedFlights = response.data.flights.sort((a, b) => 
        (a.price || 0) - (b.price || 0)
      );
      
      setFlights(sortedFlights);
      
      if (sortedFlights.length > 0) {
        setSelectedFlight(sortedFlights[0]);
        await fetchPricing(sortedFlights[0]);
      }

      toast({
        title: 'Success',
        description: `Found ${sortedFlights.length} flight options`,
      });
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast({
        title: 'Error',
        description: 'Failed to load flight options',
        variant: 'destructive',
      });
      navigate(`/route-details/${routeId}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricing = async (flight) => {
    try {
      setLoadingPrice(true);
      const response = await commuteAPI.getTinyFishPricing(routeId, flight.id);
      
      const baseFare = flight.price || 0;
      const taxes = baseFare * 0.12;
      const fees = baseFare * 0.05;
      
      setPricingDetails({
        baseFare,
        taxes,
        fees,
        totalPrice: baseFare + taxes + fees,
        currency: flight.currency || 'USD',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        ...response.data
      });
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setPricingDetails({
        baseFare: flight.price || 0,
        taxes: (flight.price || 0) * 0.12,
        fees: (flight.price || 0) * 0.05,
        totalPrice: (flight.price || 0) * 1.17,
        currency: flight.currency || 'USD',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    fetchPricing(flight);
  };

  const handleBooking = async () => {
    try {
      if (!selectedFlight || !pricingDetails) {
        toast({
          title: 'Error',
          description: 'Please select a flight and wait for pricing',
          variant: 'destructive',
        });
        return;
      }

      // Create booking
      const response = await commuteAPI.createFlightBooking({
        routeId,
        flightOption: selectedFlight,
        passengerInfo: {
          passengers: 1,
          tripType: 'one-way'
        }
      });

      toast({
        title: 'Booking Created',
        description: 'Redirecting to booking details...',
      });

      // Redirect to booking confirmation page
      setTimeout(() => {
        navigate(`/flight-booking/${response.data.bookingId}`, {
          state: {
            flight: selectedFlight,
            pricing: pricingDetails,
            from: routeInfo.from,
            to: routeInfo.to,
            date: routeInfo.date,
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.error || 'Failed to create booking',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold">Loading Flights...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/route-details/${routeId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold dark:text-gray-100">Select Your Flight</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {routeInfo.from} → {routeInfo.to} on {routeInfo.date}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flights List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Available Flights ({flights.length})
              </CardTitle>
              <CardDescription>
                Flights sorted by price (cheapest first)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {flights.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No flights available</p>
                </div>
              ) : (
                flights.map((flight, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectFlight(flight)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedFlight?.id === flight.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold dark:text-gray-100">
                            {flight.airline || flight.provider}
                          </h3>
                          {flight.rating && (
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="w-4 h-4 fill-yellow-600" />
                              {flight.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {flight.flightNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ${flight.price?.toFixed(2) || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Per Person</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3 pb-3 border-b dark:border-gray-700">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Departure</p>
                        <p className="text-sm font-semibold dark:text-gray-100">
                          {flight.departureTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</p>
                        <p className="text-sm font-semibold dark:text-gray-100">
                          {flight.duration ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrival</p>
                        <p className="text-sm font-semibold dark:text-gray-100">
                          {flight.arrivalTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {flight.stops > 0 && (
                        <Badge variant="outline">{flight.stops} Stop{flight.stops > 1 ? 's' : ''}</Badge>
                      )}
                      {flight.stops === 0 && <Badge variant="secondary">Nonstop</Badge>}
                      <Badge variant="outline">{flight.cabinClass || 'Economy'}</Badge>
                      {flight.rating && flight.rating >= 4.5 && (
                        <Badge variant="success">Highly Rated</Badge>
                      )}
                    </div>

                    {flight.amenities && flight.amenities.length > 0 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Amenities: {flight.amenities.slice(0, 2).join(', ')}
                        {flight.amenities.length > 2 && ` +${flight.amenities.length - 2} more`}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between pt-3 border-t dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        {flight.carbon_kg && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Leaf className="w-3 h-3" />
                            {flight.carbon_kg.toFixed(2)} kg CO₂
                          </div>
                        )}
                      </div>
                      {selectedFlight?.id === flight.id && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pricing Summary & Booking */}
        <div className="space-y-4">
          {selectedFlight && (
            <Card className="dark:bg-gray-800 dark:border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Base Fare</span>
                    <span className="font-medium dark:text-gray-100">
                      ${pricingDetails?.baseFare?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Taxes (12%)</span>
                    <span className="font-medium dark:text-gray-100">
                      ${pricingDetails?.taxes?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fees (5%)</span>
                    <span className="font-medium dark:text-gray-100">
                      ${pricingDetails?.fees?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-3 flex justify-between items-center">
                  <span className="font-semibold dark:text-gray-100">Total Price</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${pricingDetails?.totalPrice?.toFixed(2) || '0.00'}
                  </span>
                </div>

                {pricingDetails?.validUntil && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center bg-yellow-50 dark:bg-yellow-950 p-2 rounded">
                    Price valid until {new Date(pricingDetails.validUntil).toLocaleString()}
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={loadingPrice}
                >
                  {loadingPrice ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plane className="w-4 h-4 mr-2" />
                      Continue to Booking
                    </>
                  )}
                </Button>

                <div className="space-y-2 text-sm">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSaveWishlist(!saveWishlist)}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${saveWishlist ? 'fill-current' : ''}`} />
                    {saveWishlist ? 'Saved' : 'Save Flight'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flight Details */}
          {selectedFlight && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Flight Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Airline</p>
                  <p className="font-medium dark:text-gray-100">{selectedFlight.airline}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Flight Number</p>
                  <p className="font-medium dark:text-gray-100">{selectedFlight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Cabin Class</p>
                  <p className="font-medium dark:text-gray-100 capitalize">
                    {selectedFlight.cabinClass}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Baggage Allowance</p>
                  <p className="font-medium dark:text-gray-100">
                    {selectedFlight.baggageAllowance || 'Standard'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Cancellation Policy</p>
                  <p className="font-medium dark:text-gray-100">
                    {selectedFlight.cancellationPolicy || 'Non-refundable'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;
