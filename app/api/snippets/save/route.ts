import { type NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json()
    if (!content) return NextResponse.json({ error: "content required" }, { status: 400 })

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    await supabase.from("code_snippets").insert({ user_id: user.id, title: title || "Untitled", content })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("save snippet error", e)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}