import { NextRequest, NextResponse } from "next/server"

function normalizeExpediaStays(raw: any[]): any[] {
  return (raw || []).map((s: any, idx: number) => ({
    id: s?.id || String(idx),
    name: s?.name || "",
    brand: s?.brand || null,
    city: s?.city || null,
    address: s?.address || null,
    image: s?.image || null,
    rating: typeof s?.rating === 'number' ? s.rating : null,
    price: s?.currency ? `${s.currency} ${s?.price}` : String(s?.price || ""),
    currency: s?.currency || "USD",
    refundable: s?.refundable ?? null,
    badges: [],
    booking_url: `/dashboard/hotels/book/${s?.id || idx}`,
  }))
}

export async function POST(req: NextRequest) {
  try {
    // Placeholder: integrate Expedia Partner API here when credentials are configured
    const body = await req.json()
    const mock: any[] = []
    const stays = normalizeExpediaStays(mock)
    return NextResponse.json({ success: true, stays })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 })
  }
}