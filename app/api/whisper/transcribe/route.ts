import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "edge"

export async function POST(req: NextRequest) {
	try {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })

		const form = await req.formData()
		const file = form.get("audio") as File | null
		if (!file) return NextResponse.json({ error: "Missing audio file" }, { status: 400 })

		const client = new OpenAI({ apiKey })
		const transcription = await client.audio.transcriptions.create({
			model: "whisper-1",
			file,
			response_format: "json",
			language: form.get("language") as string | undefined,
		})

		return NextResponse.json({ text: (transcription as any)?.text || "" })
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || "Transcription failed" }, { status: 500 })
	}
}