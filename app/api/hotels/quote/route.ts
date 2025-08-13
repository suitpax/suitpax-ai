import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rate_id } = body

    if (!rate_id) {
      return NextResponse.json({ error: "Rate ID is required" }, { status: 400 })
    }

    const duffel = getDuffelClient()
    const quote = await duffel.createHotelQuote(rate_id)

    return NextResponse.json({
      success: true,
      quote: quote.data,
    })
  } catch (error) {
    console.error("Create hotel quote error:", error)

    if (error.name === "DuffelError") {
      return NextResponse.json(
        {
          error: "Failed to create quote",
          details: error.message,
        },
        { status: error.status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
