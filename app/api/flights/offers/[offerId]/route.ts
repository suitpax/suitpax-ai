import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"

export async function GET(request: NextRequest, { params }: { params: { offerId: string } }) {
  try {
    const { offerId } = params

    if (!offerId) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 })
    }

    const duffel = getDuffelClient()
    const offer = await duffel.getOffer(offerId)

    return NextResponse.json({
      success: true,
      offer: offer.data,
    })
  } catch (error) {
    console.error("Get offer error:", error)

    if ((error as any)?.name === "DuffelError") {
      return NextResponse.json(
        {
          error: "Failed to get offer",
          details: (error as any).message,
        },
        { status: (error as any).status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
