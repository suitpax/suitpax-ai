import { ElevenLabsApi } from "elevenlabs"

function getClient() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not set")
  }
  return new ElevenLabsApi({ apiKey })
}

export interface Voice {
  voice_id: string
  name: string
  category: string
  description: string
  preview_url?: string
}

export const ELEVENLABS_VOICES = {
  EMMA: "EXAVITQu4vr4xnSDxMaL",
  MARCUS: "VR6AewLTigWG4xSOukaG",
  SOPHIA: "21m00Tcm4TlvDq8ikWAM",
  ALEX: "29vD33N1CtxCmqQRPOHJ",
  MICHAEL: "CYw3kZ02Hs0563khs1fj",
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
  const elevenlabs = getClient()
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
}

export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const elevenlabs = getClient()
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
