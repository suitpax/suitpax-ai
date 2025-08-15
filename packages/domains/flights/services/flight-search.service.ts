// Flight search service implementing Repository pattern
import { ApiClient } from '@/shared/types';
import { 
  FlightSearchParams, 
  FlightSearchResult, 
  FlightSearchResponse,
  Flight,
  FlightError,
  SortOption 
} from '../types';

export interface FlightSearchRepository {
  search(params: FlightSearchParams): Promise<FlightSearchResult>;
  getFlightById(id: string): Promise<Flight>;
  validateSearchParams(params: FlightSearchParams): Promise<boolean>;
}

export class FlightSearchService implements FlightSearchRepository {
  constructor(private apiClient: ApiClient) {}

  /**
   * Search for flights based on provided parameters
   */
  async search(params: FlightSearchParams): Promise<FlightSearchResult> {
    try {
      // Validate search parameters
      await this.validateSearchParams(params);

      // Transform params for API
      const apiParams = this.transformSearchParamsForAPI(params);

      // Make API request
      const response = await this.apiClient.post<FlightSearchResponse>(
        '/api/flights/search',
        apiParams
      );

      if (!response.success) {
        throw new Error(response.data?.message || 'Search failed');
      }

      // Transform and return results
      return this.transformSearchResults(response.data);
    } catch (error) {
      throw this.handleSearchError(error);
    }
  }

  /**
   * Get specific flight by ID
   */
  async getFlightById(id: string): Promise<Flight> {
    try {
      const response = await this.apiClient.get<{ success: boolean; data: Flight }>(
        `/api/flights/${id}`
      );

      if (!response.success) {
        throw new Error('Flight not found');
      }

      return response.data;
    } catch (error) {
      throw this.handleSearchError(error);
    }
  }

  /**
   * Validate search parameters before sending to API
   */
  async validateSearchParams(params: FlightSearchParams): Promise<boolean> {
    const errors: string[] = [];

    // Validate airport codes
    if (!params.origin || params.origin.length !== 3) {
      errors.push('Valid origin airport code is required');
    }

    if (!params.destination || params.destination.length !== 3) {
      errors.push('Valid destination airport code is required');
    }

    // Validate dates
    const departureDate = new Date(params.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departureDate < today) {
      errors.push('Departure date cannot be in the past');
    }

    // Validate return date if provided
    if (params.returnDate) {
      const returnDate = new Date(params.returnDate);
      if (returnDate < departureDate) {
        errors.push('Return date cannot be before departure date');
      }
    }

    // Validate passenger counts
    const { adults, children, infants } = params.passengers;
    if (adults < 1) {
      errors.push('At least one adult passenger is required');
    }

    if (adults + children + infants > 9) {
      errors.push('Maximum 9 passengers allowed');
    }

    if (infants > adults) {
      errors.push('Number of infants cannot exceed number of adults');
    }

    // Validate price range
    if (params.maxPrice && params.maxPrice < 0) {
      errors.push('Maximum price must be positive');
    }

    if (errors.length > 0) {
      throw new FlightError({
        code: 'INVALID_SEARCH_PARAMS',
        message: 'Invalid search parameters',
        details: { errors },
      });
    }

    return true;
  }

  /**
   * Sort flights by specified option
   */
  sortFlights(flights: Flight[], sortBy: SortOption): Flight[] {
    const sortedFlights = [...flights];

    switch (sortBy) {
      case 'price_asc':
        return sortedFlights.sort((a, b) => a.price.totalAmount - b.price.totalAmount);
      
      case 'price_desc':
        return sortedFlights.sort((a, b) => b.price.totalAmount - a.price.totalAmount);
      
      case 'duration_asc':
        return sortedFlights.sort((a, b) => this.parseDuration(a.duration) - this.parseDuration(b.duration));
      
      case 'duration_desc':
        return sortedFlights.sort((a, b) => this.parseDuration(b.duration) - this.parseDuration(a.duration));
      
      case 'departure_asc':
        return sortedFlights.sort((a, b) => 
          new Date(a.departure.scheduledTime).getTime() - new Date(b.departure.scheduledTime).getTime()
        );
      
      case 'departure_desc':
        return sortedFlights.sort((a, b) => 
          new Date(b.departure.scheduledTime).getTime() - new Date(a.departure.scheduledTime).getTime()
        );
      
      default:
        return sortedFlights;
    }
  }

