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
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import {
  Loader2,
  Check,
  DollarSign,
  User,
  Mail,
  Phone,
  Plane,
  Clock,
  MapPin,
  FileText,
  ExternalLink,
  AlertCircle,
  ShoppingCart,
  Heart,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const FlightBookingPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    nationality: '',
  });
  const [addOns, setAddOns] = useState({
    insurance: false,
    lounge: false,
    seatSelection: false,
    priorityBoarding: false,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmStep, setConfirmStep] = useState('passenger'); // 'passenger', 'add-ons', 'confirm'

  const flightData = location.state || {};

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await commuteAPI.getFlightBooking(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to load booking details',
        variant: 'destructive',
      });
      navigate('/flights/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePassengerChange = (e) => {
    const { name, value } = e.target;
    setPassengerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOnToggle = (addon) => {
    setAddOns(prev => ({
      ...prev,
      [addon]: !prev[addon]
    }));
  };

  const calculateAddOnsCost = () => {
    let total = 0;
    if (addOns.insurance) total += 25;
    if (addOns.lounge) total += 50;
    if (addOns.seatSelection) total += 15;
    if (addOns.priorityBoarding) total += 30;
    return total;
  };

  const handleConfirmBooking = async () => {
    try {
      setSubmitting(true);

      if (confirmStep === 'passenger') {
        // Validate passenger info
        if (!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email) {
          toast({
            title: 'Error',
            description: 'Please fill in all required fields',
            variant: 'destructive',
          });
          return;
        }

        // Update booking with passenger info
        await commuteAPI.addPassengerInfo(bookingId, passengerInfo);
        setConfirmStep('add-ons');
      } else if (confirmStep === 'add-ons') {
        // Add selected add-ons
        if (Object.values(addOns).some(val => val)) {
          const selectedAddOns = Object.entries(addOns)
            .filter(([_, selected]) => selected)
            .map(([addon, _]) => ({
              name: addon,
              price: { 'insurance': 25, 'lounge': 50, 'seatSelection': 15, 'priorityBoarding': 30 }[addon]
            }));
          
          await commuteAPI.addAddOns(bookingId, selectedAddOns);
        }
        setConfirmStep('confirm');
      } else if (confirmStep === 'confirm') {
        // Generate booking confirmation
        const bookingRef = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        await commuteAPI.confirmFlightBooking(bookingId, {
          bookingReference: bookingRef,
          providerBookingId: `PROV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          confirmationEmail: passengerInfo.email
        });

        toast({
          title: 'Booking Confirmed!',
          description: 'Your flight booking has been confirmed. Redirecting to provider...',
        });

        // Open provider booking in new tab
        setTimeout(() => {
          if (flightData.flight?.bookingUrl) {
            window.open(flightData.flight.bookingUrl, '_blank');
          }
          
          // Redirect to confirmation page
          setTimeout(() => {
            navigate(`/flight-confirmation/${bookingId}`, {
              state: {
                booking,
                bookingRef,
                passenger: passengerInfo,
                addOns,
              }
            });
          }, 1000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to process booking',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold">Loading Booking...</h2>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-center mb-2">Booking Not Found</h2>
            <p className="text-gray-600 text-center mb-4">The booking you're looking for doesn't exist.</p>
            <Button className="w-full" onClick={() => navigate('/flights/bookings')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const addOnsCost = calculateAddOnsCost();
  const totalPrice = (booking.totalPrice || 0) + addOnsCost;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold dark:text-gray-100">Complete Your Booking</h1>
          <p className="text-gray-600 dark:text-gray-400">Booking Reference: {booking.bookingReference || bookingId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${confirmStep === 'passenger' ? 'text-blue-600' : 'text-green-600'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmStep === 'passenger' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {confirmStep !== 'passenger' ? <Check className="w-5 h-5" /> : '1'}
                  </div>
                  <div>
                    <p className="font-semibold dark:text-gray-100">Passenger Info</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your details</p>
                  </div>
                </div>

                <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700"></div>

                <div className={`flex items-center gap-2 ${confirmStep === 'add-ons' ? 'text-blue-600' : confirmStep === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmStep === 'add-ons' ? 'bg-blue-100' : confirmStep === 'confirm' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {confirmStep === 'confirm' ? <Check className="w-5 h-5" /> : '2'}
                  </div>
                  <div>
                    <p className="font-semibold dark:text-gray-100">Add-ons</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Extras</p>
                  </div>
                </div>

                <div className="w-8 h-1 bg-gray-300 dark:bg-gray-700"></div>

                <div className={`flex items-center gap-2 ${confirmStep === 'confirm' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmStep === 'confirm' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <div>
                    <p className="font-semibold dark:text-gray-100">Confirm</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          {(confirmStep === 'passenger') && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Passenger Information
                </CardTitle>
                <CardDescription>All fields are required for booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={passengerInfo.firstName}
                      onChange={handlePassengerChange}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={passengerInfo.lastName}
                      onChange={handlePassengerChange}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={passengerInfo.email}
                    onChange={handlePassengerChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={passengerInfo.phone}
                    onChange={handlePassengerChange}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={passengerInfo.dateOfBirth}
                      onChange={handlePassengerChange}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input
                      name="nationality"
                      placeholder="e.g., United States"
                      value={passengerInfo.nationality}
                      onChange={handlePassengerChange}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add-ons Selection */}
          {(confirmStep === 'add-ons') && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add Optional Services
                </CardTitle>
                <CardDescription>Enhance your flight experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Insurance */}
                <div className="flex items-start gap-4 p-4 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                     onClick={() => handleAddOnToggle('insurance')}>
                  <input
                    type="checkbox"
                    checked={addOns.insurance}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold dark:text-gray-100">Travel Insurance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Comprehensive coverage for your trip
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">+$25</p>
                  </div>
                </div>

                {/* Lounge Access */}
                <div className="flex items-start gap-4 p-4 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                     onClick={() => handleAddOnToggle('lounge')}>
                  <input
                    type="checkbox"
                    checked={addOns.lounge}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold dark:text-gray-100">Airport Lounge Access</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access to airport lounges with free food & WiFi
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">+$50</p>
                  </div>
                </div>

                {/* Seat Selection */}
                <div className="flex items-start gap-4 p-4 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                     onClick={() => handleAddOnToggle('seatSelection')}>
                  <input
                    type="checkbox"
                    checked={addOns.seatSelection}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold dark:text-gray-100">Seat Selection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose your preferred seat
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">+$15</p>
                  </div>
                </div>

                {/* Priority Boarding */}
                <div className="flex items-start gap-4 p-4 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                     onClick={() => handleAddOnToggle('priorityBoarding')}>
                  <input
                    type="checkbox"
                    checked={addOns.priorityBoarding}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold dark:text-gray-100">Priority Boarding</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Board first and choose overhead bin space
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">+$30</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Confirmation */}
          {(confirmStep === 'confirm') && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Review & Confirm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 dark:text-gray-100">Payment Method</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You will be redirected to the airline's secure payment page to complete your booking.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold dark:text-gray-100">Terms & Conditions</h3>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I have read and agreed to the{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        terms & conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        privacy policy
                      </a>
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Flight Summary & Total */}
        <div className="space-y-4">
          {/* Flight Summary */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Flight Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Airline</p>
                <p className="font-semibold dark:text-gray-100">{booking.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Flight</p>
                <p className="font-semibold dark:text-gray-100">{booking.flightNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Departure</p>
                  <p className="font-semibold dark:text-gray-100">{booking.departureTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                  <p className="font-semibold dark:text-gray-100">
                    {booking.departLocation} → {booking.arrivalLocation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Base Fare</span>
                <span className="font-medium dark:text-gray-100">
                  ${booking.baseFare?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                <span className="font-medium dark:text-gray-100">
                  ${((booking.taxes || 0) + (booking.fees || 0)).toFixed(2)}
                </span>
              </div>
              {addOnsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Add-ons</span>
                  <span className="font-medium dark:text-gray-100">+${addOnsCost.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between items-center">
                <span className="font-semibold dark:text-gray-100">Total</span>
                <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirmBooking}
              disabled={submitting || (confirmStep === 'confirm' && !agreedToTerms)}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : confirmStep === 'confirm' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Booking
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue
                </>
              )}
            </Button>
            {confirmStep !== 'passenger' && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (confirmStep === 'add-ons') setConfirmStep('passenger');
                  else setConfirmStep('add-ons');
                }}
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBookingPage;
