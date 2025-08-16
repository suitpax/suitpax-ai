import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/integrations/google/callback`
  const scope = encodeURIComponent([
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" "))
  const state = encodeURIComponent(JSON.stringify({ type: "gmail" }))
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}&access_type=offline&prompt=consent&state=${state}`

  return NextResponse.redirect(url)
}