import { ElevenLabsApi } from "elevenlabs"

const apiKey = process.env.ELEVENLABS_API_KEY

if (!apiKey) {
  throw new Error("ELEVENLABS_API_KEY is not set")
}

const elevenlabs = new ElevenLabsApi({
  apiKey,
})

export interface Voice {
  voice_id: string
  name: string
  category: string
  description: string
  preview_url?: string
}

export const AGENT_VOICES: Record<string, Voice> = {
  emma: {
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Sarah - Professional female voice
    name: "Sarah",
    category: "professional",
    description: "Warm, professional female voice perfect for executive assistance",
  },
  marcus: {
    voice_id: "VR6AewLTigWG4xSOukaG", // Josh - Professional male voice
    name: "Josh",
    category: "professional",
    description: "Authoritative, clear male voice ideal for corporate communication",
  },
}

export async function generateSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  try {
    const audio = await elevenlabs.generate({
      voice: voiceId,
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true,
      },
    })

    return audio
  } catch (error) {
    console.error("Error generating speech:", error)
    throw error
  }
}

export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const voices = await elevenlabs.voices.getAll()
    return voices.voices.map((voice) => ({
      voice_id: voice.voice_id,
      name: voice.name,
      category: voice.category || "general",
      description: voice.description || "",
      preview_url: voice.preview_url,
    }))
  } catch (error) {
    console.error("Error fetching voices:", error)
    return []
  }
}
