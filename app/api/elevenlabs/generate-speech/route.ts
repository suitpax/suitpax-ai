import { type NextRequest, NextResponse } from "next/server"

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

const AGENT_VOICES = {
  emma: "EXAVITQu4vr4xnSDxMaL", // Sarah - Professional female voice
  marcus: "VR6AewLTigWG4xSOukaG", // Josh - Professional male voice
}

export async function POST(request: NextRequest) {
  try {
    const { text, agentId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!agentId || !AGENT_VOICES[agentId as keyof typeof AGENT_VOICES]) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    const voiceId = AGENT_VOICES[agentId as keyof typeof AGENT_VOICES]
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)
      return NextResponse.json({ error: `ElevenLabs API error: ${response.statusText}` }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
