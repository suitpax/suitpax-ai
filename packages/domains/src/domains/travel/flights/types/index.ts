// Enhanced Flight Domain Types with Duffel Integration

// Core entities
export interface Flight {
  id: string;
  offerId: string;
  origin: Airport;
  destination: Airport;
  departure: FlightDateTime;
  arrival: FlightDateTime;
  duration: string;
  airline: Airline;
  aircraft: Aircraft;
  price: Price;
  cabinClass: CabinClass;
  segments: FlightSegment[];
  baggage: BaggageAllowance;
  conditions: FlightConditions;
  stops: number;
  isRefundable: boolean;
  expiresAt: string;
  passengerCount: PassengerCounts;
}

export interface Airport {
  id: string;
  iataCode: string;
  icaoCode?: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  coordinates: Coordinates;
  terminals?: Terminal[];
}

export interface Terminal {
  id: string;
  name: string;
  code?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FlightDateTime {
  scheduledTime: string;
  estimatedTime?: string;
  actualTime?: string;
  terminal?: string;
  gate?: string;
  status: FlightStatus;
}

export interface Airline {
  id: string;
  iataCode: string;
  icaoCode?: string;
  name: string;
  logo?: string;
  conditions?: AirlineConditions;
}

export interface Aircraft {
  id: string;
  name: string;
  iataCode?: string;
  passengerCapacity?: PassengerCapacity;
}

export interface PassengerCapacity {
  total?: number;
  cabins?: Array<{
    class: CabinClass;
    capacity: number;
  }>;
}

export interface FlightSegment {
  id: string;
  origin: Airport;
  destination: Airport;
  departure: FlightDateTime;
  arrival: FlightDateTime;
  marketingCarrier: Airline;
  operatingCarrier: Airline;
  aircraft: Aircraft;
  duration: string;
  distance?: number;
  flightNumber: string;
  stops?: Airport[];
}

export interface Price {
  amount: number;
  currency: string;
  breakdown: PriceBreakdown;
  taxes: Tax[];
  totalAmount: number;
  baseAmount: number;
}

export interface PriceBreakdown {
  baseFare: number;
  taxes: number;
  fees: number;
  discounts: number;
  markup?: number;
}

export interface Tax {
  amount: number;
  currency: string;
  code: string;
  name: string;
}

export interface BaggageAllowance {
  carryOn?: Baggage;
  checked?: Baggage[];
}

export interface Baggage {
  type: 'carry_on' | 'checked';
  quantity: number;
  weight?: Weight;
  dimensions?: Dimensions;
}

export interface Weight {
  value: number;
  unit: 'kg' | 'lb';
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface FlightConditions {
  refundable: boolean;
  changeAllowed: boolean;
  changeFee?: Price;
  cancellationFee?: Price;
  refundableUntil?: string;
  changeableUntil?: string;
  advancePurchaseRequired?: boolean;
  minimumStay?: string;
  maximumStay?: string;
}

export interface AirlineConditions {
  carryOnAllowed: boolean;
  changeAllowed: boolean;
  refundAllowed: boolean;
  advanceSeatSelection: boolean;
}

// Booking related types
export interface FlightBooking {
  id: string;
  orderId: string;
  bookingReference: string;
  status: BookingStatus;
  passengers: Passenger[];
  flight: Flight;
  seats?: SeatAssignment[];
  services?: BookingService[];
  totalPrice: Price;
  paymentMethod: PaymentMethod;
  contactInfo: ContactInfo;
  bookingDate: string;
  tickets?: Ticket[];
  documents?: Document[];
}

export interface Passenger {
  id: string;
  type: PassengerType;
  title: string;
  givenName: string;
  familyName: string;
  gender?: Gender;
  bornOn: string;
  email?: string;
  phoneNumber?: string;
  passport?: PassportInfo;
  loyaltyProgrammes?: LoyaltyProgram[];
  frequentFlyerNumber?: string;
  knownTravelerNumber?: string;
  redressNumber?: string;
}

export interface PassportInfo {
  number: string;
  issuingCountry: string;
  expiryDate: string;
}

export interface LoyaltyProgram {
  airlineIataCode: string;
  accountNumber: string;
}

export interface SeatAssignment {
  passengerId: string;
  segmentId: string;
  seatNumber: string;
  seatMap?: SeatMap;
}

export interface SeatMap {
  cabinClass: CabinClass;
  rows: SeatRow[];
}

export interface SeatRow {
  number: string;
  seats: Seat[];
}

export interface Seat {
  number: string;
  available: boolean;
  type: SeatType;
  price?: Price;
  features?: SeatFeature[];
}

export interface BookingService {
  id: string;
  type: ServiceType;
  quantity: number;
  price: Price;
  segmentIds?: string[];
}

export interface Ticket {
  id: string;
  passengerId: string;
  ticketNumber: string;
  status: TicketStatus;
  segments: TicketSegment[];
}

export interface TicketSegment {
  id: string;
  origin: string;
  destination: string;
  departure: string;
  flightNumber: string;
  seatNumber?: string;
  fareBasis: string;
  ticketDesignator?: string;
}

export interface Document {
  type: DocumentType;
  url: string;
  fileName?: string;
}

export interface ContactInfo {
  email: string;
  phoneNumber: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

export interface PaymentMethod {
  type: PaymentType;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Search and filtering
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCounts;
  cabinClass?: CabinClass;
  currency?: string;
  locale?: string;
  suppliers?: string[];
  maxConnections?: number;
  sortBy?: SortOption;
  filters?: FlightFilters;
}

export interface PassengerCounts {
  adults: number;
  children?: number;
  infantsWithoutSeat?: number;
  infantsWithSeat?: number;
}

export interface FlightFilters {
  airlines?: string[];
  maxStops?: number;
  departureTimeRange?: TimeRange;
  arrivalTimeRange?: TimeRange;
  duration?: DurationRange;
  price?: PriceRange;
  airports?: string[];
  amenities?: string[];
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface DurationRange {
  min: number; // minutes
  max: number; // minutes
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface FlightSearchResult {
  flights: Flight[];
  searchId: string;
  totalCount: number;
  filters: AvailableFilters;
  sort: SortOption;
  currency: string;
  suppliers: string[];
}

export interface AvailableFilters {
  airlines: Airline[];
  airports: Airport[];
  priceRange: PriceRange;
  durationRange: DurationRange;
  stops: number[];
}

// Enums and types
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
export type FlightStatus = 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'arrived' | 'diverted';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired' | 'failed';
export type PassengerType = 'adult' | 'child' | 'infant_without_seat' | 'infant_with_seat';
export type Gender = 'male' | 'female';
export type SortOption = 'price_asc' | 'price_desc' | 'duration_asc' | 'duration_desc' | 'departure_asc' | 'departure_desc' | 'arrival_asc' | 'arrival_desc' | 'stops_asc';
export type SeatType = 'standard' | 'extra_legroom' | 'window' | 'aisle' | 'bassinet' | 'exit_row' | 'premium';
export type SeatFeature = 'extra_legroom' | 'window' | 'aisle' | 'bassinet' | 'exit_row' | 'premium' | 'near_toilet' | 'power_outlet' | 'wifi';
export type ServiceType = 'baggage' | 'seat' | 'meal' | 'fast_track' | 'lounge' | 'priority_boarding' | 'wifi' | 'entertainment';
export type TicketStatus = 'valid' | 'used' | 'refunded' | 'exchanged' | 'cancelled';
export type DocumentType = 'eticket' | 'receipt' | 'invoice' | 'boarding_pass' | 'itinerary';
export type PaymentType = 'card' | 'bank_transfer' | 'balance' | 'points';

// API Response types
export interface FlightSearchResponse {
  success: boolean;
  data: FlightSearchResult;
  requestId: string;
  timestamp: string;
  errors?: FlightError[];
}

export interface FlightBookingResponse {
  success: boolean;
  data: FlightBooking;
  message?: string;
  timestamp: string;
  errors?: FlightError[];
}

export interface FlightError {
  code: FlightErrorCode;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export type FlightErrorCode = 
  | 'INVALID_SEARCH_PARAMS'
  | 'NO_FLIGHTS_FOUND'
  | 'OFFER_EXPIRED'
  | 'OFFER_UNAVAILABLE'
  | 'BOOKING_FAILED'
  | 'PAYMENT_FAILED'
  | 'INVALID_PASSENGER_INFO'
  | 'SEAT_UNAVAILABLE'
  | 'AIRLINE_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR';

// Duffel-specific types
export interface DuffelOfferRequest {
  slices: DuffelSlice[];
  passengers: DuffelPassenger[];
  cabinClass?: CabinClass;
  returnOffers?: boolean;
  maxConnections?: number;
  suppliers?: string[];
}

export interface DuffelSlice {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime?: {
    from?: string;
    to?: string;
  };
  arrivalTime?: {
    from?: string;
    to?: string;
  };
}

export interface DuffelPassenger {
  type: PassengerType;
  age?: number;
  loyaltyProgrammes?: Array<{
    airlineIataCode: string;
    accountNumber: string;
  }>;
}