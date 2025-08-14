export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server";
import { getDuffelClient } from '@/lib/duffel/client';

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();

    if (!params.origin || !params.destination || !params.departureDate) {
      return NextResponse.json({ success: false, error: "Missing required fields", offers: [] }, { status: 400 });
    }

    const duffel = getDuffelClient();

    const slices = [
      { origin: params.origin, destination: params.destination, departure_date: params.departureDate }
    ];

    if (params.tripType === 'round_trip' && params.returnDate) {
      slices.push({ origin: params.destination, destination: params.origin, departure_date: params.returnDate });
    }

    const passengers = Array(params.passengers || 1).fill({ type: "adult" });

    const { data } = await duffel.searchFlights({
      origin: slices[0].origin,
      destination: slices[0].destination,
      departure_date: slices[0].departure_date,
      return_date: slices[1]?.departure_date,
      passengers,
      cabin_class: params.cabinClass || "economy",
    });

    return NextResponse.json({ success: true, offers: data || [], providers: ['duffel'], total_offers: data?.length || 0 });
  } catch (error: any) {
    console.error("Flight search error:", error);
    const status = error?.status || 500;
    const message = error?.message || "Failed to search flights";
    return NextResponse.json({ success: false, error: message, offers: [] }, { status });
  }
}
