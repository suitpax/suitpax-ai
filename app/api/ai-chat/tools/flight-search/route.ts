import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Simulated offers for demo purposes
    const offers = [
      { id: "OF1", price: 820, currency: "EUR", airline: "IB", airline_name: "Iberia", from: "MAD", to: "SFO", depart: "08:45", arrive: "14:10", stops: 1 },
      { id: "OF2", price: 890, currency: "EUR", airline: "UX", airline_name: "Air Europa", from: "MAD", to: "SFO", depart: "11:05", arrive: "16:40", stops: 1 },
      { id: "OF3", price: 960, currency: "EUR", airline: "DL", airline_name: "Delta", from: "MAD", to: "SFO", depart: "13:20", arrive: "20:05", stops: 1 },
    ]
    return NextResponse.json({ success: true, offers })
  } catch (e) {
    return NextResponse.json({ success: false, offers: [] }, { status: 500 })
  }
}
