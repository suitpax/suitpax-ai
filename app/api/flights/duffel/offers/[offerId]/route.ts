import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient, handleDuffelError } from '@/lib/duffel';

export async function GET(
  request: NextRequest,
  { params }: { params: { offerId: string } }
) {
  try {
    const duffel = createDuffelClient()
    const { offerId } = params

    if (!offerId) {
      return NextResponse.json({ success: false, error: "Offer ID is required" }, { status: 400 })
    }

    // Best practice: retrieve the offer again to get the latest price
    const offerResponse = await duffel.offers.get(offerId)

    if (!offerResponse.data) {
      return NextResponse.json({ success: false, error: "Offer not found or has expired" }, { status: 404 })
    }

    return NextResponse.json({ success: true, offer: offerResponse.data })
  } catch (error) {
    const errorResponse = handleDuffelError(error)
    return NextResponse.json(errorResponse, { status: errorResponse.status })
  }
}
