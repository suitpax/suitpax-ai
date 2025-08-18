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
    const types = searchParams.get('types') || undefined
    const subtypes = searchParams.get('subtypes') || undefined
    const locale = searchParams.get('locale') || undefined
    if (!query) return NextResponse.json({ data: [] })

    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const url = new URL('https://api.duffel.com/places/suggestions')
    url.searchParams.set('query', query)
    url.searchParams.set('limit', limit)
    if (lat) url.searchParams.set('lat', lat)
    if (lng) url.searchParams.set('lng', lng)
    if (rad) url.searchParams.set('rad', rad)
    if (types) url.searchParams.set('types', types)
    if (subtypes) url.searchParams.set('subtypes', subtypes)
    if (locale) url.searchParams.set('locale', locale)

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Duffel-Version': 'v2',
        'Accept-Encoding': 'gzip',
      },
      cache: 'no-store',
    })

    const requestId = resp.headers.get('x-request-id') || undefined

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: text || 'Duffel error', request_id: requestId }, { status: resp.status })
    }

    const json = await resp.json()
    const raw = Array.isArray(json?.data) ? json.data : []
    const data = raw.filter((p: any) => {
      const city = (p?.city_name || p?.city?.name || '').toString()
      const name = (p?.name || city || '').toString()
      if (!name || name.length < 3) return false
      if (/^\d+\s/.test(name)) return false
      return true
    }).map((p: any) => ({
      ...p,
      iata_code: (p?.iata_code || p?.airport?.iata_code || '').toUpperCase(),
      city_name: p?.city_name ? titleCase(p.city_name) : (p?.city?.name ? titleCase(p.city.name) : undefined),
      name: p?.name ? titleCase(p.name) : p?.name,
    }))
    return NextResponse.json({ data, warnings: json?.warnings || [], request_id: requestId })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}

function capitalize(s: string) {
  try { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() } catch { return s }
}

function titleCase(s: string) {
  try {
    return s.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w).join(' ')
  } catch { return s }
}