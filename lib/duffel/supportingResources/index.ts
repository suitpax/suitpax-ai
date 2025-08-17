import { getDuffelClient } from '@/lib/duffel'
import { AircraftResource } from './Aircraft'
import { AirlinesResource } from './Airlines'

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
    const res = await duffel.airports.list(p)
    const data = (res?.data || res?.airports || []) as any[]
    return { data, meta: res?.meta }
  },
  async get(id: string) {
    const duffel = getDuffelClient() as any
    const res = await duffel.airports.get(id)
    return res?.data || res
  },
}

export const airlines = AirlinesResource

export const aircraft = AircraftResource

export const supportingResources = { airports, airlines, aircraft }