import { airports } from '@/lib/duffel/supportingResources'

export async function fetchAirports(limit?: number, after?: string, before?: string, query?: string) {
  return await airports.list({ limit, after, before, query })
}

export async function fetchAirportById(id: string) {
  return await airports.get(id)
}