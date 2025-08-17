import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || searchParams.get('q') || ''
    const limit = searchParams.get('limit') || '8'
    const lat = searchParams.get('lat') || undefined
    const lng = searchParams.get('lng') || undefined
    const rad = searchParams.get('rad') || undefined
    if (!query) return NextResponse.json({ data: [] })

    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const url = new URL('https://api.duffel.com/places/suggestions')
    url.searchParams.set('query', query)
    url.searchParams.set('limit', limit)
    if (lat) url.searchParams.set('lat', lat)
    if (lng) url.searchParams.set('lng', lng)
    if (rad) url.searchParams.set('rad', rad)

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error' }, { status: resp.status })
    }

    const json = await resp.json()
    const data = Array.isArray(json?.data) ? json.data : []
    return NextResponse.json({ data, warnings: json?.warnings || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}