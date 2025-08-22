"use client"

import { useEffect, useState } from "react"
import { AgentCard } from "./agent-card"
import { DEFAULT_AGENTS } from "@/lib/voice-ai/prompts"
import type { AgentId } from "@/lib/voice-ai/types"
import { useVoiceAI } from "@/contexts/voice-ai-context"

export function AgentSelector({ className = "" }: { className?: string }) {
  const { setVoice, setLanguage, updateSettings } = useVoiceAI()
  const [selected, setSelected] = useState<AgentId>(() => (typeof window !== "undefined" ? (localStorage.getItem("voiceAgent") as AgentId) : "female_pro") || "female_pro")

  useEffect(() => {
    const agent = DEFAULT_AGENTS.find((a) => a.id === selected) || DEFAULT_AGENTS[0]
    setVoice(agent.voiceId)
    setLanguage(agent.language)
    updateSettings({ autoSpeak: true })
    if (typeof window !== "undefined") localStorage.setItem("voiceAgent", agent.id)
  }, [selected, setLanguage, setVoice, updateSettings])

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3">
        {DEFAULT_AGENTS.map((a) => (
          <AgentCard key={a.id} agent={a} selected={a.id === selected} onSelect={(id) => setSelected(id as AgentId)} />
        ))}
      </div>
    </div>
  )
}