import { getDuffelClient } from '@/lib/duffel'
import type { Airline, ListAirlinesParams, ListAirlinesResponse } from './types'

export const AirlinesResource = {
  async get(id: string): Promise<Airline> {
    const duffel = getDuffelClient() as any
    const res = await duffel.airlines.get(id)
    return (res?.data || res) as Airline
  },

  async list(params: ListAirlinesParams = {}): Promise<ListAirlinesResponse> {
    const duffel = getDuffelClient() as any
    const res = await duffel.airlines.list(params)
    const data: Airline[] = (res?.data || res?.airlines || []) as Airline[]
    return { data, meta: res?.meta }
  },
}