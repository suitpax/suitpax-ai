import { getDuffelClient } from '@/lib/duffel';

export async function fetchAirports(limit?: number, after?: string, before?: string, query?: string) {
  const duffel = getDuffelClient();
  const params: Record<string, string | number> = {};
  if (typeof limit === 'number') params.limit = limit;
  if (after) params.after = after;
  if (before) params.before = before;
  if (query) {
    if (query.trim().length === 3) {
      params.iata_code = query.trim().toUpperCase();
    } else {
      params.name = query.trim();
    }
  }

  return await duffel.airports.list(params as any);
}

export async function fetchAirportById(id: string) {
  const duffel = getDuffelClient();
  return await duffel.airports.get(id);
}