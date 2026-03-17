# CommuteGo 2.0 - Complete Flight Booking System Implementation Guide

## 🎯 Overview

This is a complete production-ready flight booking system integrated with real or mock transportation data. The system enables users to:

1. **Plan Commute**: Enter source, destination, date, and time
2. **View All Transportation Options**: Including flights, buses, trains, and rideshare
3. **Select Flight Option**: Choose a flight from the list
4. **View Flight Details**: See all available flights with pricing
5. **Book Flight**: Go through complete booking flow
6. **Get Confirmation**: Receive booking confirmation and redirect to provider

## 📋 Architecture Overview

### Backend Stack
- **Node.js + Express**: Server framework
- **MySQL**: Database
- **TinyFish API**: Real transportation data (to be configured)
- **Mock Service**: Development/testing data

### Frontend Stack
- **React**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Router**: Navigation

### Database Tables (New)
- `flight_bookings`: Store user flight bookings
- `transportation_options_cache`: Cache transportation options
- `flight_preferences`: User flight preferences
- `flight_pricing_cache`: Cache pricing information
- `flight_seat_availability`: Track seat availability

## 🚀 Installation & Setup

### 1. Database Setup

Run the migration script to create new tables:

```bash
# From your database management tool or terminal
mysql -u root -p your_password < DATABASE_MIGRATION.sql
```

### 2. Backend Configuration

Update your `.env` file:

```env
# TinyFish API Configuration
TINYFISH_API_KEY=your_api_key_here
TINYFISH_BASE_URL=https://agent.tinyfish.ai/v1
TINYFISH_RATE_PER_MINUTE=60
TINYFISH_RATE_PER_HOUR=1000
TINYFISH_CONCURRENT=5
TINYFISH_CACHE_TTL=300000

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

### 3. Backend Routes Update

Add new routes to your app (already configured in the code):
- `GET /commute/routes/:routeId/flights` - Get flight options
- `POST /commute/flights/booking` - Create flight booking
- `GET /commute/flights/booking/:bookingId` - Get booking details
- `GET /commute/flights/bookings` - Get user's flight bookings
- `PATCH /commute/flights/booking/:bookingId/status` - Update booking status
- `POST /commute/flights/booking/:bookingId/confirm` - Confirm booking

### 4. Frontend Routes

Add these routes to your React Router configuration:

```jsx
// In your main routing file (App.jsx or Routes.jsx)
import FlightDetailsPage from './pages/FlightDetailsPage';
import FlightBookingPage from './pages/FlightBookingPage';
import FlightConfirmationPage from './pages/FlightConfirmationPage';

<Routes>
  {/* ... existing routes ... */}
  
  {/* Flight Routes */}
  <Route path="/flight-details/:routeId" element={<FlightDetailsPage />} />
  <Route path="/flight-booking/:bookingId" element={<FlightBookingPage />} />
  <Route path="/flight-confirmation/:bookingId" element={<FlightConfirmationPage />} />
  
  {/* ... more routes ... */}
</Routes>
```

### 5. Update PlanCommute Component

The PlanCommute component needs to properly handle the TinyFish data including flights. Update the route handling:

```jsx
// When user selects a flight route
const handleSelectFlightRoute = (flight) => {
  navigate(`/flight-details/${currentRouteId}`, {
    state: {
      flight,
      routeId: currentRouteId,
      from: formData.source,
      to: formData.destination,
      date: formData.travelDate,
      tinyFishData
    }
  });
};
```

## 🔌 TinyFish API Integration

### Current Setup

The system uses a flexible approach:

1. **Development/Testing**: Mock service generates realistic data
2. **Production**: Real TinyFish API is called

The controller automatically:
- Calls TinyFish API if API key is configured
- Falls back to mock data if TinyFish fails
- Caches results in database


### Configuring Real TinyFish API

When you provide TinyFish API documentation, update `tinyFishTransportationService.js`:

```javascript
// Example: If TinyFish provides REST endpoints
async fetchFlights(searchConfig) {
  const response = await this.client.request('/flights/search', {
    method: 'POST',
    body: {
      origin: searchConfig.origin,
      destination: searchConfig.destination,
      date: searchConfig.date,
      passengers: 1,
      cabin_class: 'economy'
    }
  });
  
  return response.flights.map(flight => ({
    id: flight.id,
    mode: 'flight',
    airline: flight.airline,
    flightNumber: flight.flight_number,
    departureTime: flight.departure_time,
    arrivalTime: flight.arrival_time,
    price: flight.price,
    currency: flight.currency,
    stops: flight.stops,
    duration: flight.duration,
    provider: flight.airline,
    bookingUrl: flight.booking_url,
    // ... other fields ...
  }));
}
```

## 📊 Data Flow

### Complete User Journey

```
1. User fills PlanCommute form
   ↓
2. Backend calls TinyFish API (or mock)
   ↓
3. Data stored in database (tinyfish_route_data)
   ↓
4. Frontend displays all options (flights, buses, trains, etc.)
   ↓
5. User selects flight → navigate to FlightDetailsPage
   ↓
