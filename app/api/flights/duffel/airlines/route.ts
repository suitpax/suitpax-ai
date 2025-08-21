import { NextRequest } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { DuffelAirline, DuffelListResponse } from "@/lib/duffel/schemas"

const airlineCacheById = new Map<string, any>()
const airlineCacheByIata = new Map<string, any>()

export async function GET(req: NextRequest) {
  try {
    const duffel = getDuffelClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const iata = searchParams.get("iata")
    const limit = Number(searchParams.get("limit") || 30)
    const after = searchParams.get("after") || undefined
    const before = searchParams.get("before") || undefined

    if (id) {
      if (airlineCacheById.has(id)) return Response.json({ data: airlineCacheById.get(id) as DuffelAirline })
      const airline = await duffel.airlines.get(id)
      airlineCacheById.set(id, airline)
      if (airline?.iata_code) airlineCacheByIata.set(String(airline.iata_code).toUpperCase(), airline)
      return Response.json({ data: airline as unknown as DuffelAirline })
    }

    if (iata) {
      const key = iata.toUpperCase()
      if (airlineCacheByIata.has(key)) return Response.json({ data: airlineCacheByIata.get(key) as DuffelAirline })
      // list and filter by iata since duffel SDK lacks direct getByIata
      const list = await duffel.airlines.list({ limit: 200 })
      const found = list.data.find((a: any) => (a.iata_code || "").toUpperCase() === key)
      if (!found) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
      airlineCacheByIata.set(key, found)
      if (found?.id) airlineCacheById.set(found.id, found)
      return Response.json({ data: found as DuffelAirline })
    }

    const result = await duffel.airlines.list({ limit, after, before })
    return Response.json(result as DuffelListResponse<DuffelAirline>)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Duffel error" }), { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getDuffelClient } from '@/lib/duffel'

export async function GET(request: Request) {
  try {
    const token = process.env.DUFFEL_API_KEY || ''
    if (!token) return NextResponse.json({ error: 'Missing DUFFEL_API_KEY' }, { status: 500 })
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || undefined
    const after = searchParams.get('after') || undefined
    const before = searchParams.get('before') || undefined
    const duffel = getDuffelClient() as any
    const res = await duffel.airlines.list({ limit: limit ? Number(limit) : undefined, after, before })
    const data = res?.data || res
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}