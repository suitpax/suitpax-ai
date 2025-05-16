/**
 * Utilidades para interactuar con la API de ElevenLabs
 */

// Constantes para la API de ElevenLabs
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

// Voces predefinidas de ElevenLabs (puedes personalizar según tus necesidades)
export const ELEVENLABS_VOICES = {
  EMMA: "21m00Tcm4TlvDq8ikWAM", // Rachel
  SOPHIA: "AZnzlk1XvdvUeBnXmlld", // Domi
  MICHAEL: "TxGEqnHWrfWFTfGW9XjX", // Josh
}

/**
 * Convierte texto a voz utilizando la API de ElevenLabs
 */
export async function textToSpeech(
  text: string,
  voiceId: string = ELEVENLABS_VOICES.EMMA,
  stability = 0.5,
  similarityBoost = 0.75,
): Promise<ArrayBuffer> {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`)
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error("Error en text-to-speech:", error)
    throw error
  }
}

/**
 * Obtiene información sobre las voces disponibles en ElevenLabs
 */
export async function getVoices() {
  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener voces: ${response.statusText}`)
    }

    const data = await response.json()
    return data.voices
  } catch (error) {
    console.error("Error al obtener voces:", error)
    throw error
  }
}

/**
 * Convierte voz a texto utilizando la API de ElevenLabs
 */
export async function speechToText(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", audioBlob, "audio.webm")
    formData.append("model_id", "whisper-1")

    const response = await fetch(`${ELEVENLABS_API_URL}/speech-to-text`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Error en speech-to-text: ${response.statusText}`)
    }

    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Error en speech-to-text:", error)
    throw error
  }
}
