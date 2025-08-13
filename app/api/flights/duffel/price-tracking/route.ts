import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient } from "@/lib/duffel";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId, userNotes } = body

    if (!offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 })
    }

    const duffel = createDuffelClient()

    // Placeholder: In a real implementation you might persist tracking in DB
    const offer = await duffel.offers.get(offerId).catch(() => null)

    return NextResponse.json({ success: true, tracked: true, offer, notes: userNotes || null })
  } catch (error) {
    console.error("Price tracking error:", error)
    return NextResponse.json({ error: "Failed to track price" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const offerId = searchParams.get("offerId")

    if (!offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 })
    }

    const duffel = createDuffelClient()
    // Optional: Verify offer exists before tracking
    try {
      await duffel.offers.get(offerId)
    } catch {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Placeholder response
    return NextResponse.json({ success: true, offerId, tracked: true })
  } catch (error) {
    console.error("Price tracking fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch tracking info" }, { status: 500 })
  }
}
