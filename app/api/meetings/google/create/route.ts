import { NextRequest } from "next/server"
import { google } from "googleapis"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 })

    const { title, description, start, end, attendees = [], location } = await req.json()
    if (!title || !start || !end) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: token })
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        description,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: attendees.map((email: string) => ({ email })),
        location,
        conferenceData: { createRequest: { requestId: `${Date.now()}` } },
      },
      conferenceDataVersion: 1,
    })

    return new Response(JSON.stringify({ event: event.data }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Calendar create error" }), { status: 500 })
  }
}
