// Analytics Service Factory
// Infrastructure layer factory for analytics and tracking

export interface AnalyticsService {
  trackSearchEvent(type: string, params: any, metadata?: any): void;
  trackBookingEvent(type: string, data: any): void;
  trackError(operation: string, error: any): void;
  getPopularDestinations(origin?: string): Promise<any[]>;
  createPriceAlert(params: any): Promise<void>;
}

class ConsoleAnalyticsService implements AnalyticsService {
  trackSearchEvent(type: string, params: any, metadata?: any): void {
    console.log(`[ANALYTICS] Search Event: ${type}`, { params, metadata });
  }

  trackBookingEvent(type: string, data: any): void {
    console.log(`[ANALYTICS] Booking Event: ${type}`, data);
  }

  trackError(operation: string, error: any): void {
    console.error(`[ANALYTICS] Error in ${operation}:`, error);
  }

  async getPopularDestinations(origin?: string): Promise<any[]> {
    // Mock popular destinations
    return [
      { iataCode: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA' },
      { iataCode: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA' },
      { iataCode: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
    ];
  }

  async createPriceAlert(params: any): Promise<void> {
    console.log('[ANALYTICS] Price alert created:', params);
  }
}

class ProductionAnalyticsService implements AnalyticsService {
  // Would integrate with services like Segment, Mixpanel, etc.
  private consoleService = new ConsoleAnalyticsService();

  trackSearchEvent(type: string, params: any, metadata?: any): void {
    // Send to actual analytics service
    this.consoleService.trackSearchEvent(type, params, metadata);
  }

  trackBookingEvent(type: string, data: any): void {
    // Send to actual analytics service
    this.consoleService.trackBookingEvent(type, data);
  }

  trackError(operation: string, error: any): void {
    // Send to error tracking service (Sentry, etc.)
    this.consoleService.trackError(operation, error);
  }

  async getPopularDestinations(origin?: string): Promise<any[]> {
    // Query actual analytics database
    return this.consoleService.getPopularDestinations(origin);
  }

  async createPriceAlert(params: any): Promise<void> {
    // Store in database for price tracking
    return this.consoleService.createPriceAlert(params);
  }
}

export function createAnalyticsService(): AnalyticsService {
  if (process.env.NODE_ENV === 'production') {
    return new ProductionAnalyticsService();
  } else {
    return new ConsoleAnalyticsService();
  }
}