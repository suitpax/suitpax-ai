import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json()
    if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { error } = await supabase.from("user_preferences").upsert({
      user_id: user.id,
      preference_key: "default_bank_account_id",
      preference_value: accountId,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("default-account error", e)
    return NextResponse.json({ error: "Failed to set default account" }, { status: 500 })
  }
}