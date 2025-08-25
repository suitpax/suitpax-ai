"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function VoiceAIPage() {
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [voiceId, setVoiceId] = useState<string>("")
  useEffect(() => {
    // pick the first available ElevenLabs voice as default
    const load = async () => {
      try {
        const r = await fetch('/api/elevenlabs/voices')
        const j = await r.json()
        const v = j?.voices?.[0]?.id
        if (v) setVoiceId(v)
      } catch {}
    }
    load()
  }, [])

  const talk = async () => {
    const r = await fetch('/api/voice-ai/conversation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transcript }) })
    const data = await r.json()
    setResponse(data.response || '')
    // speak via ElevenLabs
    if (data.response && voiceId) {
      const tts = await fetch('/api/elevenlabs/text-to-speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: data.response, voiceId }) })
      if (tts.ok) {
        const blob = await tts.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.play()
      }
    }
  }
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Voice</h1>
        <p className="text-gray-600 font-light">Talk with agents; natural voice via Google/ElevenLabs</p>
      </div>
      <Card><CardContent className="p-3 space-y-3">
        <textarea value={transcript} onChange={(e)=>setTranscript(e.target.value)} className="w-full min-h-[120px] rounded-xl border-gray-300" placeholder="Say something..." />
        <Button className="rounded-2xl" onClick={talk}>Send</Button>
        {response && <div className="text-sm text-gray-900 border-t pt-2">{response}</div>}
      </CardContent></Card>
    </div>
  )
}

