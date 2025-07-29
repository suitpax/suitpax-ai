import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

const profileUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  avatar_url: z.string().optional(),
  job_title: z.string().optional(),
  department: z.string().optional(),
  employee_id: z.string().optional(),
  manager: z.string().optional(),
  start_date: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  preferences: z
    .object({
      seat_preference: z.string().optional(),
      meal_preference: z.string().optional(),
      notification_settings: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
          push: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
})

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile from database
    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") {
      console.error("Profile fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
      },
      profile: profile || null,
    })
  } catch (error) {
    console.error("Profile GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Update user metadata in auth
    if (validatedData.full_name) {
      await supabase.auth.updateUser({
        data: { full_name: validatedData.full_name },
      })
    }

    // Upsert profile in database
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Profile update error:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    console.error("Profile PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
