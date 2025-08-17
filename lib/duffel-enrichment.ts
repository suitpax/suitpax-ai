import { getDuffelClient } from '@/lib/duffel'

export async function enrichOffersWithAirlineInfo(offers: any[]) {
  if (!Array.isArray(offers) || offers.length === 0) return offers

  const codes = new Set<string>()

  for (const offer of offers) {
    for (const slice of offer?.slices || []) {
      for (const segment of slice?.segments || []) {
        const hasAirlineLogo = Boolean(segment?.airline?.logo_symbol_url || segment?.airline?.logo_lockup_url)
        const code = segment?.marketing_carrier?.iata_code
        if (!hasAirlineLogo && code) codes.add(code.toUpperCase())
      }
    }
  }

  if (codes.size === 0) return offers

  const duffel = getDuffelClient()

  const entries = await Promise.all(
    Array.from(codes).map(async (code) => {
      try {
        const res: any = await (duffel as any).airlines.list({ iata_code: code })
        const air = Array.isArray(res?.data) ? res.data[0] : (res?.airlines?.[0] || null)
        if (!air) return [code, null] as const
        return [code, {
          id: air.id,
          name: air.name,
          iata_code: air.iata_code,
          icao_code: air.icao_code,
          logo_symbol_url: air.logo_symbol_url,
          logo_lockup_url: air.logo_lockup_url,
        }] as const
      } catch {
        return [code, null] as const
      }
    })
  )

  const map: Record<string, any> = {}
  for (const [code, air] of entries) {
    if (air) map[code] = air
  }

  for (const offer of offers) {
    for (const slice of offer?.slices || []) {
      for (const segment of slice?.segments || []) {
        const code = segment?.marketing_carrier?.iata_code?.toUpperCase?.()
        if (!code) continue
        const air = map[code]
        if (!air) continue
        segment.airline = segment.airline || {}
        if (!segment.airline.name) segment.airline.name = air.name
        if (!segment.airline.logo_symbol_url) segment.airline.logo_symbol_url = air.logo_symbol_url
        if (!segment.airline.logo_lockup_url) segment.airline.logo_lockup_url = air.logo_lockup_url
        if (!segment.airline.iata_code) segment.airline.iata_code = code
      }
    }
  }

  return offers
}