import { fetchAirports, fetchAirportById } from './service';

export async function getAirportsHandler(params: { limit?: number; after?: string; before?: string; query?: string }) {
  return await fetchAirports(params.limit, params.after, params.before, params.query);
}

export async function getAirportByIdHandler(params: { id: string }) {
  return await fetchAirportById(params.id);
}