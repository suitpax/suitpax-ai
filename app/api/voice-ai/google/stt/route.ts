import { type NextRequest, NextResponse } from "next/server"
import speech from "@google-cloud/speech"

export async function POST(request: NextRequest) {
  try {
    const { audioContent, languageCode = "en-US" } = await request.json()
    if (!audioContent) return NextResponse.json({ error: "audioContent is required (base64)" }, { status: 400 })

    const client = new speech.SpeechClient()
    const [response] = await client.recognize({
      audio: { content: audioContent },
      config: { languageCode, enableAutomaticPunctuation: true },
    })

    const transcript = response.results?.map(r => r.alternatives?.[0]?.transcript || "").join(" ").trim() || ""
    return NextResponse.json({ transcript })
  } catch (e) {
    console.error("google stt error", e)
    return NextResponse.json({ error: "Failed to transcribe" }, { status: 500 })
  }
}

