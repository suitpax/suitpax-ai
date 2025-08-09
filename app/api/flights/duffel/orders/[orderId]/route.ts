import { NextRequest, NextResponse } from "next/server"
import { createDuffelClient } from "@/lib/duffel"

export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const duffel = createDuffelClient()
    const res = await duffel.orders.get(params.orderId)
    const raw = res.data

    const order = {
      id: raw.id,
      booking_reference: raw.booking_reference,
      status: raw.status,
      total_amount: raw.total_amount,
      total_currency: raw.total_currency,
      passengers: raw.passengers?.map((p: any) => ({
        given_name: p.given_name,
        family_name: p.family_name,
        type: p.type
      })) || [],
      slices: (raw.slices || []).map((slice: any) => ({
        id: slice.id,
        origin: slice.origin,
        destination: slice.destination,
        duration: slice.duration,
        segments: (slice.segments || []).map((segment: any) => ({
          id: segment.id,
          origin: segment.origin,
          destination: segment.destination,
          departing_at: segment.departing_at,
          arriving_at: segment.arriving_at,
          marketing_carrier: segment.marketing_carrier,
          operating_carrier: segment.operating_carrier,
          flight_number: segment.flight_number,
          aircraft: segment.aircraft,
        }))
      })),
      available_actions: raw.available_actions || []
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}
