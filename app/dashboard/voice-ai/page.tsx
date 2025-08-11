"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiPhoneFill,
  PiStarFill,
  PiClockBold,
  PiChatCircleFill,
  PiGlobeSimpleBold,
  PiWaveformBold,
  PiUserSwitchBold,
  PiHeadsetBold,
} from "react-icons/pi"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useVoiceAIConsolidated } from "@/hooks/use-voice-ai-consolidated"
import { ConversationInterface } from "@/components/voice-ai/conversation-interface"
import { AgentCard } from "@/components/shared/agent-card"

// Agentes demo
const voiceAgents = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Assistant",
    image: "/agents/agent-emma.jpeg",
    rating: 4.9,
    callsToday: 47,
    languages: ["English", "Spanish", "French"],
    specialty: "Flight booking & luxury travel",
    accent: "American",
    voice: "Professional, warm, efficient",
    status: "available" as const,
  },
  {
    id: "liam",
    name: "Liam",
    role: "Corporate Expense Analyst",
    image: "/agents/agent-2.png",
    rating: 4.8,
    callsToday: 32,
    languages: ["English", "German"],
    specialty: "Expense optimization & policy",
    accent: "British",
    voice: "Confident, analytical",
    status: "available" as const,
  },
  {
    id: "sofia",
    name: "Sofia",
    role: "Meetings Coordinator",
    image: "/agents/agent-5.png",
    rating: 4.7,
    callsToday: 26,
    languages: ["Spanish", "English", "Portuguese"],
    specialty: "Scheduling & logistics",
    accent: "Iberian",
    voice: "Warm, pragmatic",
    status: "busy" as const,
  },
]

interface CallLogItem {
  id: string
  agentId: string
  agentName: string
  startedAt: string
  durationSec: number
}

const TEMPLATES = [
  "Find me a direct business class flight to Tokyo next Tuesday",
  "Book a 5-star hotel near La Défense in Paris for 2 nights",
  "Create an expense report for last week and check policy compliance",
  "Schedule a meeting with the London team next Thursday at 10am",
]

