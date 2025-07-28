import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY no está configurada" }, { status: 500 })
    }

    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`)
    }

    const data = await response.json()

    // Formatear los datos para que sean más fáciles de usar
    const voices = data.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      preview: voice.preview_url,
      category: voice.category,
    }))

    return NextResponse.json({ voices })
  } catch (error) {
    console.error("Error al obtener voces:", error)
    return NextResponse.json({ error: "Error al obtener voces de ElevenLabs" }, { status: 500 })
  }
}
