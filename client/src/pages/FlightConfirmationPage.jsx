import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  CheckCircle,
  Download,
  Mail,
  Phone,
  Printer,
  Share2,
  Home,
  Calendar,
  MapPin,
  Plane,
  Ticket,
} from 'lucide-react';

const FlightConfirmationPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const confirmationData = location.state || {};

  useEffect(() => {
    // Auto-play confirmation sound (optional)
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    audio.play().catch(() => {});
  }, []);

  const handleDownloadReceipt = () => {
    // Generate PDF receipt (this would require a library like jsPDF)
    console.log('Downloading receipt...');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Flight Booking Confirmation',
        text: `Check out my flight booking: ${confirmationData.bookingRef}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Confirmation Modal */}
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your flight booking has been successfully confirmed
          </p>
        </div>

        {/* Confirmation Details */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-lg">
            <CardTitle className="text-white text-2xl">Booking Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Booking Reference</p>
                <p className="text-xl font-bold text-blue-600 break-all">
                  {confirmationData.bookingRef || bookingId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmation Email</p>
                <p className="text-lg font-semibold dark:text-gray-100">
                  {confirmationData.passenger?.email || 'Sent to your email'}
                </p>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold dark:text-gray-100">Booking Status</h3>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Details */}
        {confirmationData.booking && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Airline</p>
                  <p className="font-semibold dark:text-gray-100">
                    {confirmationData.booking.airline}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Flight Number</p>
                  <p className="font-semibold dark:text-gray-100">
                    {confirmationData.booking.flightNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Departure</p>
                  <p className="font-semibold dark:text-gray-100">
                    {confirmationData.booking.departureTime}
                  </p>
                  <p className="text-xs text-gray-500">{confirmationData.booking.departLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arrival</p>
                  <p className="font-semibold dark:text-gray-100">
                    {confirmationData.booking.arrivalTime}
                  </p>
                  <p className="text-xs text-gray-500">{confirmationData.booking.arrivalLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cabin Class</p>
                  <p className="font-semibold dark:text-gray-100 capitalize">
                    {confirmationData.booking.cabinClass}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Passengers</p>
                  <p className="font-semibold dark:text-gray-100">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Passenger Details */}
        {confirmationData.passenger && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-semibold dark:text-gray-100">
                    {confirmationData.passenger.firstName} {confirmationData.passenger.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold dark:text-gray-100 break-all">
                    {confirmationData.passenger.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Summary */}
        {confirmationData.booking && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Price Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Base Fare</span>
                <span className="font-medium dark:text-gray-100">
                  ${confirmationData.booking.baseFare?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                <span className="font-medium dark:text-gray-100">
                  ${((confirmationData.booking.taxes || 0) + (confirmationData.booking.fees || 0)).toFixed(2)}
                </span>
              </div>
              {confirmationData.addOns && Object.values(confirmationData.addOns).some(v => v) && (
                <div className="flex justify-between text-blue-600">
                  <span>Add-ons</span>
                  <span>+${Object.entries(confirmationData.addOns)
                    .filter(([_, selected]) => selected)
                    .reduce((sum, [addon]) => sum + ({ 'insurance': 25, 'lounge': 50, 'seatSelection': 15, 'priorityBoarding': 30 }[addon] || 0), 0).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between items-center text-xl">
                <span className="font-bold dark:text-gray-100">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${(confirmationData.booking.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleDownloadReceipt}
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handlePrintReceipt}
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={handleShareBooking}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Resend Email
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex gap-3">
              <span className="font-bold">1.</span>
              <text>A confirmation email with your booking details will be sent shortly</text>
            </div>
            <div className="flex gap-3">
              <span className="font-bold">2.</span>
              <text>Check in online 24 hours before your flight</text>
            </div>
            <div className="flex gap-3">
              <span className="font-bold">3.</span>
              <text>Arrive at the airport at least 2 hours before departure</text>
            </div>
            <div className="flex gap-3">
              <span className="font-bold">4.</span>
              <text>Have your booking reference and passport ready</text>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() => navigate('/flights/bookings')}
          >
            View My Bookings
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightConfirmationPage;
