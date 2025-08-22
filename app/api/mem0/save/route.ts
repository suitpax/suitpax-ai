import { NextResponse } from "next/server"
import { getMem0Client } from "@/lib/mem0/client"

export async function POST(req: Request) {
  try {
    const { userId, channel = "voice", text, tags = [] } = await req.json()
    if (!userId || !text) return NextResponse.json({ error: "userId and text required" }, { status: 400 })

    const mem0 = getMem0Client()
    const res = await mem0.memories.create({
      userId,
      text,
      metadata: { channel, tags },
    })
    return NextResponse.json({ success: true, id: res.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "mem0 error" }, { status: 500 })
  }
}