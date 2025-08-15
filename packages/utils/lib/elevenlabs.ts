import { ElevenLabs } from "elevenlabs"

const apiKey = process.env.ELEVENLABS_API_KEY

if (!apiKey) {
  throw new Error("ELEVENLABS_API_KEY is not set")
}

const elevenlabs = new ElevenLabs({
  apiKey,
})

export interface Voice {
  voice_id: string
  name: string
  category: string
  description: string
  preview_url?: string
}

export const ELEVENLABS_VOICES = {
  EMMA: "EXAVITQu4vr4xnSDxMaL", // Sarah - Professional female
  MARCUS: "VR6AewLTigWG4xSOukaG", // Josh - Professional male
  SOPHIA: "21m00Tcm4TlvDq8ikWAM", // Rachel - Elegant female
  ALEX: "29vD33N1CtxCmqQRPOHJ", // Drew - Tech-savvy male
  MICHAEL: "CYw3kZ02Hs0563khs1fj", // Antoni - Versatile male
}

export const AGENT_VOICES: Record<string, Voice> = {
  emma: {
    voice_id: ELEVENLABS_VOICES.EMMA,
    name: "Sarah",
    category: "professional",
    description: "Warm, professional female voice perfect for executive assistance",
  },
  marcus: {
    voice_id: ELEVENLABS_VOICES.MARCUS,
    name: "Josh",
    category: "professional",
    description: "Authoritative, clear male voice ideal for corporate communication",
  },
  sophia: {
    voice_id: ELEVENLABS_VOICES.SOPHIA,
    name: "Rachel",
    category: "elegant",
    description: "Sophisticated female voice perfect for luxury services",
  },
  alex: {
    voice_id: ELEVENLABS_VOICES.ALEX,
    name: "Drew",
    category: "modern",
    description: "Contemporary male voice ideal for tech-focused interactions",
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
