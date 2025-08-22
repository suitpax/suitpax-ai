import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const supabase = createServerSupabase()

    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()
      return NextResponse.json({ preferences: data || null })
    }

    const { data } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()
    return NextResponse.json({ preferences: data || null })
  } catch (e) {
    console.error("preferences GET error:", e)
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 })
  }
}

