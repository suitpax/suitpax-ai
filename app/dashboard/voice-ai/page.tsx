"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  Settings,
  Filter,
  MicIcon,
  Volume2,
  Pause,
  MessageSquare,
  Zap,
  Brain,
  Headphones,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
const Loader = dynamic(() => import("@/components/prompt-kit/loader").then(m => m.Loader), { ssr: false })
import { Progress } from "@/components/ui/progress"
import { VoiceAIProvider, useVoiceAI } from "@/contexts/voice-ai-context"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import MiniCountdownBadge from "@/components/ui/mini-countdown"
// Vanta removed elsewhere; keep here if desired, otherwise consider static backgrounds for performance
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { AgentSelectorInline } from "@/components/prompt-kit/agent-selector"
import { VoiceLevelsMeter } from "@/components/voice-ai/voice-levels-meter"
import { RecorderButton } from "@/components/voice-ai/recorder-button"
import { WaveformVisualizer } from "@/components/voice-ai/waveform-visualizer"
import { TranscriptPanel } from "@/components/voice-ai/transcript-panel"
import { ResponsePanel } from "@/components/voice-ai/response-panel"
import { CommandChips } from "@/components/voice-ai/command-chips"
import { routeVoiceQuery } from "@/lib/voice-ai/router"

function VoiceAIContent() {
  const [user, setUser] = useState<any>(null)
  const {
    state: voiceState,
    settings: voiceSettings,
    startListening: startVoiceListening,
    stopListening: stopVoiceListening,
    speak,
    cancelSpeech,
    setVoice,
    updateSettings,
    clearTranscript,
  } = useVoiceAI()

  const {
    isListening: speechIsListening,
    transcript: speechTranscript,
    error: speechError,
    startListening: startSpeechListening,
    stopListening: stopSpeechListening,
    resetTranscript,
  } = useSpeechToText({
    continuous: true,
    interimResults: true,
    language: voiceSettings.language,
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        setCurrentMessage(transcript)
      }
    },
    onEnd: async (finalTranscript) => {
      if (finalTranscript.trim()) {
        await handleProcessMessage(finalTranscript)
      }
    },
  })

  const [currentMessage, setCurrentMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [conversations, setConversations] = useState<any[]>([])
  const [userPreferences, setUserPreferences] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
        if (profile) setUser({ ...user, profile })
      }
    }
    getUser()

    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [supabase])

  // Autostart listening when ?autostart=1 and route from intent to Flights
  useEffect(() => {
    const url = new URL(window.location.href)
    const auto = url.searchParams.get('autostart') === '1'
    if (auto) {
      handleStartRecording()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/preferences?userId=${user.id}`)
          const data = await response.json()
          setUserPreferences(data.preferences || [])
        } catch (error) {
          console.error("Error loading preferences:", error)
        }
      }
    }
    loadUserPreferences()
  }, [user])

  const [currentTime, setCurrentTime] = useState(new Date())

  const getDisplayName = () => {
    if (!user) return "User"
    return user.profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleProcessMessage = async (message: string) => {
    if (!user || !message.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: [], agent: undefined }),
      })

      if (!response.ok) {
        let errText = "Sorry, I encountered an error processing your request."
        try {
          const errData = await response.json()
          errText = errData?.details?.message || errData?.error || errText
        } catch {}
        setAiResponse(errText)
      } else {
        const data = await response.json()
        const text = typeof data.response === "string" ? data.response : ""
        setAiResponse(text)
        if (voiceSettings.autoSpeak && text) await speak(text)

        const newConversation = {
          id: Date.now(),
          message,
          response: text,
          timestamp: new Date().toISOString(),
          memoriesUsed: data.memoriesUsed || [],
          knowledgeUsed: data.knowledgeUsed || [],
        }
        setConversations((prev) => [newConversation, ...prev])

        // Simple intent: if user mentions flight booking/search, try to extract route and date and navigate to Flights
        const intent = /\b(flight|flights|book|search)\b/i.test(message)
        if (intent) {
          const iatas = (message.match(/\b([A-Z]{3})\b/g) || []).slice(0, 2)
          const dateMatch = message.match(/\b(\d{4}-\d{2}-\d{2})\b/)
          const params = new URLSearchParams()
          if (iatas[0]) params.set('origin', iatas[0])
          if (iatas[1]) params.set('destination', iatas[1])
          if (dateMatch) params.set('date', dateMatch[1])
          params.set('autosearch', '1')
          window.location.href = `/dashboard/flights?${params.toString()}`
        }
      }
    } catch (error) {
      console.error("Error processing voice message:", error)
      setAiResponse("Sorry, I encountered a network error. Please try again.")
    } finally {
      setIsProcessing(false)
      setCurrentMessage("")
      resetTranscript()
    }
  }

  const handleStartRecording = async () => {
    if (!user) return

    if (speechIsListening || voiceState.isListening) {
      stopSpeechListening()
      stopVoiceListening()
      cancelSpeech()
    } else {
      clearTranscript()
      resetTranscript()
      setCurrentMessage("")
      setAiResponse("")
      try {
        await startSpeechListening()
      } catch {
        await startVoiceListening()
      }
    }
  }

  // Remote transcription with Whisper when local recognition ends and we have a blob
  const mediaBlobRef = useRef<Blob | null>(null)
  useEffect(() => {
    // hook into our recorder if it exposes blobs; otherwise skip
    // assume RecorderButton dispatches a 'voice-recording-stopped' with detail { blob }
    const onStopped = async (e: any) => {
      try {
        const blob = e?.detail?.blob as Blob | undefined
        if (!blob) return
        mediaBlobRef.current = blob
        const fd = new FormData()
        fd.append("audio", blob, "audio.webm")
        const res = await fetch("/api/elevenlabs/speech-to-text", { method: "POST", body: fd })
        if (res.ok) {
          const json = await res.json()
          const text = json?.text || ""
          if (text) {
            setCurrentMessage(text)
            await handleProcessMessage(text)
          }
        }
      } catch (err) {
        console.error("Remote transcription failed", err)
      }
    }
    window.addEventListener("voice-recording-stopped", onStopped as any)
    return () => window.removeEventListener("voice-recording-stopped", onStopped as any)
  }, [handleProcessMessage])

  const handleVoiceChange = (voiceId: string) => setVoice(voiceId)
  const handleLanguageChange = (language: "en-US" | "es-ES" | "fr-FR" | "de-DE") => updateSettings({ language })

  const isRecording = speechIsListening || voiceState.isListening
  const currentTranscript = speechTranscript || voiceState.transcript || currentMessage
  const currentError = speechError || voiceState.error

  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-gray-900 mb-2">
              Voice AI Assistant
            </h1>
            <p className="text-lg font-light text-gray-300">
              {getGreeting()}, {getDisplayName().split(" ")[0]}! Ready to help with your business needs.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-2">
              <span className="inline-block text-xs font-medium bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent animate-hero-shimmer">Crystal-clear voice understanding</span>
              <span className="inline-block text-xs font-medium bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent animate-hero-shimmer">Instant actions for travel and ops</span>
            </div>
            <style jsx>{`
              @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
              :global(.animate-hero-shimmer) { animation: shimmer 2.8s linear infinite; background-size: 200% 100%; }
            `}</style>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden md:block min-w-[240px]">
              <AgentSelectorInline />
            </div>
            <div className="flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64 rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Animated Sparkles + Wave badge replacing black orb */}
        <div className="flex justify-center">
          <div className="relative flex flex-col items-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="flex items-center justify-center">
                <div className="opacity-90">
                  <div className="relative">
                    {/* Dark halo orb */}
                    <div className="absolute inset-0 -z-10 flex items-center justify-center">
                      {/* decorative orb */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 flex items-center gap-2 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-white/90">{isRecording ? "Listening" : voiceState.isSpeaking ? "Speaking" : "Ready"}</span>
                <span className="text-xs text-white/60">Halo • Vanta</span>
              </div>
            </motion.div>
            <div className="mt-2 flex justify-center">
              <MiniCountdownBadge target={new Date('2025-10-21T00:00:00Z')} title="Suitpax Launch" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Transcript</div>
            <TranscriptPanel text={currentTranscript || (isProcessing ? "Processing…" : "")} />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Response</div>
            <ResponsePanel text={aiResponse} />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Quick actions</div>
            <CommandChips items={["Find flights MAD → SFO tomorrow", "Summarize this meeting", "Create expense for Uber 35€"]} onPick={(q) => handleProcessMessage(q)} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <RecorderButton recording={isRecording} onClick={handleStartRecording} />
          <Button variant="outline" className="rounded-2xl" onClick={() => handleProcessMessage(currentTranscript || currentMessage)} disabled={!currentTranscript && !currentMessage}>
            Send transcript
          </Button>
          <div className="relative">
            <input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your question to Voice AI"
              className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 w-64"
            />
            <Button size="sm" className="absolute right-1 top-1 rounded-xl h-7 px-3" onClick={() => handleProcessMessage(currentMessage)} disabled={!currentMessage.trim()}>
              Send
            </Button>
          </div>
          <Button variant="outline" className="rounded-2xl" onClick={() => setAiResponse("")}>Clear</Button>
        </div>

      </div>
    </div>
  )
}

export default function VoiceAIPage() {
  return (
    <VantaHaloBackground className="bg-black/8">
      <VoiceAIContent />
    </VantaHaloBackground>
  )
}