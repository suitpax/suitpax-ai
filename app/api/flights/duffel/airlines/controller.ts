import { fetchAirlines, fetchAirlineById } from './service';

export async function getAirlinesHandler(params: { limit?: number; after?: string; before?: string }) {
  return await fetchAirlines(params.limit, params.after, params.before);
}

export async function getAirlineByIdHandler(params: { id: string }) {
  return await fetchAirlineById(params.id);
}
