// Flight Service - Application Layer
import {
  FlightSearchParams,
  FlightSearchResult,
  FlightBooking,
  Flight,
  Airport,
  Airline,
  Passenger,
  SeatMap,
  FlightError
} from '../types';
import { FlightRepository } from '../repositories/duffel.repository';
import { FlightCacheService } from './flight-cache.service';
import { FlightAnalyticsService } from './flight-analytics.service';

export interface IFlightService {
  searchFlights(params: FlightSearchParams): Promise<FlightSearchResult>;
  getFlight(offerId: string): Promise<Flight>;
  bookFlight(offerId: string, passengers: Passenger[], contactInfo: any): Promise<FlightBooking>;
  getBooking(bookingId: string): Promise<FlightBooking>;
  cancelBooking(bookingId: string, reason?: string): Promise<boolean>;
  getAirports(query?: string): Promise<Airport[]>;
  getPopularDestinations(origin?: string): Promise<Airport[]>;
  getAirlines(): Promise<Airline[]>;
  getSeatMap(offerId: string): Promise<SeatMap[]>;
  trackPrices(params: FlightSearchParams): Promise<void>;
  getFlightStatus(flightNumber: string, date: string): Promise<any>;
}

export class FlightService implements IFlightService {
  private repository: FlightRepository;
  private cacheService: FlightCacheService;
  private analyticsService: FlightAnalyticsService;

