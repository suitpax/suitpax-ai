// Flight Domain - Barrel Export
// Clean exports for the flight domain following Domain Driven Design

// Types
export * from './types';

// Services (Application Layer)
export { FlightService, createFlightService, type IFlightService } from './services/flight.service';

// Repositories (Infrastructure Layer) 
export { DuffelRepository, FlightError, type FlightRepository } from './repositories/duffel.repository';

// Validators
// export { FlightValidator } from './validators/flight.validator';

// Mappers  
// export { DuffelMapper } from './mappers/duffel.mapper';

// Additional Services
// export { FlightCacheService } from './services/flight-cache.service';
// export { FlightAnalyticsService } from './services/flight-analytics.service';

// Re-export commonly used types for convenience
export type {
  Flight,
  FlightSearchParams,
  FlightSearchResult,
  FlightBooking,
  Airport,
  Airline,
  Passenger,
  SeatMap
} from './types';