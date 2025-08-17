import { getDuffelClient } from '@/lib/duffel';

export async function fetchAirlines(limit?: number, after?: string, before?: string) {
  const duffel = getDuffelClient();
  const params: Record<string, string | number> = {};
  if (typeof limit === 'number') params.limit = limit;
  if (after) params.after = after;
  if (before) params.before = before;

  return await duffel.airlines.list(params);
}

export async function fetchAirlineById(id: string) {
  const duffel = getDuffelClient();
  return await duffel.airlines.get(id);
}