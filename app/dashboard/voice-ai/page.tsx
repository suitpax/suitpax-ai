"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  BarChart3,
  Clock,
  Settings,
  Filter,
  MicIcon,
  Volume2,
  MessageSquare,
  Zap,
  Brain,
  Headphones,
  Square,
  RotateCcw,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useVoiceAI } from "@/contexts/voice-ai-context"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import Image from "next/image"

export default function VoiceAIPage() {
  const [user, setUser] = useState(null)
  const {
    state: voiceState,
    settings: voiceSettings,
    startListening: startVoiceListening,
    stopListening: stopVoiceListening,
    speak,
    cancelSpeech,
    setVoice,
    setLanguage,
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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
        if (profile) {
          setUser({ ...user, profile })
        }
      }
    }
    getUser()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [supabase])

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/suitpax-ai?userId=${user.id}`)
          const data = await response.json()
          setUserPreferences(data.preferences || [])
        } catch (error) {
          console.error("Error loading preferences:", error)
        }
      }
    }
    loadUserPreferences()
  }, [user])

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
      const response = await fetch("/api/voice-ai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          userId: user.id,
          context: "voice_assistant",
        }),
      })

      const data = await response.json()
      setAiResponse(data.response)

      if (voiceSettings.autoSpeak && data.response) {
        await speak(data.response)
      }

      const newConversation = {
        id: Date.now(),
        message,
        response: data.response,
        timestamp: new Date().toISOString(),
        memoriesUsed: data.memoriesUsed || [],
        knowledgeUsed: data.knowledgeUsed || [],
      }
      setConversations((prev) => [newConversation, ...prev])
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
      } catch (error) {
        console.log("Fallback to voice AI context")
        await startVoiceListening()
      }
    }
  }

  const isRecording = speechIsListening || voiceState.isListening
  const currentTranscript = speechTranscript || voiceState.transcript || currentMessage
  const currentError = speechError || voiceState.error

  const filteredConversations = conversations.filter((conv) =>
    conv.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <VantaHaloBackground className="fixed inset-0">
      <div className="absolute inset-0 bg-white/70 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Voice AI"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-gray-900 mb-2">
                  Voice AI Assistant
                </h1>
                <p className="text-lg font-light text-gray-600">
                  {getGreeting()}, {getDisplayName().split(" ")[0]}! Ready to help with your business needs.
                </p>
              </div>
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
                size="icon"
                className="rounded-2xl bg-white/80 backdrop-blur-sm border-gray-200"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-[10px] font-medium">
                  CONVERSATIONS
                </Badge>
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-medium tracking-tighter text-gray-900">0</p>
                <p className="text-xs font-light text-gray-600">Total voice chats</p>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">No conversations yet</span>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-[10px] font-medium">
                  VOICE TIME
                </Badge>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-medium tracking-tighter text-gray-900">0h</p>
                <p className="text-xs font-light text-gray-600">Total speaking time</p>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">This month</span>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-[10px] font-medium">
                  AI RESPONSES
                </Badge>
                <Brain className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-medium tracking-tighter text-gray-900">0</p>
                <p className="text-xs font-light text-gray-600">Generated responses</p>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">Ready to start</span>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-[10px] font-medium">
                  VOICE QUALITY
                </Badge>
                <Volume2 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-medium tracking-tighter text-gray-900">HD</p>
                <p className="text-xs font-light text-gray-600">Audio quality</p>
              </div>
              <div className="flex items-center mt-3">
                <Progress value={100} className="flex-1 h-1" />
                <span className="text-xs text-gray-500 ml-2">100%</span>
              </div>
            </Card>
          </motion.div>

          {/* Main Voice Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Voice Control Panel */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-medium tracking-tighter text-gray-900">Ready to assist you</h2>
                    <p className="text-lg font-light text-gray-600">
                      Speak naturally and get intelligent responses powered by advanced AI
                    </p>
                  </div>

                  {/* Voice Recording Button */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartRecording}
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500 shadow-lg shadow-red-500/25"
                          : "bg-gray-900 hover:bg-gray-800 shadow-lg"
                      }`}
                    >
                      {isRecording ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                        >
                          <Square className="h-8 w-8 text-white" />
                        </motion.div>
                      ) : (
                        <MicIcon className="h-8 w-8 text-white" />
                      )}
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      className="rounded-2xl px-6 py-3 bg-white/80 backdrop-blur-sm border-gray-200"
                      onClick={() => setVoice("EXAVITQu4vr4xnSDxMaL")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Voice: Emma
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl px-6 py-3 bg-white/80 backdrop-blur-sm border-gray-200"
                      onClick={() => setLanguage(voiceSettings.language === "en-US" ? "es-ES" : "en-US")}
                    >
                      <Headphones className="h-4 w-4 mr-2" />
                      Lang: {voiceSettings.language}
                    </Button>
                  </div>

                  {(isRecording || currentTranscript) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-center gap-2 text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">
                          {isProcessing ? "Processing with AI..." : isRecording ? "Listening..." : "Processing..."}
                        </span>
                      </div>
                      {currentTranscript && (
                        <div className="mt-2 text-sm text-gray-700 text-center">"{currentTranscript}"</div>
                      )}
                    </motion.div>
                  )}

                  {currentError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-center gap-2 text-red-600">
                        <span className="text-sm font-medium">{currentError}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </div>

            {/* Voice AI Features */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium tracking-tighter text-gray-900">AI Capabilities</h3>
                  <Badge className="bg-gray-900 text-white text-[10px] font-medium">ACTIVE</Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Natural Language</span>
                    </div>
                    <p className="text-xs font-light text-gray-600">Understand context and nuance in conversations</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Data Analysis</span>
                    </div>
                    <p className="text-xs font-light text-gray-600">Analyze business metrics and provide insights</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Real-time Response</span>
                    </div>
                    <p className="text-xs font-light text-gray-600">Instant processing and intelligent replies</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start rounded-xl bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={handleStartRecording}
                  >
                    <MicIcon className="h-4 w-4 mr-2" />
                    Start Voice Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl bg-white/80 border-gray-200">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Conversation
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl bg-white/80 border-gray-200">
                    <Settings className="h-4 w-4 mr-2" />
                    Voice Settings
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Conversation History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium tracking-tighter text-gray-900">Recent Conversations</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl bg-white/80 border-gray-200"
                  onClick={handleStartRecording}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>

              <div className="space-y-4">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium tracking-tighter text-gray-900 mb-2">No conversations yet</h4>
                    <p className="text-sm font-light text-gray-600 mb-6">
                      Start your first voice conversation with AI to see it here
                    </p>
                    <Button
                      onClick={handleStartRecording}
                      className="rounded-2xl bg-gray-900 hover:bg-gray-800 text-white px-6"
                    >
                      <MicIcon className="h-4 w-4 mr-2" />
                      Start Voice Chat
                    </Button>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div key={conv.id} className="p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">You:</p>
                          <p className="text-sm text-gray-600 mb-3">{conv.message}</p>
                          <p className="text-sm font-medium text-gray-900 mb-1">AI Assistant:</p>
                          <p className="text-sm text-gray-600 mb-2">{conv.response}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(conv.timestamp).toLocaleString()}</span>
                            <span>{conv.memoriesUsed.length} memories used</span>
                            <span>{conv.knowledgeUsed.length} knowledge sources</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* AI Response Display */}
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">AI Response:</p>
                  <p className="text-sm text-gray-800">{aiResponse}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </VantaHaloBackground>
  )
}
