import { NextRequest } from "next/server"
import { google } from "googleapis"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 })

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: token })
    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    const res = await gmail.users.messages.list({ userId: "me", maxResults: 25 })
    const messages = res.data.messages || []

    // Fetch basic details for each message
    const detailed = await Promise.all(
      messages.map(async (m) => {
        try {
          const msg = await gmail.users.messages.get({ userId: "me", id: m.id! })
          const headers = msg.data.payload?.headers || []
          const find = (name: string) => headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || ""
          const from = find("From")
          const subject = find("Subject")
          const date = find("Date")
          const snippet = msg.data.snippet || ""
          return { id: m.id, from, subject, preview: snippet, date, read: true, starred: false }
        } catch {
          return { id: m.id, from: "", subject: "", preview: "", date: "", read: true, starred: false }
        }
      })
    )

    return new Response(JSON.stringify({ messages: detailed }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Gmail error" }), { status: 500 })
  }
}
