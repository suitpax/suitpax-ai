"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type VoiceMessage = { id: string; role: "user" | "assistant"; text: string; at: Date }

export type VoiceStatus = "idle" | "listening" | "processing" | "playing"

export function useVoice() {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [transcript, setTranscript] = useState("")
  const [status, setStatus] = useState<VoiceStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = "en-US"
    rec.interimResults = true
    rec.continuous = true
    rec.onresult = (e: any) => {
      let text = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript
      }
      setTranscript(text.trim())
    }
    rec.onerror = (e: any) => { setError(e?.error || "speech error"); setStatus("idle") }
    recognitionRef.current = rec
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setError(null)
    setStatus("listening")
    try { recognitionRef.current.start() } catch {}
  }, [])

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop() } catch {}
    setStatus("idle")
  }, [])

  const clearConversation = useCallback(() => {
    setMessages([])
    setTranscript("")
    setStatus("idle")
  }, [])

  const sendTranscript = useCallback(async (voiceId?: string) => {
    const content = transcript.trim()
    if (!content) return
    const userMsg: VoiceMessage = { id: `${Date.now()}`, role: "user", text: content, at: new Date() }
    setMessages(prev => [...prev, userMsg])
    setStatus("processing")
    try {
      const conv = await fetch("/api/voice-ai/conversation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript: content }) })
      const data = await conv.json()
      const answer = (data?.response || "").toString()
      const aiMsg: VoiceMessage = { id: `${Date.now()+1}`, role: "assistant", text: answer, at: new Date() }
      setMessages(prev => [...prev, aiMsg])
      setStatus("playing")
      if (answer && voiceId) {
        const tts = await fetch("/api/elevenlabs/text-to-speech", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: answer, voiceId }) })
        if (tts.ok) {
          const blob = await tts.blob()
          const url = URL.createObjectURL(blob)
          if (!audioRef.current) audioRef.current = new Audio()
          audioRef.current.src = url
          await audioRef.current.play()
        }
      }
    } catch (e: any) {
      setError(e?.message || "voice error")
    } finally {
      setTranscript("")
      setStatus("idle")
    }
  }, [transcript])

  const play = useCallback(() => { try { audioRef.current?.play(); setStatus("playing") } catch {} }, [])
  const pause = useCallback(() => { try { audioRef.current?.pause(); setStatus("idle") } catch {} }, [])

  return { messages, transcript, status, error, audioRef, startListening, stopListening, clearConversation, sendTranscript, play, pause }
}

