import { Duffel } from '@duffel/api';

let cachedDuffelClient: Duffel | null = null;

export function getDuffelClient(): Duffel {
  if (cachedDuffelClient) return cachedDuffelClient;

  const token = process.env.DUFFEL_API_KEY || '';
  if (!token) {
    throw new Error('Missing DUFFEL_API_KEY environment variable');
  }

  cachedDuffelClient = new Duffel({ token });
  return cachedDuffelClient;
}