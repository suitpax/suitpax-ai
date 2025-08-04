import { Airline, AirlineListResponse } from './types';

const DUFFEL_API = 'https://api.duffel.com/air/airlines';
const DUFFEL_VERSION = 'v2';

function getAuthHeader() {
  if (!process.env.DUFFEL_ACCESS_TOKEN) throw new Error('No Duffel access token set');
  return `Bearer ${process.env.DUFFEL_ACCESS_TOKEN}`;
}

export async function fetchAirlineById(id: string): Promise<Airline> {
  const res = await fetch(`${DUFFEL_API}/${id}`, {
    headers: {
      'Authorization': getAuthHeader(),
      'Duffel-Version': DUFFEL_VERSION,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
    },
    method: 'GET',
  });
  if (!res.ok) throw new Error(`Failed to fetch airline (${id})`);
  const { data } = await res.json();
  return data;
}

export async function fetchAirlines(limit = 50, after?: string, before?: string): Promise<AirlineListResponse> {
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  if (after) params.append('after', after);
  if (before) params.append('before', before);

  const res = await fetch(`${DUFFEL_API}?${params.toString()}`, {
    headers: {
      'Authorization': getAuthHeader(),
      'Duffel-Version': DUFFEL_VERSION,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
    },
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch airlines');
  return await res.json();
}
