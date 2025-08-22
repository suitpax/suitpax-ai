import type { LanguageCode } from "../types"

export type TTSEngine = "elevenlabs" | "webspeech"

export interface TTSOptions {
  engine: TTSEngine
  language: LanguageCode
  voiceId?: string
  volume?: number
}

export async function synthesizeText(text: string, opts: TTSOptions): Promise<void> {
  if (!text.trim()) return
  if (opts.engine === "elevenlabs") {
    try {
      const res = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: opts.voiceId, language: opts.language }),
      })
      if (!res.ok) throw new Error("elevenlabs request failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      if (typeof opts.volume === "number") audio.volume = opts.volume
      await audio.play()
      return
    } catch {
      // fallthrough to webspeech
    }
  }

  // Web Speech fallback
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = opts.language
    if (typeof opts.volume === "number") utterance.volume = opts.volume
    window.speechSynthesis.speak(utterance)
  }
}