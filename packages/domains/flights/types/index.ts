// Flight domain types and interfaces

// Core flight entities
export interface Flight {
  id: string;
  flightNumber: string;
  airline: Airline;
  aircraft: Aircraft;
  departure: FlightLocation;
  arrival: FlightLocation;
  duration: string; // ISO 8601 duration format
  price: Price;
  availableSeats: number;
  cabinClass: CabinClass;
  stops: FlightStop[];
  amenities: FlightAmenity[];
  baggage: BaggageAllowance;
  cancellationPolicy: CancellationPolicy;
  createdAt: string;
  updatedAt: string;
}

export interface Airline {
  id: string;
  name: string;
  code: string; // IATA code
  logo?: string;
  rating: number;
  isPreferred: boolean;
}

export interface Aircraft {
  id: string;
  model: string;
  manufacturer: string;
  capacity: number;
  wifiAvailable: boolean;
  powerOutlets: boolean;
}

export interface FlightLocation {
  airport: Airport;
  terminal?: string;
  gate?: string;
  scheduledTime: string;
  estimatedTime?: string;
  actualTime?: string;
  status: FlightStatus;
}

export interface Airport {
  id: string;
  name: string;
  code: string; // IATA code
  city: string;
  country: string;
  timezone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface FlightStop {
  airport: Airport;
  duration: string; // Layover duration
  overnight: boolean;
}

export interface Price {
  amount: number;
  currency: string;
  breakdown: PriceBreakdown;
  taxes: Tax[];
  totalAmount: number;
}

export interface PriceBreakdown {
  baseFare: number;
  taxes: number;
  fees: number;
  discounts: number;
}

export interface Tax {
  code: string;
  name: string;
  amount: number;
}

export interface FlightAmenity {
  id: string;
  name: string;
  description?: string;
  isIncluded: boolean;
  additionalCost?: number;
}

export interface BaggageAllowance {
  carryOn: BaggagePolicy;
  checked: BaggagePolicy;
}

export interface BaggagePolicy {
  pieces: number;
  weight: number; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  additionalFee?: number;
}

export interface CancellationPolicy {
  isRefundable: boolean;
  cancellationFee?: number;
  refundableUntil?: string;
  changeFee?: number;
  changeableUntil?: string;
}

// Enums
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
export type FlightStatus = 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'arrived';
export type SortOption = 'price_asc' | 'price_desc' | 'duration_asc' | 'duration_desc' | 'departure_asc' | 'departure_desc';

// Search and filtering
export interface FlightSearchParams {
  origin: string; // Airport code
  destination: string; // Airport code
  departureDate: string; // ISO date
  returnDate?: string; // ISO date for round trip
  passengers: PassengerCounts;
  cabinClass: CabinClass;
  preferredAirlines?: string[];
  maxStops?: number;
  maxPrice?: number;
  departureTimeRange?: TimeRange;
  arrivalTimeRange?: TimeRange;
  directFlightsOnly?: boolean;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface FlightSearchFilters {
  airlines: string[];
  maxStops: number;
  priceRange: {
    min: number;
    max: number;
  };
  departureTimeRange: TimeRange;
  arrivalTimeRange: TimeRange;
  duration: {
    min: number; // in minutes
    max: number; // in minutes
  };
  amenities: string[];
}

export interface FlightSearchResult {
  flights: Flight[];
  totalCount: number;
  filters: {
    airlines: Airline[];
    priceRange: {
      min: number;
      max: number;
    };
    durationRange: {
      min: number;
      max: number;
    };
  };
  searchParams: FlightSearchParams;
}

// Booking
export interface FlightBooking {
  id: string;
  bookingReference: string;
  status: BookingStatus;
  flight: Flight;
  passengers: Passenger[];
  totalPrice: Price;
  paymentMethod: PaymentMethod;
  seats: SeatAssignment[];
  specialRequests: SpecialRequest[];
  contactInfo: ContactInfo;
  bookingDate: string;
  expiresAt: string;
  confirmationSent: boolean;
}

export interface Passenger {
  id: string;
  type: PassengerType;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
  issuingCountry?: string;
  frequentFlyerNumber?: string;
  specialAssistance?: SpecialAssistance[];
}

export interface SeatAssignment {
  passengerId: string;
  seatNumber: string;
  seatType: SeatType;
  additionalFee?: number;
}

export interface SpecialRequest {
  id: string;
  type: SpecialRequestType;
  description: string;
  additionalFee?: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: PaymentType;
  cardNumber?: string; // Masked
  expiryDate?: string;
  holderName?: string;
  billingAddress?: Address;
}

// More enums
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired' | 'checked_in';
export type PassengerType = 'adult' | 'child' | 'infant';
export type SeatType = 'standard' | 'extra_legroom' | 'window' | 'aisle' | 'premium';
export type SpecialRequestType = 'meal' | 'accessibility' | 'pet' | 'unaccompanied_minor' | 'other';
export type SpecialAssistance = 'wheelchair' | 'visual_impairment' | 'hearing_impairment' | 'other';
export type PaymentType = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'corporate_card';

// API responses
export interface FlightSearchResponse {
  success: boolean;
  data: FlightSearchResult;
  requestId: string;
  timestamp: string;
}

export interface FlightBookingResponse {
  success: boolean;
  data: FlightBooking;
  message?: string;
  timestamp: string;
}

// Error types specific to flights
export interface FlightError {
  code: FlightErrorCode;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

export type FlightErrorCode = 
  | 'FLIGHT_NOT_FOUND'
  | 'FLIGHT_UNAVAILABLE'
  | 'SEAT_UNAVAILABLE'
  | 'PRICE_CHANGED'
  | 'BOOKING_EXPIRED'
  | 'INVALID_PASSENGER_INFO'
  | 'PAYMENT_FAILED'
  | 'SEARCH_TIMEOUT'
  | 'AIRLINE_ERROR';

// UI State types
export interface FlightSearchState {
  isSearching: boolean;
  searchParams: FlightSearchParams | null;
  results: FlightSearchResult | null;
  selectedFlight: Flight | null;
  filters: FlightSearchFilters;
  sortBy: SortOption;
  error: FlightError | null;
}

export interface FlightBookingState {
  isBooking: boolean;
  currentBooking: FlightBooking | null;
  passengers: Passenger[];
  selectedSeats: SeatAssignment[];
  paymentMethod: PaymentMethod | null;
  specialRequests: SpecialRequest[];
  contactInfo: ContactInfo | null;
  step: BookingStep;
  error: FlightError | null;
}

export type BookingStep = 
  | 'flight_selection'
  | 'passenger_info'
  | 'seat_selection'
  | 'extras'
  | 'payment'
  | 'confirmation';