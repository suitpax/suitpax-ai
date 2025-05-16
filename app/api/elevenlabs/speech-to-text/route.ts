import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convertir el archivo a un ArrayBuffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBlob = new Blob([arrayBuffer], { type: audioFile.type })

    // Crear un FormData para enviar a ElevenLabs
    const elevenLabsFormData = new FormData()
    elevenLabsFormData.append("file", audioBlob, "audio.webm")
    elevenLabsFormData.append("model_id", "whisper-1")

    // Enviar a ElevenLabs para transcripción
    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: elevenLabsFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)
      return NextResponse.json({ error: `ElevenLabs API error: ${response.statusText}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ text: data.text })
  } catch (error) {
    console.error("Error in speech-to-text API:", error)
    return NextResponse.json({ error: "Failed to transcribe speech" }, { status: 500 })
  }
}
