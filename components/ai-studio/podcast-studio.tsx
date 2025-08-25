"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PodcastStudio() {
  const [script, setScript] = useState("Welcome to Suitpax AI podcast...")
  const [audioUrl, setAudioUrl] = useState<string>("")
  const synth = async () => {
    const r = await fetch('/api/voice-ai/google/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: script }) })
    const blob = await r.blob()
    setAudioUrl(URL.createObjectURL(blob))
  }
  return (
    <Card><CardContent className="p-3 space-y-3">
      <div className="text-sm text-gray-900 font-medium">Podcast Generator</div>
      <textarea value={script} onChange={(e)=>setScript(e.target.value)} className="w-full min-h-[160px] rounded-xl border-gray-300" />
      <div className="flex gap-2">
        <Button className="rounded-2xl" onClick={synth}>Synthesize</Button>
        {audioUrl && <audio controls src={audioUrl} className="w-full" />}
      </div>
    </CardContent></Card>
  )
}

