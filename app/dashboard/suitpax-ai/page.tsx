"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AgenticVoice from "@/components/ai-studio/agentic-voice"

export default function SuitpaxAIRebuilt() {
  const [query, setQuery] = useState("")
  const [answer, setAnswer] = useState("")
  const ask = async () => {
    const res = await fetch('/api/notebook/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: query }) })
    const data = await res.json().catch(()=>({}))
    setAnswer(data.text || '')
  }
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Suitpax AI</h1>
        <p className="text-gray-600 font-light">Unified agentic interface for travel, policy, and finance</p>
      </div>
      <Card><CardContent className="p-3 space-y-3">
        <textarea value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full min-h-[120px] rounded-xl border-gray-300" placeholder="Ask Suitpax AI..." />
        <Button className="rounded-2xl" onClick={ask}>Ask</Button>
        {answer && <div className="text-sm text-gray-900 border-t pt-2 whitespace-pre-wrap">{answer}</div>}
      </CardContent></Card>
      <AgenticVoice />
    </div>
  )
}

