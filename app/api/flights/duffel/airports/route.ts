import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get("q") || "").trim()
    const limitParam = parseInt(searchParams.get("limit") || "10", 10)
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 25) : 10

    if (q.length < 2) {
      return NextResponse.json({ success: true, airports: [] })
    }

    const duffel = createDuffelClient()

    // Strategy: if q is 3 letters, search by iata_code first, otherwise try name and city_name
    const results: any[] = []

    const seenIds = new Set<string>()

    const addUnique = (items: any[]) => {
      for (const item of items) {
        if (item?.id && !seenIds.has(item.id)) {
          seenIds.add(item.id)
          results.push(item)
        }
      }
    }

    // Helper to run a safe Duffel list call
    const listAirports = async (params: Record<string, any>) => {
      try {
        const res = await duffel.airports.list({ ...params, limit })
        return res.data || []
      } catch (e) {
        return []
      }
    }

    if (q.length === 3) {
      const byCode = await listAirports({ iata_code: q.toUpperCase() })
      addUnique(byCode)
    }

    // Try by name and city_name as best-effort (Duffel supports filtering)
    const byName = await listAirports({ name: q })
    addUnique(byName)

    const byCity = await listAirports({ city_name: q })
    addUnique(byCity)

    // Map to lightweight shape the UI expects
    const airports = results.slice(0, limit).map((a: any) => ({
      id: a.id,
      iata_code: a.iata_code,
      name: a.name,
      city_name: a.city?.name || a.city_name || a.city || "",
      country_name: a.city?.country_name || a.country_name || "",
    }))

    return NextResponse.json({ success: true, airports })
  } catch (error) {
    console.error("Airports search error:", error)
    return NextResponse.json({ success: false, error: "Failed to search airports" }, { status: 500 })
  }
}
