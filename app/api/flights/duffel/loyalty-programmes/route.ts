import { NextRequest } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { DuffelLoyaltyProgramme, DuffelListResponse } from "@/lib/duffel/schemas"

const lpCacheById = new Map<string, any>()
const lpCacheByOwner = new Map<string, any[]>()
const lpCacheByAlliance = new Map<string, any[]>()

export async function GET(req: NextRequest) {
  try {
    const duffel = getDuffelClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const ownerAirlineId = searchParams.get("owner_airline_id")
    const alliance = searchParams.get("alliance")
    const limit = Number(searchParams.get("limit") || 50)
    const after = searchParams.get("after") || undefined
    const before = searchParams.get("before") || undefined

    if (id) {
      if (lpCacheById.has(id)) return Response.json({ data: lpCacheById.get(id) as DuffelLoyaltyProgramme })
      const item = await duffel.loyaltyProgrammes.get(id)
      lpCacheById.set(id, item)
      return Response.json({ data: item as unknown as DuffelLoyaltyProgramme })
    }

    if (ownerAirlineId) {
      const key = ownerAirlineId
      if (lpCacheByOwner.has(key)) return Response.json({ data: lpCacheByOwner.get(key) as DuffelLoyaltyProgramme[] })
      const list = await duffel.loyaltyProgrammes.list({ limit: 200 })
      const arr = list.data.filter((l: any) => l.owner_airline_id === ownerAirlineId)
      lpCacheByOwner.set(key, arr)
      return Response.json({ data: arr as DuffelLoyaltyProgramme[] })
    }

    if (alliance) {
      const key = alliance.toLowerCase()
      if (lpCacheByAlliance.has(key)) return Response.json({ data: lpCacheByAlliance.get(key) as DuffelLoyaltyProgramme[] })
      const list = await duffel.loyaltyProgrammes.list({ limit: 200 })
      const arr = list.data.filter((l: any) => (l.alliance || "").toLowerCase() === key)
      lpCacheByAlliance.set(key, arr)
      return Response.json({ data: arr as DuffelLoyaltyProgramme[] })
    }

    const result = await duffel.loyaltyProgrammes.list({ limit, after, before })
    return Response.json(result as DuffelListResponse<DuffelLoyaltyProgramme>)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Duffel error" }), { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const after = searchParams.get('after') || undefined
    const before = searchParams.get('before') || undefined
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })

    const url = new URL('https://api.duffel.com/air/loyalty_programmes')
    if (after) url.searchParams.set('after', after)
    if (before) url.searchParams.set('before', before)
    if (typeof limit === 'number') url.searchParams.set('limit', String(limit))

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
    const data = Array.isArray(json?.data) ? json.data : []
    const meta = json?.meta || {}
    return NextResponse.json({ data, meta, request_id: requestId })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected error' }, { status: 500 })
  }
}