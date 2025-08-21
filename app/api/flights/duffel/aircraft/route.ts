import { NextRequest } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { DuffelAircraft, DuffelListResponse } from "@/lib/duffel/schemas"

const aircraftCacheById = new Map<string, any>()
const aircraftCacheByIata = new Map<string, any>()

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
      if (aircraftCacheById.has(id)) return Response.json({ data: aircraftCacheById.get(id) as DuffelAircraft })
      const aircraft = await duffel.aircraft.get(id)
      aircraftCacheById.set(id, aircraft)
      if (aircraft?.iata_code) aircraftCacheByIata.set(String(aircraft.iata_code).toUpperCase(), aircraft)
      return Response.json({ data: aircraft as unknown as DuffelAircraft })
    }

    if (iata) {
      const key = iata.toUpperCase()
      if (aircraftCacheByIata.has(key)) return Response.json({ data: aircraftCacheByIata.get(key) as DuffelAircraft })
      const list = await duffel.aircraft.list({ limit: 200 })
      const found = list.data.find((a: any) => (a.iata_code || "").toUpperCase() === key)
      if (!found) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
      aircraftCacheByIata.set(key, found)
      if (found?.id) aircraftCacheById.set(found.id, found)
      return Response.json({ data: found as DuffelAircraft })
    }

    const result = await duffel.aircraft.list({ limit, after, before })
    return Response.json(result as DuffelListResponse<DuffelAircraft>)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Duffel error" }), { status: 500 })
  }
}

