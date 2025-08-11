import { NextRequest } from "next/server"
import { google } from "googleapis"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 })

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: token })
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const now = new Date().toISOString()
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 50,
    })

    const events = (res.data.items || []).map((e) => ({
      id: e.id,
      title: e.summary || "",
      description: e.description || "",
      start: e.start?.dateTime || e.start?.date || "",
      end: e.end?.dateTime || e.end?.date || "",
      attendees: (e.attendees || []).map((a) => a.email || "").filter(Boolean),
      location: e.location || "",
      hangoutLink: e.hangoutLink || "",
    }))

    return new Response(JSON.stringify({ events }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Calendar error" }), { status: 500 })
  }
}