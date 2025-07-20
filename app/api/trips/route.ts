import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: trips, error } = await supabase
      .from("trips")
      .select(`
        *,
        expenses (
          id,
          amount,
          category,
          status
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ trips })
  } catch (error) {
    console.error("Get trips error:", error)
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tripData = await request.json()

    const { data: trip, error } = await supabase.from("trips").insert([tripData]).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    console.error("Create trip error:", error)
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    const { data: trip, error } = await supabase.from("trips").update(updateData).eq("id", id).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Update trip error:", error)
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 })
  }
}
