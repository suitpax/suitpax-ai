import { getDuffelClient } from '@/lib/duffel'
import type { Aircraft, ListAircraftParams, ListAircraftResponse } from './types'

export const AircraftResource = {
  async get(id: string): Promise<Aircraft> {
    const duffel = getDuffelClient() as any
    const res = await duffel.aircraft.get(id)
    return (res?.data || res) as Aircraft
  },

  async list(params: ListAircraftParams = {}): Promise<ListAircraftResponse> {
    const duffel = getDuffelClient() as any
    if (!duffel.aircraft?.list) throw new Error('Listing aircraft is not supported by current SDK version')
    const res = await duffel.aircraft.list(params)
    return { data: (res?.data || res?.aircraft || []) as Aircraft[], meta: res?.meta }
  },
}