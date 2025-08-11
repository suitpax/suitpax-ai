import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Placeholder de Cal.com: normalmente se llama a la API REST con API key
    // Aquí dejamos estructura básica
    const { title, start, end, attendees = [] } = await req.json()
    if (!title || !start || !end) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })

    // Llamada a Cal.com (omitted): await fetch("https://api.cal.com/v1/bookings", { headers: { Authorization: `Bearer ${process.env.CALCOM_API_KEY}` }, ... })

    return new Response(JSON.stringify({ ok: true, bookingId: `cal_${Date.now()}` }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Cal.com error" }), { status: 500 })
  }
}
