import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  const isDevelopment = process.env.NODE_ENV === "development"
  const appUrl = isDevelopment ? "http://app.localhost:3000" : "https://app.suitpax.com"

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${appUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  const mainUrl = isDevelopment ? "http://localhost:3000" : "https://suitpax.com"
  return NextResponse.redirect(`${mainUrl}/login?message=Could not authenticate user`)
}