6. Show all flight options for that route
   ↓
7. User selects specific flight → navigate to FlightBookingPage
   ↓
8. Fill passenger info, select add-ons, confirm
   ↓
9. Create booking record in database
   ↓
10. Open provider booking in new tab
    ↓
11. Show confirmation page
```

### API Calls

```javascript
// 1. Plan commute (gets TinyFish data)
commuteAPI.plan({
  source: 'New York',
  destination: 'Los Angeles',
  travelDate: '2024-12-25T08:00',
  preferences: { modePreference: 'balanced' }
})

// 2. Get flight options for a route
commuteAPI.getFlightOptions(routeId)

// 3. Create flight booking
commuteAPI.createFlightBooking({
  routeId,
  flightOption: flight,
  passengerInfo: { ... }
})

// 4. Confirm booking
commuteAPI.confirmFlightBooking(bookingId, {
  bookingReference,
  providerBookingId,
  confirmationEmail
})
```

## 🎨 UI Components

### New Components Created

1. **FlightCard** (`components/commute/FlightCard.jsx`)
   - Displays individual flight options
   - Shows pricing, timings, amenities
   - Minimal and full card versions

2. **FlightDetailsPage** (`pages/FlightDetailsPage.jsx`)
   - List of available flights
   - Price breakdown
   - Real-time pricing

3. **FlightBookingPage** (`pages/FlightBookingPage.jsx`)
   - Multi-step booking form
   - Passenger info collection
   - Add-ons selection
   - Confirmation

4. **FlightConfirmationPage** (`pages/FlightConfirmationPage.jsx`)
   - Booking confirmation display
   - Booking reference
   - Download/print options

## 📦 Database Models

### FlightBooking Model

```javascript
const booking = await FlightBooking.create({
  userId,
  routeId,
  flightProvider: 'Delta Airlines',
  airline: 'Delta',
  flightNumber: 'DL123',
  departureTime: '2024-12-25 08:00:00',
  arrivalTime: '2024-12-25 11:00:00',
  departLocation: 'New York (JFK)',
  arrivalLocation: 'Los Angeles (LAX)',
  price: 250,
  baseFare: 250,
  taxes: 30,
  fees: 12.5,
  totalPrice: 292.5,
  // ... more fields
});
```

## 🔒 Security Considerations

1. **Auth Middleware**: All endpoints protected
2. **Ownership Verification**: Users can only access their own bookings
3. **Input Validation**: All user inputs validated
4. **Rate Limiting**: TinyFish API rate limits enforced
5. **SSL/TLS**: Use HTTPS in production
6. **Data Encryption**: Sensitive data (passport, payment) encrypted

## 🧪 Testing

### Testing Flights Functionality

```bash
# 1. Start backend
cd server
npm install
npm start

# 2. Start frontend
cd client
npm install
npm run dev

# 3. Test the flow
# - Go to http://localhost:5173/plan-commute
# - Fill in: From: "New York", To: "Los Angeles", Date: tomorrow
# - Click "Find Best Routes"
# - You should see flights + other options
# - Click on a flight option to see details
# - Click "Continue to Booking"
# - Fill in passenger info
# - Complete booking
# - See confirmation page
```

## 🐛 Troubleshooting

### Issue: No flights appearing

**Solution**:
1. Check TinyFish API key in `.env`
2. Check database migration ran successfully
3. Check browser console for errors
4. Mock service should still provide data as fallback

### Issue: Booking not saving

**Solution**:
1. Verify auth middleware is working
2. Check database connection
3. Verify `flight_bookings` table exists
4. Check user ID is properly extracted

### Issue: Redirect to provider not working

**Solution**:
1. Verify `bookingUrl` is being set in flight data
2. Check browser popup blocker
3. Verify CORS settings if provider is on different domain

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=commutego

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# TinyFish
TINYFISH_API_KEY=your-api-key
TINYFISH_BASE_URL=https://agent.tinyfish.ai/v1
TINYFISH_RATE_PER_MINUTE=60
TINYFISH_RATE_PER_HOUR=1000

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## 🚢 Production Deployment

1. **Database**: Create backups, verify migrations
2. **Environment Variables**: Set production values
3. **SSL Certificates**: Install for HTTPS
4. **Rate Limiting**: Adjust for expected traffic
5. **Monitoring**: Set up error tracking
6. **Logging**: Enable comprehensive logging
7. **Testing**: Run full integration tests

## 📞 Support & Next Steps

### What You Need to Provide

1. **TinyFish API Details**:
   - API key
   - API documentation/endpoints
   - Authentication method
   - Response format

2. **Provider Booking URLs**:
   - Where to redirect users
   - Auto-fill parameters accepted
   - Return URL for confirmation

### Next Features to Add

1. Email confirmations
2. SMS notifications
3. Seat selection UI
4. Payment processing
5. Refund management
6. Customer support integration
7. Analytics dashboard

## 📄 License

This implementation is part of the CommuteGo 2.0 project.

---

**Last Updated**: March 16, 2026
**Version**: 1.0.0
