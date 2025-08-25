import { type NextRequest, NextResponse } from "next/server"
import textToSpeech from "@google-cloud/text-to-speech"

export async function POST(request: NextRequest) {
  try {
    const { text, voice = { languageCode: "en-US", name: "en-US-Standard-C" }, audioConfig = { audioEncoding: "MP3" } } = await request.json()
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 })
    }

    const client = new textToSpeech.TextToSpeechClient()
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice,
      audioConfig,
    } as any)

    const audioContent = response.audioContent
    if (!audioContent) return NextResponse.json({ error: "No audio generated" }, { status: 500 })

    return new NextResponse(Buffer.from(audioContent as Buffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (e) {
    console.error("google tts error", e)
    return NextResponse.json({ error: "Failed to synthesize" }, { status: 500 })
  }
}

