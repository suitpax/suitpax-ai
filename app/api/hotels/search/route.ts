export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { getDuffelClient } from "@/lib/duffel/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { location, check_in_date, check_out_date, guests, rooms } = body

    // Validate required fields
    if (!location || !check_in_date || !check_out_date || !guests || !rooms) {
      return NextResponse.json(
        { error: "Missing required fields: location, check_in_date, check_out_date, guests, rooms" },
        { status: 400 },
      )
    }

    // Validate location format
    if (!location.latitude || !location.longitude || !location.radius) {
      return NextResponse.json({ error: "Location must include latitude, longitude, and radius" }, { status: 400 })
    }

    // Validate dates
    const checkIn = new Date(check_in_date)
    const checkOut = new Date(check_out_date)
    const today = new Date()

    if (checkIn < today) {
      return NextResponse.json({ error: "Check-in date cannot be in the past" }, { status: 400 })
    }

    if (checkOut <= checkIn) {
      return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 })
    }

    const duffel = getDuffelClient()
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Search hotels using Duffel
    const searchResult = await duffel.searchHotels({
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: location.radius,
      },
      check_in_date,
      check_out_date,
      guests,
      rooms,
    })

    // Store search in database if user is authenticated
    if (user) {
      await supabase.from("hotel_searches").insert({
        user_id: user.id,
        search_params: {
          location,
          check_in_date,
          check_out_date,
          guests,
          rooms,
        },
        results_count: searchResult.data.length,
      })
    }

    return NextResponse.json({
      success: true,
      results: searchResult.data,
      count: searchResult.data.length,
    })
  } catch (error) {
    console.error("Hotel search error:", error)

    if ((error as any).name === "DuffelError") {
      return NextResponse.json(
        {
          error: "Hotel search failed",
          details: (error as any).message,
        },
        { status: (error as any).status || 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
