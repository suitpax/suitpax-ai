export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, departure_date, return_date, passengers, cabin_class } = body

    // Validate required fields
    if (!origin || !destination || !departure_date || !passengers) {
      return NextResponse.json(
        { error: "Missing required fields: origin, destination, departure_date, passengers" },
        { status: 400 },
      )
    }

    // Validate passengers array
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json({ error: "Passengers must be a non-empty array" }, { status: 400 })
    }

    const duffel = getDuffelClient()
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Search flights using Duffel
    const searchResult = await duffel.searchFlights({
      origin,
      destination,
      departure_date,
      return_date,
      passengers,
      cabin_class,
    })

    // Store search in database if user is authenticated
    if (user) {
      await supabase.from("flight_searches").insert({
        user_id: user.id,
        search_params: {
          origin,
          destination,
          departure_date,
          return_date,
          passengers,
          cabin_class,
        },
        results_count: searchResult.data.length,
      })
    }

    return NextResponse.json({
      success: true,
      offers: searchResult.data,
      count: searchResult.data.length,
    })
  } catch (error) {
    console.error("Flight search error:", error)

    if ((error as any).name === "DuffelError") {
      return NextResponse.json(
        {
          error: "Flight search failed",
          details: (error as any).message,
        },
        { status: (error as any).status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
