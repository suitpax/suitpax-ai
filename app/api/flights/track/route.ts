import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { offerId } = await req.json()
    if (!offerId) return NextResponse.json({ error: "offerId required" }, { status: 400 })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { error } = await supabase.from("flight_tracking").insert({ user_id: user.id, offer_id: offerId })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 })
  }
}

