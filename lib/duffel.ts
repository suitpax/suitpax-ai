export async function retrieveOffer(offerId: string) {
  const res = await fetch(`/api/flights/duffel/offers/${offerId}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'Failed to load offer')
  return json?.data || json
}

export async function retrieveSeatMaps(offerId: string) {
  const url = `/api/flights/duffel/seat-maps?offer_id=${encodeURIComponent(offerId)}`
  const res = await fetch(url)
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'Failed to load seat maps')
  return json?.data || json
}

import { Duffel } from '@duffel/api';

let cachedDuffelClient: Duffel | null = null;

export function getDuffelClient(): Duffel {
  if (cachedDuffelClient) return cachedDuffelClient;

  const token = process.env.DUFFEL_API_KEY || '';
  if (!token) {
    throw new Error('Missing DUFFEL_API_KEY environment variable');
  }

  cachedDuffelClient = new Duffel({ token, apiVersion: 'v2' } as any);
  return cachedDuffelClient;
}