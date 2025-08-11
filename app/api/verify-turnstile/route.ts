import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { token } = await req.json()
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
  }

  const secret = process.env.TURNSTILE_SECRET_KEY

  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(secret!)}&response=${encodeURIComponent(token)}`,
  })

  const data = await r.json()
  return NextResponse.json(data)
}
