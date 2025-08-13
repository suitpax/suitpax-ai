import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function POST(request: NextRequest) {
  try {
    const { rate_id } = await request.json()

    if (!rate_id) {
      return NextResponse.json({ error: "rate_id is required" }, { status: 400 })
    }

    const duffel = createDuffelClient()
    // Using stays.quote endpoint (if available) or generic stays/quotes
    const quote = await (duffel as any).stays.quotes.create({ rate_id })

    return NextResponse.json({ success: true, quote })
  } catch (error) {
    console.error("Hotel quote error:", error)
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
  }
}
