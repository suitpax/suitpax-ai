"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AgenticVoice() {
  const [dialogue, setDialogue] = useState(
    `R: I've heard Suitpax Agentic Voice sounds amazing!\nS: Oh? What's so good about it?\nR: It can narrate and converse about Suitpax features.\nS: Let's try it!`
  )
  const [audioUrl, setAudioUrl] = useState<string>("")

  const synth = async () => {
    const r = await fetch('/api/voice-ai/google/tts-multispeaker', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dialogue }) })
    if (!r.ok) { return }
    const blob = await r.blob()
    setAudioUrl(URL.createObjectURL(blob))
  }

  return (
    <Card><CardContent className="p-3 space-y-3">
      <div className="text-sm text-gray-900 font-medium">Agentic Voice (Multi‑speaker)</div>
      <p className="text-xs text-gray-600">Use labels R/S to mark speakers. Voice: en-US-Studio-Multispeaker (experimental)</p>
      <textarea value={dialogue} onChange={(e)=>setDialogue(e.target.value)} className="w-full min-h-[160px] rounded-xl border-gray-300" />
      <div className="flex gap-2 items-center">
        <Button className="rounded-2xl" onClick={synth}>Generate Dialogue</Button>
        {audioUrl && <audio controls src={audioUrl} className="w-full" />}
      </div>
    </CardContent></Card>
  )
}

