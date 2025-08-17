import { getDuffelClient } from '@/lib/duffel'
import type { Airport, ListAirportsParams, ListAirportsResponse } from './types'

export const AirportsResource = {
  async get(id: string): Promise<Airport> {
    const duffel = getDuffelClient() as any
    const res = await duffel.airports.get(id)
    return (res?.data || res) as Airport
  },

  async list(params: ListAirportsParams = {}): Promise<ListAirportsResponse> {
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
    if (params.iata_code) p.iata_code = params.iata_code
    if (params.name) p.name = params.name

    const res = await duffel.airports.list(p)
    const data: Airport[] = (res?.data || res?.airports || []) as Airport[]
    return { data, meta: res?.meta }
  },
}