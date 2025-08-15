// Duffel Repository - Clean Architecture Pattern
import { 
  FlightSearchParams, 
  FlightSearchResult, 
  FlightBooking, 
  Flight, 
  Airport,
  Airline,
  FlightError,
  DuffelOfferRequest,
  PassengerCounts,
  Passenger,
  SeatMap
} from '../types';
import { DuffelClient } from './duffel.client';
import { DuffelMapper } from '../mappers/duffel.mapper';
import { FlightValidator } from '../validators/flight.validator';

export interface FlightRepository {
  searchFlights(params: FlightSearchParams): Promise<FlightSearchResult>;
  getFlightOffer(offerId: string): Promise<Flight>;
  bookFlight(offerId: string, passengers: Passenger[], contactInfo: any): Promise<FlightBooking>;
  getBooking(bookingId: string): Promise<FlightBooking>;
  cancelBooking(bookingId: string): Promise<boolean>;
  getAirports(query?: string): Promise<Airport[]>;
  getAirlines(): Promise<Airline[]>;
  getSeatMap(offerId: string): Promise<SeatMap[]>;
}

export class DuffelRepository implements FlightRepository {
  private client: DuffelClient;
  private mapper: DuffelMapper;
  private validator: FlightValidator;

  constructor(
    client: DuffelClient,
    mapper: DuffelMapper,
    validator: FlightValidator
  ) {
    this.client = client;
    this.mapper = mapper;
    this.validator = validator;
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
    try {
      // Validate search parameters
      const validation = this.validator.validateSearchParams(params);
      if (!validation.isValid) {
        throw new FlightError({
          code: 'INVALID_SEARCH_PARAMS',
          message: 'Invalid search parameters',
          details: validation.errors
        });
      }

      // Transform to Duffel format
      const duffelRequest = this.mapper.mapSearchParamsToDuffel(params);
      
      // Make API call
      const duffelResponse = await this.client.createOfferRequest(duffelRequest);
      
      // Transform response back to domain format
      const result = this.mapper.mapDuffelOffersToFlights(duffelResponse);

      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFlightOffer(offerId: string): Promise<Flight> {
    try {
      const duffelOffer = await this.client.getOffer(offerId);
      return this.mapper.mapDuffelOfferToFlight(duffelOffer);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bookFlight(
    offerId: string, 
    passengers: Passenger[], 
    contactInfo: any
  ): Promise<FlightBooking> {
    try {
      // Validate passengers
      const passengerValidation = this.validator.validatePassengers(passengers);
      if (!passengerValidation.isValid) {
        throw new FlightError({
          code: 'INVALID_PASSENGER_INFO',
          message: 'Invalid passenger information',
          details: passengerValidation.errors
        });
      }

      // Transform passengers to Duffel format
      const duffelPassengers = this.mapper.mapPassengersToDuffel(passengers);
      
      // Create order
      const duffelOrder = await this.client.createOrder({
        selectedOffers: [offerId],
        passengers: duffelPassengers,
        ...contactInfo
      });

      // Transform back to domain format
      return this.mapper.mapDuffelOrderToBooking(duffelOrder);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBooking(bookingId: string): Promise<FlightBooking> {
    try {
      const duffelOrder = await this.client.getOrder(bookingId);
      return this.mapper.mapDuffelOrderToBooking(duffelOrder);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      await this.client.cancelOrder(bookingId);
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAirports(query?: string): Promise<Airport[]> {
    try {
      const duffelAirports = await this.client.getAirports(query);
      return this.mapper.mapDuffelAirportsToAirports(duffelAirports);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAirlines(): Promise<Airline[]> {
    try {
      const duffelAirlines = await this.client.getAirlines();
      return this.mapper.mapDuffelAirlinesToAirlines(duffelAirlines);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSeatMap(offerId: string): Promise<SeatMap[]> {
    try {
      const duffelSeatMaps = await this.client.getSeatMaps(offerId);
      return this.mapper.mapDuffelSeatMapsToSeatMaps(duffelSeatMaps);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Additional Duffel-specific methods
  async getOfferAvailableServices(offerId: string) {
    try {
      return await this.client.getOfferAvailableServices(offerId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrder(orderId: string, updates: any) {
    try {
      return await this.client.updateOrder(orderId, updates);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderServices(orderId: string) {
    try {
      return await this.client.getOrderServices(orderId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createOrderServices(orderId: string, services: any[]) {
    try {
      return await this.client.createOrderServices(orderId, services);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Webhooks and events
  async processWebhook(payload: any, signature: string): Promise<void> {
    try {
      const isValid = this.client.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        throw new FlightError({
          code: 'UNAUTHORIZED',
          message: 'Invalid webhook signature'
        });
      }

      // Process webhook based on event type
      switch (payload.data.type) {
        case 'order.updated':
          await this.handleOrderUpdate(payload.data);
          break;
        case 'order.cancelled':
          await this.handleOrderCancellation(payload.data);
          break;
        case 'flight.delayed':
          await this.handleFlightDelay(payload.data);
          break;
        case 'flight.cancelled':
          await this.handleFlightCancellation(payload.data);
          break;
        default:
          console.warn('Unknown webhook event type:', payload.data.type);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async handleOrderUpdate(data: any): Promise<void> {
    // Handle order update logic
    console.log('Processing order update:', data);
  }

  private async handleOrderCancellation(data: any): Promise<void> {
    // Handle order cancellation logic
    console.log('Processing order cancellation:', data);
  }

  private async handleFlightDelay(data: any): Promise<void> {
    // Handle flight delay logic
    console.log('Processing flight delay:', data);
  }

  private async handleFlightCancellation(data: any): Promise<void> {
    // Handle flight cancellation logic
    console.log('Processing flight cancellation:', data);
  }

  private handleError(error: any): FlightError {
    if (error instanceof FlightError) {
      return error;
    }

    // Duffel API errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return new FlightError({
            code: 'VALIDATION_ERROR',
            message: data.message || 'Bad request',
            details: data.errors
          });
        case 401:
          return new FlightError({
            code: 'UNAUTHORIZED',
            message: 'Authentication failed'
          });
        case 404:
          return new FlightError({
            code: 'NO_FLIGHTS_FOUND',
            message: 'Resource not found'
          });
        case 409:
          return new FlightError({
            code: 'OFFER_UNAVAILABLE',
            message: 'Offer no longer available'
          });
        case 422:
          return new FlightError({
            code: 'BOOKING_FAILED',
            message: 'Booking could not be processed',
            details: data.errors
          });
        case 429:
          return new FlightError({
            code: 'RATE_LIMITED',
            message: 'Too many requests'
          });
        default:
          return new FlightError({
            code: 'SERVER_ERROR',
            message: 'Server error occurred'
          });
      }
    }

    // Network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
      return new FlightError({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed'
      });
    }

    // Generic error
    return new FlightError({
      code: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred'
    });
  }
}

// FlightError class
export class FlightError extends Error {
  code: string;
  details?: any;

  constructor({ code, message, details }: {
    code: string;
    message: string;
    details?: any;
  }) {
    super(message);
    this.name = 'FlightError';
    this.code = code;
    this.details = details;
  }
}