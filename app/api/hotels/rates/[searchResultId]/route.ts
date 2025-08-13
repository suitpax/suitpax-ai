import { type NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function GET(_request: NextRequest, { params }: { params: { searchResultId: string } }) {
  try {
    const { searchResultId } = params

    if (!searchResultId) {
      return NextResponse.json({ error: "searchResultId is required" }, { status: 400 })
    }

    const duffel = createDuffelClient()
    const rates = await (duffel as any).stays.searchResults.getRates(searchResultId)

    return NextResponse.json({ success: true, rates })
  } catch (error) {
    console.error("Get hotel rates error:", error)
    return NextResponse.json({ error: "Failed to get rates" }, { status: 500 })
  }
}
