import { getDuffelClient } from '@/lib/duffel'
import { AircraftResource } from './Aircraft'

export const airports = {
  async list(params: { limit?: number; after?: string; before?: string; query?: string } = {}) {
    const duffel = getDuffelClient() as any
    const p: any = {}
    if (typeof params.limit === 'number') p.limit = params.limit
    if (params.after) p.after = params.after
    if (params.before) p.before = params.before
    if (params.query) {
      const q = params.query.trim()
      if (q.length === 3) p.iata_code = q.toUpperCase()
      else p.name = q
    }
    return duffel.airports.list(p)
  },
  async get(id: string) {
    const duffel = getDuffelClient() as any
    return duffel.airports.get(id)
  },
}

export const airlines = {
  async list(params: Record<string, any> = {}) {
    const duffel = getDuffelClient() as any
    return duffel.airlines.list(params)
  },
  async get(id: string) {
    const duffel = getDuffelClient() as any
    return duffel.airlines.get(id)
  },
}

export const aircraft = AircraftResource

export const supportingResources = { airports, airlines, aircraft }