import { NextResponse } from 'next/server'

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

    const iatas = extractIataCodes(query)
    if (iatas.length < 2) {
      return NextResponse.json({ success: false, error: 'Please include origin and destination IATA codes (e.g., MAD LHR)' }, { status: 400 })
    }

    const origin = iatas[0]
    const destination = iatas[1]
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