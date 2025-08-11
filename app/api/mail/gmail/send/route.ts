import { NextRequest } from "next/server"
import { google } from "googleapis"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 })

    const { to, subject, body } = await req.json()
    if (!to || !subject || !body) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: token })
    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    const raw = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      body,
    ].join("\r\n")

    const encoded = Buffer.from(raw, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_")

    await gmail.users.messages.send({ userId: "me", requestBody: { raw: encoded } })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Gmail send error" }), { status: 500 })
  }
}