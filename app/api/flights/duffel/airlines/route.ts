import { NextRequest } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { DuffelAirline, DuffelListResponse } from "@/lib/duffel/schemas"

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
      const airline = await duffel.airlines.get(id)
      return Response.json({ data: airline as unknown as DuffelAirline })
    }

    if (iata) {
      // list and filter by iata since duffel SDK lacks direct getByIata
      const list = await duffel.airlines.list({ limit: 100 })
      const found = list.data.find((a: any) => (a.iata_code || "").toUpperCase() === iata.toUpperCase())
      if (!found) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
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