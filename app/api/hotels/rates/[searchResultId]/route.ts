import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"

export async function GET(request: NextRequest, { params }: { params: { searchResultId: string } }) {
  try {
    const { searchResultId } = params

    if (!searchResultId) {
      return NextResponse.json({ error: "Search result ID is required" }, { status: 400 })
    }

    const duffel = getDuffelClient()
    const rates = await duffel.getHotelRates(searchResultId)

    return NextResponse.json({
      success: true,
      rates: rates.data,
    })
  } catch (error) {
    console.error("Get hotel rates error:", error)

    if (error.name === "DuffelError") {
      return NextResponse.json(
        {
          error: "Failed to get hotel rates",
          details: error.message,
        },
        { status: error.status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
