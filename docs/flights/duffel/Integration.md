# Duffel API Integration Documentation

## Overview

This documentation describes the implementation of Duffel API integration for flight search and booking, following all best practices recommended by Duffel.

## Table of Contents

1. [General Configuration](#general-configuration)
2. [Implemented Endpoints](#implemented-endpoints)
3. [Flight Search](#flight-search)
4. [Private Fares](#private-fares)
5. [Conditions Display](#conditions-display)
6. [Layover Visualization](#layover-visualization)
7. [Loyalty Programs](#loyalty-programs)
8. [Webhooks](#webhooks)
9. [Database](#database)
10. [Best Practices](#best-practices)

## General Configuration

### Environment Variables
```env
DUFFEL_API_KEY=your_duffel_api_key
DUFFEL_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### API Client Setup
```typescript
// lib/duffel/client.ts
import { DuffelApi } from '@duffel/api';

export const duffel = new DuffelApi({
  token: process.env.DUFFEL_API_KEY!,
  version: 'v1'
});
```

## Implemented Endpoints

### Flight Search Endpoints
- `POST /api/flights/search` - Flight search with offer requests
- `GET /api/flights/offers/:id` - Get specific offer details
- `POST /api/flights/book` - Book selected flights
- `GET /api/flights/orders/:id` - Get booking details

### Webhook Endpoints
- `POST /api/webhooks/duffel` - Handle Duffel webhooks
- `GET /api/webhooks/duffel/verify` - Webhook verification

## Flight Search

### Search Request Structure
```typescript
interface FlightSearchRequest {
  origin: string;          // IATA code (e.g., "MAD")
  destination: string;     // IATA code (e.g., "BCN")
  departure_date: string;  // YYYY-MM-DD format
  return_date?: string;    // Optional for round-trip
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  private_fares?: boolean;
}
```

### Implementation
```typescript
// app/api/flights/search/route.ts
export async function POST(request: Request) {
  try {
    const searchParams = await request.json();
    
    const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin: searchParams.origin,
          destination: searchParams.destination,
          departure_date: searchParams.departure_date,
        }
      ],
      passengers: [
        ...Array(searchParams.passengers.adults).fill({ type: 'adult' })
      ],
      cabin_class: searchParams.cabin_class || 'economy',
      private_fares: searchParams.private_fares || false
    });

    return Response.json({
      request_id: offerRequest.data.id,
      offers: offerRequest.data.offers
    });
  } catch (error) {
    return Response.json(
      { error: 'Flight search failed' },
      { status: 500 }
    );
  }
}
```

## Private Fares

### Configuration
```typescript
// Enable private fares in search
const searchWithPrivateFares = {
  private_fares: true,
  // Other search parameters...
};
```

### Corporate Account Setup
Private fares require:
1. Corporate agreement with airlines
2. Duffel corporate account configuration
3. Proper authentication headers

## Conditions Display

### Fare Conditions
```typescript
interface FareConditions {
  change_before_departure?: {
    allowed: boolean;
    penalty_amount?: string;
    penalty_currency?: string;
  };
  cancel_before_departure?: {
    allowed: boolean;
    penalty_amount?: string;
    penalty_currency?: string;
  };
  advance_seat_selection?: boolean;
  priority_check_in?: boolean;
  priority_boarding?: boolean;
}
```

### UI Implementation
```tsx
// components/flights/FareConditions.tsx
export function FareConditions({ conditions }: { conditions: FareConditions }) {
  return (
    <div className="fare-conditions">
      <h3>Fare Conditions</h3>
      
      {conditions.change_before_departure && (
        <div className="condition">
          <span>Changes: </span>
          {conditions.change_before_departure.allowed ? 'Allowed' : 'Not Allowed'}
          {conditions.change_before_departure.penalty_amount && (
            <span> (Fee: {conditions.change_before_departure.penalty_amount})</span>
          )}
        </div>
      )}
      
      {/* Additional conditions... */}
    </div>
  );
}
```

## Layover Visualization

### Layover Information
```typescript
interface LayoverInfo {
  airport: {
    iata_code: string;
    name: string;
    city_name: string;
  };
  duration: string; // ISO 8601 duration
  arrival_time: string;
  departure_time: string;
}
```

### Duration Calculation
```typescript
// utils/flight-helpers.ts
export function calculateLayoverDuration(arrival: string, departure: string): string {
  const arrivalTime = new Date(arrival);
  const departureTime = new Date(departure);
  const duration = departureTime.getTime() - arrivalTime.getTime();
  
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}
```

## Loyalty Programs

### Supported Programs
```typescript
interface LoyaltyProgram {
  airline_iata_code: string;
  account_number: string;
}

// Add to booking request
const bookingRequest = {
  // ... other booking data
  loyalty_programme_accounts: [
    {
      airline_iata_code: "BA",
      account_number: "123456789"
    }
  ]
};
```

## Webhooks

### Webhook Handler
```typescript
// app/api/webhooks/duffel/route.ts
import crypto from 'crypto';

export async function POST(request: Request) {
  const signature = request.headers.get('x-duffel-signature');
  const body = await request.text();
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.DUFFEL_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  
  if (signature !== `sha256=${expectedSignature}`) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  const event = JSON.parse(body);
  
  switch (event.type) {
    case 'order.created':
      await handleOrderCreated(event.data);
      break;
    case 'order.cancelled':
      await handleOrderCancelled(event.data);
      break;
    // Handle other event types...
  }
  
  return new Response('OK', { status: 200 });
}
```

### Event Types
- `order.created` - New booking created
- `order.cancelled` - Booking cancelled
- `order.updated` - Booking updated
- `payment.succeeded` - Payment completed
- `payment.failed` - Payment failed

## Database

### Orders Table
```sql
CREATE TABLE flight_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duffel_order_id VARCHAR NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  booking_reference VARCHAR NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(50) NOT NULL,
  passengers JSONB NOT NULL,
  slices JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Offers Cache Table
```sql
CREATE TABLE flight_offers_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_request_id VARCHAR NOT NULL,
  offers JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_flight_offers_cache_request_id ON flight_offers_cache(offer_request_id);
CREATE INDEX idx_flight_offers_cache_expires_at ON flight_offers_cache(expires_at);
```

## Best Practices

### 1. Caching Strategy
- Cache offer requests for 30 minutes
- Store frequently searched routes
- Implement Redis for production caching

### 2. Error Handling
```typescript
// Implement comprehensive error handling
try {
  const result = await duffel.offerRequests.create(params);
  return result;
} catch (error) {
  if (error.code === 'invalid_request') {
    // Handle validation errors
  } else if (error.code === 'rate_limited') {
    // Handle rate limiting
  } else {
    // Handle other API errors
  }
  throw error;
}
```

### 3. Rate Limiting
- Implement client-side rate limiting
- Monitor API usage quotas
- Use exponential backoff for retries

### 4. Security
- Validate all input parameters
- Sanitize user data before API calls
- Use environment variables for sensitive data
- Implement proper authentication

### 5. Performance
- Implement connection pooling
- Use compression for large responses
- Monitor API response times
- Cache static data (airports, airlines)

### 6. Testing
```typescript
// Mock Duffel API for testing
jest.mock('@duffel/api', () => ({
  DuffelApi: jest.fn().mockImplementation(() => ({
    offerRequests: {
      create: jest.fn().mockResolvedValue(mockOfferRequest),
      get: jest.fn().mockResolvedValue(mockOffer)
    }
  }))
}));
```

## API Reference

### Key Duffel API Endpoints Used
- `POST /offer_requests` - Search flights
- `GET /offers/:id` - Get offer details
- `POST /orders` - Create booking
- `GET /orders/:id` - Get booking details
- `POST /payments` - Process payment

### Response Formats
All API responses follow Duffel's standard format:
```typescript
interface DuffelResponse<T> {
  data: T;
  meta?: {
    after?: string;
    before?: string;
    limit?: number;
  };
}
```

---

For more detailed information, refer to the [official Duffel API documentation](https://duffel.com/docs/api).
