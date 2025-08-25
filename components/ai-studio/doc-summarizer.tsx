"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DocSummarizer() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [audioUrl, setAudioUrl] = useState<string>("")

  const handleUpload = async () => {
    if (!file) return
    const text = `Summary of ${file.name}: ...` // TODO: integrate real OCR/PDF pipeline
    setSummary(text)
    const r = await fetch('/api/voice-ai/google/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    const blob = await r.blob()
    setAudioUrl(URL.createObjectURL(blob))
  }

  return (
    <Card><CardContent className="p-3 space-y-3">
      <div className="text-sm text-gray-900 font-medium">Document Summarizer</div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button className="rounded-2xl" onClick={handleUpload} disabled={!file}>Generate Summary & Voice</Button>
      {summary && <div className="text-sm text-gray-800 whitespace-pre-wrap border-t pt-2">{summary}</div>}
      {audioUrl && <audio controls src={audioUrl} className="w-full" />}
    </CardContent></Card>
  )
}