  constructor(
    repository: FlightRepository,
    cacheService: FlightCacheService,
    analyticsService: FlightAnalyticsService
  ) {
    this.repository = repository;
    this.cacheService = cacheService;
    this.analyticsService = analyticsService;
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey('search', params);
      const cachedResult = await this.cacheService.get(cacheKey);
      
      if (cachedResult) {
        // Track cache hit
        this.analyticsService.trackSearchEvent('cache_hit', params);
        return cachedResult;
      }

      // Search flights
      const result = await this.repository.searchFlights(params);

      // Cache results for 15 minutes
      await this.cacheService.set(cacheKey, result, 15 * 60);

      // Track search
      this.analyticsService.trackSearchEvent('api_call', params, {
        resultsCount: result.flights.length,
        searchDuration: Date.now() - performance.now()
      });

      // Apply business logic
      return this.enhanceSearchResults(result, params);
    } catch (error) {
      this.analyticsService.trackError('search_flights', error);
      throw error;
    }
  }

  async getFlight(offerId: string): Promise<Flight> {
    try {
      // Check cache
      const cacheKey = this.generateCacheKey('offer', { offerId });
      const cachedFlight = await this.cacheService.get(cacheKey);
      
      if (cachedFlight) {
        return cachedFlight;
      }

      const flight = await this.repository.getFlightOffer(offerId);
      
      // Cache for 5 minutes (offers expire quickly)
      await this.cacheService.set(cacheKey, flight, 5 * 60);

      return flight;
    } catch (error) {
      this.analyticsService.trackError('get_flight', error);
      throw error;
    }
  }

  async bookFlight(
    offerId: string, 
    passengers: Passenger[], 
    contactInfo: any
  ): Promise<FlightBooking> {
    try {
      // Get fresh flight data
      const flight = await this.getFlight(offerId);
      
      // Check if offer is still valid
      if (new Date(flight.expiresAt) < new Date()) {
        throw new FlightError({
          code: 'OFFER_EXPIRED',
          message: 'This flight offer has expired'
        });
      }

      // Create booking
      const booking = await this.repository.bookFlight(offerId, passengers, contactInfo);

      // Track booking
      this.analyticsService.trackBookingEvent('booking_created', {
        offerId,
        bookingId: booking.id,
        totalPrice: booking.totalPrice.totalAmount,
        passengerCount: passengers.length
      });

      // Send confirmation email (async)
      this.sendBookingConfirmation(booking).catch(console.error);

      return booking;
    } catch (error) {
      this.analyticsService.trackError('book_flight', error);
      throw error;
    }
  }

  async getBooking(bookingId: string): Promise<FlightBooking> {
    try {
      return await this.repository.getBooking(bookingId);
    } catch (error) {
      this.analyticsService.trackError('get_booking', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    try {
      const success = await this.repository.cancelBooking(bookingId);
      
      if (success) {
        this.analyticsService.trackBookingEvent('booking_cancelled', {
          bookingId,
          reason
        });
      }

      return success;
    } catch (error) {
      this.analyticsService.trackError('cancel_booking', error);
      throw error;
    }
  }

  async getAirports(query?: string): Promise<Airport[]> {
    try {
      const cacheKey = this.generateCacheKey('airports', { query });
      const cached = await this.cacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const airports = await this.repository.getAirports(query);
      
      // Cache for 1 hour
      await this.cacheService.set(cacheKey, airports, 60 * 60);

      return airports;
    } catch (error) {
      this.analyticsService.trackError('get_airports', error);
      throw error;
    }
  }

  async getPopularDestinations(origin?: string): Promise<Airport[]> {
    try {
      const cacheKey = this.generateCacheKey('popular_destinations', { origin });
      const cached = await this.cacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      // Get popular destinations based on booking data
      const destinations = await this.analyticsService.getPopularDestinations(origin);
      
      // Cache for 24 hours
      await this.cacheService.set(cacheKey, destinations, 24 * 60 * 60);

      return destinations;
    } catch (error) {
      this.analyticsService.trackError('get_popular_destinations', error);
      throw error;
    }
  }

  async getAirlines(): Promise<Airline[]> {
    try {
      const cacheKey = this.generateCacheKey('airlines', {});
      const cached = await this.cacheService.get(cacheKey);
      
      if (cached) {
        return cached;
      }

      const airlines = await this.repository.getAirlines();
      
      // Cache for 24 hours
      await this.cacheService.set(cacheKey, airlines, 24 * 60 * 60);

      return airlines;
    } catch (error) {
      this.analyticsService.trackError('get_airlines', error);
      throw error;
    }
  }

  async getSeatMap(offerId: string): Promise<SeatMap[]> {
    try {
      return await this.repository.getSeatMap(offerId);
    } catch (error) {
      this.analyticsService.trackError('get_seat_map', error);
      throw error;
    }
  }

  async trackPrices(params: FlightSearchParams): Promise<void> {
    try {
      // Store price tracking request
      await this.analyticsService.createPriceAlert(params);
    } catch (error) {
      this.analyticsService.trackError('track_prices', error);
      throw error;
    }
  }

  async getFlightStatus(flightNumber: string, date: string): Promise<any> {
    try {
      // This would integrate with flight status APIs
      // For now, return placeholder
      return {
        flightNumber,
        date,
        status: 'on_time',
        departure: {
          scheduled: date,
          estimated: date,
          actual: null
        },
        arrival: {
          scheduled: date,
          estimated: date,
          actual: null
        }
      };
    } catch (error) {
      this.analyticsService.trackError('get_flight_status', error);
      throw error;
    }
  }

  // Private helper methods
  private enhanceSearchResults(
    result: FlightSearchResult, 
    params: FlightSearchParams
  ): FlightSearchResult {
    // Add business logic like:
    // - Marking preferred airlines
    // - Adding corporate discounts
    // - Filtering based on company policies
    // - Adding recommendations

    const enhancedFlights = result.flights.map(flight => ({
      ...flight,
      // Add business-specific enhancements
      isPreferred: this.isPreferredFlight(flight),
      corporateDiscount: this.calculateCorporateDiscount(flight),
      policyCompliant: this.checkPolicyCompliance(flight, params),
      recommendation: this.generateRecommendation(flight)
    }));

    return {
      ...result,
      flights: enhancedFlights
    };
  }

  private isPreferredFlight(flight: Flight): boolean {
    // Check if airline is in preferred list
    const preferredAirlines = ['AA', 'UA', 'DL']; // Example
    return preferredAirlines.includes(flight.airline.iataCode);
  }

  private calculateCorporateDiscount(flight: Flight): number {
    // Calculate corporate discount if applicable
    return 0; // Placeholder
  }

  private checkPolicyCompliance(flight: Flight, params: FlightSearchParams): boolean {
    // Check against company travel policy
    return true; // Placeholder
  }

  private generateRecommendation(flight: Flight): string | null {
    // Generate smart recommendations
    if (flight.stops === 0) {
      return 'Direct flight - saves time';
    }
    if (flight.price.totalAmount < 300) {
      return 'Great value option';
    }
    return null;
  }

  private generateCacheKey(type: string, params: any): string {
    return `flight_${type}_${JSON.stringify(params)}`;
  }

  private async sendBookingConfirmation(booking: FlightBooking): Promise<void> {
    // Send booking confirmation email
    console.log('Sending booking confirmation for:', booking.id);
  }
}

// Factory function for dependency injection
export function createFlightService(
  repository: FlightRepository,
  cacheService: FlightCacheService,
  analyticsService: FlightAnalyticsService
): FlightService {
  return new FlightService(repository, cacheService, analyticsService);
}