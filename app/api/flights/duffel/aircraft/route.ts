import { NextRequest } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { DuffelAircraft, DuffelListResponse } from "@/lib/duffel/schemas"

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
      const aircraft = await duffel.aircraft.get(id)
      return Response.json({ data: aircraft as unknown as DuffelAircraft })
    }

    if (iata) {
      const list = await duffel.aircraft.list({ limit: 200 })
      const found = list.data.find((a: any) => (a.iata_code || "").toUpperCase() === iata.toUpperCase())
      if (!found) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
      return Response.json({ data: found as DuffelAircraft })
    }

    const result = await duffel.aircraft.list({ limit, after, before })
    return Response.json(result as DuffelListResponse<DuffelAircraft>)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Duffel error" }), { status: 500 })
  }
}

