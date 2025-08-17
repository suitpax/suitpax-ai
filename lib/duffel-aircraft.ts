import { getDuffelClient } from '@/lib/duffel'

interface AircraftDetails {
  id: string
  name?: string
  iata_code?: string
  icao_code?: string
  manufacturer?: string
}

export async function enrichOffersWithAircraftInfo(offers: any[]) {
  if (!Array.isArray(offers) || offers.length === 0) return offers

  const aircraftIds = new Set<string>()
  for (const offer of offers) {
    for (const slice of offer?.slices || []) {
      for (const segment of slice?.segments || []) {
        const id = segment?.aircraft?.id
        if (id) aircraftIds.add(id)
      }
    }
  }
  if (aircraftIds.size === 0) return offers

  const duffel = getDuffelClient()
  const idToDetails: Record<string, AircraftDetails> = {}

  await Promise.all(Array.from(aircraftIds).map(async (id) => {
    try {
      const details = await (duffel as any).aircraft.get(id)
      // normalize depending on SDK response shape
      const data = (details?.data || details) as any
      idToDetails[id] = {
        id: data.id,
        name: data.name,
        iata_code: data.iata_code,
        icao_code: data.icao_code,
        manufacturer: data.manufacturer,
      }
    } catch {
      // ignore individual failures
    }
  }))

  for (const offer of offers) {
    for (const slice of offer?.slices || []) {
      for (const segment of slice?.segments || []) {
        const id = segment?.aircraft?.id
        if (id && idToDetails[id]) {
          segment.aircraft = { ...idToDetails[id], ...segment.aircraft }
        }
      }
    }
  }

  return offers
}