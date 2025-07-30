import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text, voiceId, language = "en-US" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!voiceId) {
      return NextResponse.json({ error: "Voice ID is required" }, { status: 400 })
    }

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key is not configured" }, { status: 500 })
    }

    // Determinar la voz óptima según el idioma (en una implementación real, tendrías más voces por idioma)
    const optimalVoiceId = voiceId

    // Configurar los parámetros de voz según el idioma
    const voiceSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
    }

    // Ajustar la configuración de voz según el idioma
    if (language.startsWith("es")) {
      // Ajustes para español
      voiceSettings.stability = 0.6
      voiceSettings.similarity_boost = 0.8
    } else if (language.startsWith("fr")) {
      // Ajustes para francés
      voiceSettings.stability = 0.55
      voiceSettings.similarity_boost = 0.7
    } else if (language.startsWith("de")) {
      // Ajustes para alemán
      voiceSettings.stability = 0.65
      voiceSettings.similarity_boost = 0.75
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${optimalVoiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: voiceSettings,
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
      },
    })
  } catch (error) {
    console.error("Error in text-to-speech API:", error)
    return NextResponse.json({ error: "Failed to convert text to speech" }, { status: 500 })
  }
}
