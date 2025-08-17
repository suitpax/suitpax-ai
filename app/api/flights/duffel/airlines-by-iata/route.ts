import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export async function GET(request: Request) {
  try {
    const duffel = getDuffelClient()
    const { searchParams } = new URL(request.url)
    const codesParam = searchParams.get('codes') || ''
    const codes = codesParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)

    if (codes.length === 0) return NextResponse.json({ data: {} })

    const entries = await Promise.all(codes.map(async (code) => {
      try {
        // Attempt to filter by iata_code
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
    }))

    const map: Record<string, any> = {}
    for (const [code, air] of entries) {
      if (air) map[code] = air
    }

    return NextResponse.json({ data: map })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}