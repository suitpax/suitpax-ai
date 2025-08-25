"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PiChatCircleFill, PiUserSwitchBold, PiClockBold, PiPhoneFill, PiStarFill } from "react-icons/pi"
import VoiceConversation from "@/components/voice-ai/voice-conversation"
import { AgentCard } from "@/components/shared/agent-card"
import Image from "next/image"

const voiceAgents = [
  { id: "emma", name: "Emma", role: "Executive Travel Assistant", image: "/agents/agent-emma.jpeg", rating: 4.9, callsToday: 47, languages: ["English","Spanish","French"], specialty: "Flight booking & luxury travel", accent: "American", voice: "Professional, warm, efficient", status: "available" as const },
]

export default function VoiceAIPage() {
  const [selected, setSelected] = useState(voiceAgents[0])
  const [voiceId, setVoiceId] = useState<string>("")
  const [callActive, setCallActive] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)

  useEffect(() => {
    const load = async () => {
      try { const r = await fetch('/api/elevenlabs/voices'); const j = await r.json(); const v = j?.voices?.[0]?.id; if (v) setVoiceId(v) } catch {}
    }
    load()
  }, [])

  useEffect(() => {
    let t: any
    if (callActive) t = setInterval(() => setCallSeconds((s) => s + 1), 1000)
    return () => { if (t) clearInterval(t) }
  }, [callActive])

  const mmss = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black">Voice AI Agents</h1>
          <p className="text-gray-600 mt-1">Natural voice conversations with specialized travel agents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-gray-50">Tokens: 0/5000</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><PiChatCircleFill className="h-3 w-3 mr-1" />Voice Ready</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-medium tracking-tighter">Choose Your AI Agent</CardTitle>
              <CardDescription>Select a specialized agent for your business travel needs</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500"><PiUserSwitchBold className="w-4 h-4" /><span>1 available</span></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {voiceAgents.map((a) => (
              <AgentCard key={a.id} agent={a as any} onSelect={setSelected as any} isSelected={selected.id === a.id} showDetails />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={selected.image} alt={selected.name} width={40} height={40} className="rounded-xl object-cover" />
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter">{selected.name}</CardTitle>
                <CardDescription>{selected.role}</CardDescription>
              </div>
            </div>
            {callActive && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1"><PiClockBold className="w-4 h-4" /><span>{mmss(callSeconds)}</span></div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />Live</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!callActive ? (
            <div className="text-center py-8">
              <Image src={selected.image} alt={selected.name} width={80} height={80} className="rounded-xl object-cover mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{selected.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selected.role}</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1"><PiStarFill className="w-3 h-3 text-yellow-500" /><span>{selected.rating} rating</span></div>
                <span>•</span>
                <span>{selected.callsToday} calls today</span>
              </div>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">{selected.voice} voice with {selected.accent} accent. Specializes in {selected.specialty.toLowerCase()}.</p>
              <Button onClick={() => setCallActive(true)} size="lg" className="bg-black text-white hover:bg-gray-800" disabled={false}><PiPhoneFill className="w-5 h-5 mr-2" />Start Voice Conversation</Button>
            </div>
          ) : (
            <VoiceConversation voiceId={voiceId} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

