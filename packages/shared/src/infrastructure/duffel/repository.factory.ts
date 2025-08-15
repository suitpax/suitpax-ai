// Duffel Repository Factory
// Infrastructure layer factory for dependency injection

import { DuffelRepository } from '@/domains/travel/flights';
import { DuffelClient } from '@/lib/duffel/client';
import { DuffelMapper } from './duffel.mapper';
import { FlightValidator } from './flight.validator';

export function createDuffelRepository(): DuffelRepository {
  // Create Duffel client with environment configuration
  const client = new DuffelClient({
    token: process.env.DUFFEL_API_KEY!,
    environment: (process.env.DUFFEL_ENVIRONMENT as "test" | "production") || "test",
    apiVersion: "v2"
  });

  // Create mapper for data transformation
  const mapper = new DuffelMapper();

  // Create validator for input validation
  const validator = new FlightValidator();

  // Return configured repository
  return new DuffelRepository(client, mapper, validator);
}