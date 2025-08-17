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

  const needed = new Set(codes)
  const map: Record<string, any> = {}
  // Try generator
  const gen = (duffel as any).airlines?.listWithGenerator ? (duffel as any).airlines.listWithGenerator() : null
  if (gen && gen[Symbol.asyncIterator]) {
    try {
      for await (const air of gen as AsyncGenerator<any, any, any>) {
        const code = air?.iata_code?.toUpperCase?.()
        if (code && needed.has(code)) {
          map[code] = {
            id: air.id,
            name: air.name,
            iata_code: air.iata_code,
            icao_code: air.icao_code,
            logo_symbol_url: air.logo_symbol_url,
            logo_lockup_url: air.logo_lockup_url,
            conditions_of_carriage_url: air.conditions_of_carriage_url,
          }
          needed.delete(code)
          if (needed.size === 0) break
        }
      }
    } catch {
      // ignore and fallback
    }
  }

  // Fallback: query each missing code
  if (needed.size > 0) {
    await Promise.all(Array.from(needed).map(async (code) => {
      try {
        const res: any = await (duffel as any).airlines.list({ iata_code: code })
        const air = Array.isArray(res?.data) ? res.data[0] : (res?.airlines?.[0] || null)
        if (air) {
          map[code] = {
            id: air.id,
            name: air.name,
            iata_code: air.iata_code,
            icao_code: air.icao_code,
            logo_symbol_url: air.logo_symbol_url,
            logo_lockup_url: air.logo_lockup_url,
            conditions_of_carriage_url: air.conditions_of_carriage_url,
          }
        }
      } catch {}
    }))
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
        if (!segment.airline.conditions_of_carriage_url && air.conditions_of_carriage_url) segment.airline.conditions_of_carriage_url = air.conditions_of_carriage_url
      }
    }
  }

  return offers
}