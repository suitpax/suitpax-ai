import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function GET(req: NextRequest) {
  try {
    const duffel = createDuffelClient()
    const url = new URL(req.url)
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 50
    const after = url.searchParams.get("after") || undefined
    const before = url.searchParams.get("before") || undefined
    const iata_code = url.searchParams.get("iata_code") || undefined
    const name = url.searchParams.get("name") || undefined
    const country = url.searchParams.get("country") || undefined

    const params: any = { limit }
    if (after) params.after = after
    if (before) params.before = before
    if (iata_code) params.iata_code = iata_code
    if (name) params.name = name
    if (country) params.country = country

    const response = await duffel.cities.list(params)

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta
    })
  } catch (error: any) {
    console.error("Cities fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}