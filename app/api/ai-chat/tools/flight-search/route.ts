import { NextResponse } from 'next/server'
import { resolveTravelIntent } from '@/lib/predictive-resolver'
import { Translate } from '@google-cloud/translate/build/src/v2'

export const runtime = 'nodejs'

function extractIataCodes(query: string): string[] {
  const codes = new Set<string>()
  const re = /\b([A-Z]{3})\b/g
  let m
  while ((m = re.exec(query.toUpperCase())) !== null) {
    codes.add(m[1])
  }
  return Array.from(codes)
}

function parseNaturalDates(input: string): { departure_date: string; return_date?: string } {
  const now = new Date()
  const toISO = (d: Date) => d.toISOString().split('T')[0]
  const q = input.toLowerCase()

  // Keywords in English/Spanish
  const isWeekend = /(this\s+weekend|este\s+fin\s+de\s+semana)/i.test(input)
  const isTomorrow = /(tomorrow|mañana)/i.test(q)
  const isToday = /(today|hoy)/i.test(q)
  const nextWeek = /(next\s+week|próxima\s+semana|proxima\s+semana)/i.test(q)

  const result: { departure_date: string; return_date?: string } = { departure_date: toISO(new Date(now.getTime() + 14 * 86400000)) }

  if (isToday) {
    result.departure_date = toISO(now)
  } else if (isTomorrow) {
    const d = new Date(now.getTime() + 86400000)
    result.departure_date = toISO(d)
  } else if (isWeekend) {
    // Next Saturday
    const d = new Date(now)
    const day = d.getDay() // 0=Sun
    const deltaToSat = (6 - day + 7) % 7 || 7
    const sat = new Date(d.getTime() + deltaToSat * 86400000)
    const sun = new Date(sat.getTime() + 1 * 86400000)
    result.departure_date = toISO(sat)
    result.return_date = toISO(sun)
  } else if (nextWeek) {
    const d = new Date(now.getTime() + 7 * 86400000)
    result.departure_date = toISO(d)
  }

  // Specific weekdays (English/Spanish)
  const weekdays: Record<string, number> = {
    monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0,
    lunes: 1, martes: 2, miercoles: 3, miércoles: 3, jueves: 4, viernes: 5, sabado: 6, sábado: 6, domingo: 0,
  }
  for (const [name, target] of Object.entries(weekdays)) {
    if (q.includes(name)) {
      const d = new Date(now)
      const delta = (target - d.getDay() + 7) % 7 || 7
      const next = new Date(d.getTime() + delta * 86400000)
      result.departure_date = toISO(next)
      break
    }
  }

  return result
}

function extractPreferences(input: string) {
  const q = input.toLowerCase()
  let cabin_class: 'economy' | 'premium_economy' | 'business' | 'first' | undefined
  if (/first|primera/.test(q)) cabin_class = 'first'
  else if (/business|negocios|executive/.test(q)) cabin_class = 'business'
  else if (/premium/.test(q)) cabin_class = 'premium_economy'
  else if (/economy|turista/.test(q)) cabin_class = 'economy'

  let max_connections: number | undefined
  if (/(non\s*stop|direct|sin\s+escalas)/i.test(input)) max_connections = 0

  // Currency and budget
  let currency: string | undefined
  if (/(usd|\$)/i.test(input)) currency = 'USD'
  if (/(eur|€)/i.test(input)) currency = 'EUR'
  if (/(gbp|£)/i.test(input)) currency = 'GBP'

  // Sort intent
  let sort: 'price' | 'duration' | 'recommended' | undefined
  if (/(cheapest|barato|precio)/i.test(input)) sort = 'price'
  if (/(fastest|rápido|rapido|duración|duration)/i.test(input)) sort = 'duration'

  return { cabin_class, max_connections, currency, sort }
}

function inferOrigin(request: Request, fallback: string = 'MAD', hint?: string): string {
  // If hint provided as IATA, use it
  if (hint && /^[A-Z]{3}$/.test(hint)) return hint
  const headers = (request as any).headers || new Headers()
  const city = headers.get('x-vercel-ip-city') || headers.get('x-city') || ''
  const country = headers.get('x-vercel-ip-country') || headers.get('x-country') || ''
  const cityToIata: Record<string, string> = {
    madrid: 'MAD', barcelona: 'BCN', paris: 'CDG', london: 'LHR', lisbon: 'LIS', rome: 'FCO', berlin: 'BER',
    'new york': 'JFK', nyc: 'JFK', miami: 'MIA', chicago: 'ORD', 'los angeles': 'LAX', 'san francisco': 'SFO',
  }
  const key = (city || '').toLowerCase().trim()
  if (key && cityToIata[key]) return cityToIata[key]
  // Country-level coarse defaults
  const countryToIata: Record<string, string> = { ES: 'MAD', FR: 'CDG', GB: 'LHR', PT: 'LIS', IT: 'FCO', DE: 'BER', US: 'JFK' }
  const code = (country || '').toUpperCase()
  if (code && countryToIata[code]) return countryToIata[code]
  return fallback
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    if (!query) return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 })

    const DUFFEL = process.env.DUFFEL_API_KEY || ''
    if (!DUFFEL) return NextResponse.json({ success: false, error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const upper = query.toUpperCase()
    const iataInQuery = extractIataCodes(upper)

    // Optional: auto-detect language and translate to English to improve matching across any language
    let queryForPrediction = query
    try {
      const translate = new Translate()
      const [translated] = await translate.translate(query, 'en')
      if (translated && typeof translated === 'string') {
        queryForPrediction = translated
      }
    } catch {
      // If translation is not configured, we silently skip
    }

    // Predict destination from natural language (translated when possible)
    const predicted = resolveTravelIntent(queryForPrediction)
    const best = predicted[0]

    // Heuristics for origin/destination
    let origin = iataInQuery[0] || inferOrigin(request)
    let destination = iataInQuery[1] || best?.iataCity || best?.airport || 'LON'

    // If pattern "FROM X TO Y" is present try to honor order
    const fromToMatch = /(?:FROM|DESDE)\s+([A-Z]{3}).*?(?:TO|A|HACIA)\s+([A-Z]{3})/i.exec(upper)
    if (fromToMatch) {
      origin = fromToMatch[1]
      destination = fromToMatch[2]
    }

    const natural = parseNaturalDates(queryForPrediction)
    const departure_date = natural.departure_date

    const prefs = extractPreferences(queryForPrediction)
    const body: any = {
      origin,
      destination,
      departure_date,
      return_date: natural.return_date,
      passengers: { adults: 1 },
      cabin_class: prefs.cabin_class || 'economy',
      max_connections: typeof prefs.max_connections === 'number' ? prefs.max_connections : 1,
      ...(prefs.currency ? { currency: prefs.currency } : {}),
      ...(prefs.sort ? { sort: prefs.sort } : {}),
    }

    const endpoint = new URL('/api/flights/duffel/search', (request as any).url || 'http://localhost:3000')
    const resp = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ success: false, error: text || 'Duffel error' }, { status: 500 })
    }

    const json = await resp.json()
    const offers = (json?.data?.offers || json?.data || []) as any[]

    return NextResponse.json({ success: true, offers, search_params: body })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

