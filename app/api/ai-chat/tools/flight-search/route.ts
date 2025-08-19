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

    // Very simple heuristics for origin/destination
    let origin = iataInQuery[0] || 'MAD'
    let destination = iataInQuery[1] || best?.iataCity || best?.airport || 'LON'

    // If pattern "FROM X TO Y" is present try to honor order
    const fromToMatch = /(?:FROM|DESDE)\s+([A-Z]{3}).*?(?:TO|A|HACIA)\s+([A-Z]{3})/i.exec(upper)
    if (fromToMatch) {
      origin = fromToMatch[1]
      destination = fromToMatch[2]
    }

    const departure_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0]

    const body = {
      origin,
      destination,
      departure_date,
      passengers: { adults: 1 },
      cabin_class: 'economy',
      max_connections: 1,
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

