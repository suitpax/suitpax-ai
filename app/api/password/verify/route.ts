import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const expected = process.env.SITE_ACCESS_PASSWORD || ""
    const ok = Boolean(expected) && password === expected

    if (!ok) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })
    // short-lived cookie (12 hours)
    res.cookies.set("site_access_ok", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 12,
      path: "/",
    })
    return res
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

