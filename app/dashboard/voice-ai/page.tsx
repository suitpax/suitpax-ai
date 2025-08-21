"use client"

import { useState, useEffect } from "react"
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

function VoiceAIContent() {
  const [user, setUser] = useState(null)
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
      const response = await fetch("/api/suitpax-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: user.id }),
      })
      const data = await response.json()
      setAiResponse(data.response)

      if (voiceSettings.autoSpeak && data.response) await speak(data.response)

      const newConversation = {
        id: Date.now(),
        message,
        response: data.response,
        timestamp: new Date().toISOString(),
        memoriesUsed: data.memoriesUsed || [],
        knowledgeUsed: data.knowledgeUsed || [],
      }
      setConversations((prev) => [newConversation, ...prev])

      // Simple intent: if user mentions flight booking/search, try to extract route and date and navigate to Flights
      const intent = /\b(flight|flights|book|search)\b/i.test(message)
      if (intent) {
        // naive extract IATA like ABC or patterns "MAD" "LHR" and an ISO date
        const iatas = (message.match(/\b([A-Z]{3})\b/g) || []).slice(0, 2)
        const dateMatch = message.match(/\b(\d{4}-\d{2}-\d{2})\b/)
        const params = new URLSearchParams()
        if (iatas[0]) params.set('origin', iatas[0])
        if (iatas[1]) params.set('destination', iatas[1])
        if (dateMatch) params.set('date', dateMatch[1])
        params.set('autosearch', '1')
        window.location.href = `/dashboard/flights?${params.toString()}`
      }
    } catch (error) {
      console.error("Error processing voice message:", error)
      setAiResponse("Sorry, I encountered an error processing your request.")
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
    <div className="min-h-screen bg-gray-50 p-6">
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
            <p className="text-lg font-light text-gray-600">
              {getGreeting()}, {getDisplayName().split(" ")[0]}! Ready to help with your business needs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-2xl bg-white/80 backdrop-blur-sm border-gray-200"
              onClick={() => updateSettings({ autoSpeak: !voiceSettings.autoSpeak })}
            >
              {voiceSettings.autoSpeak ? "Auto-speak: On" : "Auto-speak: Off"}
            </Button>
          </div>
        </motion.div>

        {/* Animated Sparkles + Wave badge replacing black orb */}
        <div className="flex justify-center">
          <div className="relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 flex items-center gap-2 shadow-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-800">{isRecording ? "Listening" : voiceState.isSpeaking ? "Speaking" : "Ready"}</span>
              <span className="text-xs text-gray-500">Wave • Sparkles</span>
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
            <div className="min-h-[72px] rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
              {currentTranscript || (isProcessing ? "Processing…" : "Start talking to begin a conversation")}
            </div>
            {currentError && <div className="mt-2 text-xs text-red-600">{String(currentError)}</div>}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Response</div>
            <div className="min-h-[72px] rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
              {aiResponse || "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-700 mb-2">Quick actions</div>
            <div className="flex flex-wrap gap-2">
              {[
                "Find flights MAD → SFO tomorrow",
                "Summarize this meeting",
                "Create expense for Uber 35€",
              ].map((q) => (
                <Button key={q} variant="outline" className="rounded-xl" onClick={() => handleProcessMessage(q)}>
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={handleStartRecording} className="rounded-2xl px-6">
            {isRecording ? "Stop" : "Start"}
          </Button>
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
    <VoiceAIProvider>
      <VoiceAIContent />
    </VoiceAIProvider>
  )
}