export default function VoiceAIPage() {
  const [selectedAgent, setSelectedAgent] = useState(voiceAgents[0])
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [userTokens, setUserTokens] = useState({ used: 0, limit: 5000 })
  const [user, setUser] = useState<any>(null)
  const [callLogs, setCallLogs] = useState<CallLogItem[]>([])
  const [callStartTs, setCallStartTs] = useState<number | null>(null)

  const supabase = createClient()

  const {
    messages,
    status,
    transcript,
    audioState,
    error,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    startConversation,
    clearConversation,
    playMessage,
    pauseAudio,
    audioPlayerRef,
  } = useVoiceAIConsolidated({
    agentId: selectedAgent.id,
    onMessage: () => {},
    onError: (error) => {
      console.error("Voice AI Error:", error)
    },
    onStatusChange: () => {},
  })

  useEffect(() => {
    fetchUserData()
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("voice_ai_call_logs") : null
    setCallLogs(raw ? JSON.parse(raw) : [])
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCallActive])

  async function fetchUserData() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { data: userData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
        if (userData) {
          setUser(userData)
          setUserTokens({ used: userData.ai_tokens_used || 0, limit: userData.ai_tokens_limit || 5000 })
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  async function startCall() {
    setIsCallActive(true)
    setCallStartTs(Date.now())
    clearConversation()
    await startConversation()
  }

  function endCall() {
    setIsCallActive(false)
    clearConversation()
    if (callStartTs) {
      const item: CallLogItem = {
        id: crypto.randomUUID(),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        startedAt: new Date(callStartTs).toISOString(),
        durationSec: Math.max(0, Math.floor((Date.now() - callStartTs) / 1000)),
      }
      const updated = [item, ...callLogs].slice(0, 20)
      setCallLogs(updated)
      if (typeof window !== "undefined") {
        window.localStorage.setItem("voice_ai_call_logs", JSON.stringify(updated))
      }
      setCallStartTs(null)
    }
  }

  function formatCallDuration(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const usagePct = userTokens.limit ? Math.min(100, Math.round((userTokens.used / userTokens.limit) * 100)) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Voice AI Agents</h1>
          <p className="text-gray-600 mt-1">Have natural voice conversations with specialized AI travel agents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-gray-50">
            Tokens: {userTokens.used.toLocaleString()}/{userTokens.limit.toLocaleString()} ({usagePct}%)
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <PiChatCircleFill className="h-3 w-3 mr-1" /> Voice Ready
          </Badge>
        </div>
      </div>

      {/* Top grid: Agents + Voice Interface + Usage/History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-medium tracking-tighter">Choose Your AI Agent</CardTitle>
                <CardDescription>Select a specialized agent for your business travel needs</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <PiUserSwitchBold className="w-4 h-4" />
                <span>{voiceAgents.filter((a) => a.status === "available").length} available</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {voiceAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onSelect={setSelectedAgent}
                  isSelected={selectedAgent.id === agent.id}
                  showDetails={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage + History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg tracking-tight flex items-center gap-2">
              <PiHeadsetBold className="w-4 h-4" /> Usage & History
            </CardTitle>
            <CardDescription>Your recent activity and token usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Token usage</span>
                <span>
                  {userTokens.used.toLocaleString()} / {userTokens.limit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900" style={{ width: `${usagePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-700">Recent calls</h4>
                {callLogs.length > 0 && (
                  <button
                    className="text-[10px] text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setCallLogs([])
                      if (typeof window !== "undefined") window.localStorage.removeItem("voice_ai_call_logs")
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {callLogs.length === 0 ? (
                  <p className="text-xs text-gray-500">No recent calls</p>
                ) : (
                  callLogs.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
                      <span className="font-medium text-gray-900">{c.agentName}</span>
                      <span className="text-gray-500">{new Date(c.startedAt).toLocaleString()}</span>
                      <span className="text-gray-700">{formatCallDuration(c.durationSec)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={selectedAgent.image || "/placeholder.svg"} alt={selectedAgent.name} width={40} height={40} className="rounded-xl object-cover" />
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter">{selectedAgent.name}</CardTitle>
                <CardDescription>{selectedAgent.role}</CardDescription>
              </div>
            </div>
            {isCallActive && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <PiClockBold className="w-4 h-4" />
                  <span>{formatCallDuration(callDuration)}</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                  Live
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {isCallActive ? (
              <motion.div key="active-call" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ConversationInterface
                  messages={messages}
                  status={status}
                  transcript={transcript}
                  agentName={selectedAgent.name}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  onEndCall={endCall}
                  onPlayMessage={playMessage}
                  onPauseAudio={pauseAudio}
                  error={error}
                  isAudioPlaying={audioState.isPlaying}
                />
              </motion.div>
            ) : (
              <motion.div key="call-setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                <div className="mb-6">
                  <Image src={selectedAgent.image || "/placeholder.svg"} alt={selectedAgent.name} width={80} height={80} className="rounded-xl object-cover mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedAgent.role}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <PiStarFill className="w-3 h-3 text-yellow-500" />
                      <span>{selectedAgent.rating} rating</span>
                    </div>
                    <span>•</span>
                    <span>{selectedAgent.callsToday} calls today</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                    {selectedAgent.voice} voice with {selectedAgent.accent} accent. Specializes in {selectedAgent.specialty.toLowerCase()}.
                  </p>
                </div>

                <Button onClick={startCall} size="lg" className="bg-black text-white hover:bg-gray-800" disabled={!browserSupportsSpeechRecognition}>
                  <PiPhoneFill className="w-5 h-5 mr-2" /> Start Voice Conversation
                </Button>

                {!browserSupportsSpeechRecognition && (
                  <p className="text-xs text-red-500 mt-2">Speech recognition not supported in this browser</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Features + Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiChatCircleFill className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Natural Conversation</h3>
            <p className="text-sm text-gray-600">AI agents understand context and maintain natural dialogue flow</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiGlobeSimpleBold className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Multi-language Support</h3>
            <p className="text-sm text-gray-600">Automatic language detection with support for 40+ languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiWaveformBold className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Realistic Voices</h3>
            <p className="text-sm text-gray-600">Powered by ElevenLabs for human-like speech synthesis</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Quick templates</CardTitle>
          <CardDescription>Use a starting phrase once the call begins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t}
                className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
                onClick={() => {
                  if (!isCallActive) return
                  // Placeholder: templates for guidance while on a call
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element */}
      <audio ref={audioPlayerRef} className="hidden" />
    </div>
  )
}
