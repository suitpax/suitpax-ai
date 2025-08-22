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
      const item = await (duffel as any).loyaltyProgrammes.get(id)
      lpCacheById.set(id, item)
      return Response.json({ data: item as unknown as DuffelLoyaltyProgramme })
    }

    if (ownerAirlineId) {
      const key = ownerAirlineId
      if (lpCacheByOwner.has(key)) return Response.json({ data: lpCacheByOwner.get(key) as DuffelLoyaltyProgramme[] })
      const list = await (duffel as any).loyaltyProgrammes.list({ limit: 200 })
      const arr = list.data.filter((l: any) => l.owner_airline_id === ownerAirlineId)
      lpCacheByOwner.set(key, arr)
      return Response.json({ data: arr as DuffelLoyaltyProgramme[] })
    }

    if (alliance) {
      const key = alliance.toLowerCase()
      if (lpCacheByAlliance.has(key)) return Response.json({ data: lpCacheByAlliance.get(key) as DuffelLoyaltyProgramme[] })
      const list = await (duffel as any).loyaltyProgrammes.list({ limit: 200 })
      const arr = list.data.filter((l: any) => (l.alliance || "").toLowerCase() === key)
      lpCacheByAlliance.set(key, arr)
      return Response.json({ data: arr as DuffelLoyaltyProgramme[] })
    }

    const result = await (duffel as any).loyaltyProgrammes.list({ limit, after, before })
    return Response.json(result as DuffelListResponse<DuffelLoyaltyProgramme>)
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Duffel error" }), { status: 500 })
  }
}

// Removed legacy duplicate GET handler