  /**
   * Filter flights based on provided filters
   */
  filterFlights(flights: Flight[], filters: Partial<FlightSearchFilters>): Flight[] {
    return flights.filter(flight => {
      // Filter by airlines
      if (filters.airlines?.length && !filters.airlines.includes(flight.airline.code)) {
        return false;
      }

      // Filter by stops
      if (filters.maxStops !== undefined && flight.stops.length > filters.maxStops) {
        return false;
      }

      // Filter by price range
      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        if (flight.price.totalAmount < min || flight.price.totalAmount > max) {
          return false;
        }
      }

      // Filter by departure time
      if (filters.departureTimeRange) {
        const departureTime = new Date(flight.departure.scheduledTime);
        const timeStr = departureTime.toTimeString().substring(0, 5); // HH:mm
        
        if (timeStr < filters.departureTimeRange.start || timeStr > filters.departureTimeRange.end) {
          return false;
        }
      }

      // Filter by arrival time
      if (filters.arrivalTimeRange) {
        const arrivalTime = new Date(flight.arrival.scheduledTime);
        const timeStr = arrivalTime.toTimeString().substring(0, 5); // HH:mm
        
        if (timeStr < filters.arrivalTimeRange.start || timeStr > filters.arrivalTimeRange.end) {
          return false;
        }
      }

      // Filter by duration
      if (filters.duration) {
        const flightDurationMinutes = this.parseDuration(flight.duration);
        const { min, max } = filters.duration;
        
        if (flightDurationMinutes < min || flightDurationMinutes > max) {
          return false;
        }
      }

      // Filter by amenities
      if (filters.amenities?.length) {
        const flightAmenities = flight.amenities.map(a => a.id);
        const hasRequiredAmenities = filters.amenities.every(amenity => 
          flightAmenities.includes(amenity)
        );
        
        if (!hasRequiredAmenities) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(origin?: string): Promise<Airport[]> {
    try {
      const response = await this.apiClient.get<{ success: boolean; data: Airport[] }>(
        `/api/flights/popular-destinations${origin ? `?origin=${origin}` : ''}`
      );

      return response.data || [];
    } catch (error) {
      console.warn('Failed to fetch popular destinations:', error);
      return [];
    }
  }

  /**
   * Search airports by query
   */
  async searchAirports(query: string): Promise<Airport[]> {
    try {
      if (query.length < 2) return [];

      const response = await this.apiClient.get<{ success: boolean; data: Airport[] }>(
        `/api/flights/airports/search?q=${encodeURIComponent(query)}`
      );

      return response.data || [];
    } catch (error) {
      console.warn('Failed to search airports:', error);
      return [];
    }
  }

  // Private helper methods
  private transformSearchParamsForAPI(params: FlightSearchParams): Record<string, unknown> {
    return {
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departureDate,
      return_date: params.returnDate,
      passengers: params.passengers,
      cabin_class: params.cabinClass,
      preferred_airlines: params.preferredAirlines,
      max_stops: params.maxStops,
      max_price: params.maxPrice,
      departure_time_range: params.departureTimeRange,
      arrival_time_range: params.arrivalTimeRange,
      direct_flights_only: params.directFlightsOnly,
    };
  }

  private transformSearchResults(data: FlightSearchResult): FlightSearchResult {
    // Transform API response to match our domain types
    // Add any necessary data transformations here
    return {
      ...data,
      flights: data.flights.map(flight => ({
        ...flight,
        // Ensure dates are properly formatted
        departure: {
          ...flight.departure,
          scheduledTime: new Date(flight.departure.scheduledTime).toISOString(),
        },
        arrival: {
          ...flight.arrival,
          scheduledTime: new Date(flight.arrival.scheduledTime).toISOString(),
        },
      })),
    };
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration to minutes
    // Example: "PT2H30M" -> 150 minutes
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    
    return hours * 60 + minutes;
  }

  private handleSearchError(error: unknown): FlightError {
    if (error instanceof FlightError) {
      return error;
    }

    if (error instanceof Error) {
      return new FlightError({
        code: 'SEARCH_TIMEOUT',
        message: error.message,
      });
    }

    return new FlightError({
      code: 'SEARCH_TIMEOUT',
      message: 'An unexpected error occurred during search',
    });
  }
}

// FlightError class
class FlightError extends Error {
  code: string;
  details?: Record<string, unknown>;
  field?: string;

  constructor({ code, message, details, field }: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    field?: string;
  }) {
    super(message);
    this.name = 'FlightError';
    this.code = code;
    this.details = details;
    this.field = field;
  }
}

// Export factory function for dependency injection
export const createFlightSearchService = (apiClient: ApiClient): FlightSearchService => {
  return new FlightSearchService(apiClient);
};