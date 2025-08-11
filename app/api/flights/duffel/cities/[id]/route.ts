import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    createDuffelClient()
    if (!process.env.DUFFEL_API_KEY) {
      return NextResponse.json({ error: "Duffel API key not configured" }, { status: 500 })
    }
    // There is no cities.get in SDK; try to find by suggestions and match id
    const resp = await fetch(`https://api.duffel.com/air/places/${params.id}`, {
      headers: { Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`, "Duffel-Version": "v2" },
      cache: 'no-store'
    })
    if (resp.status === 404) return NextResponse.json({ error: "City not found" }, { status: 404 })
    if (!resp.ok) return NextResponse.json({ error: "Failed to fetch city" }, { status: 502 })
    const json = await resp.json()
    return NextResponse.json(json?.data ?? json)
  } catch (error: any) {
    console.error("City fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch city" }, { status: 500 })
  }
}
