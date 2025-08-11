import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function GET(req: NextRequest) {
  try {
    createDuffelClient() // ensure token configured; SDK does not expose cities in this version
    const url = new URL(req.url)
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 50
    const name = (url.searchParams.get("name") || url.searchParams.get("q") || "").trim()

    if (!name || name.length < 2) {
      return NextResponse.json({ success: false, error: "name must be at least 2 characters" }, { status: 400 })
    }

    if (!process.env.DUFFEL_API_KEY) {
      return NextResponse.json({ success: false, error: "Duffel API key not configured" }, { status: 500 })
    }

    const resp = await fetch(`https://api.duffel.com/air/places/suggestions?query=${encodeURIComponent(name)}&limit=${Math.max(limit, 20)}`, {
      headers: {
        Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
        "Duffel-Version": "v2",
      },
      cache: 'no-store'
    })
    if (!resp.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch cities" }, { status: 502 })
    }
    const json: any = await resp.json()
    const data = (json?.data || []).filter((p: any) => p.type === 'city')

    return NextResponse.json({ success: true, data, meta: { limit } })
  } catch (error: any) {
    console.error("Cities fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}
