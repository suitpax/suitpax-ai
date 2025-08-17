import { getDuffelClient } from '@/lib/duffel';

export async function fetchAirports(limit?: number, after?: string, before?: string) {
  const duffel = getDuffelClient();
  const params: Record<string, string | number> = {};
  if (typeof limit === 'number') params.limit = limit;
  if (after) params.after = after;
  if (before) params.before = before;

  return await duffel.airports.list(params);
}

export async function fetchAirportById(id: string) {
  const duffel = getDuffelClient();
  return await duffel.airports.get(id);
}