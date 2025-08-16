import { type NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  if (!code) return NextResponse.json({ error: "missing code" }, { status: 400 })

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/integrations/google/callback`
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokenRes.ok) return NextResponse.json({ error: tokens.error || "oauth error" }, { status: 400 })

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return NextResponse.redirect("/auth/login")

    await supabase.from("user_integrations").upsert({
      user_id: user.id,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      expires_at: Math.floor(Date.now() / 1000) + (tokens.expires_in || 3600),
    }, { onConflict: "user_id,provider" })

    const dest = state?.includes("gmail") ? "/dashboard/integrations?ok=gmail" : "/dashboard/integrations?ok=drive"
    return NextResponse.redirect(dest)
  } catch (e) {
    console.error("google oauth callback error", e)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}