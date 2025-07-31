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
  PiMicrophoneFill,
  PiStopFill,
  PiPlayFill,
  PiSpeakerHighFill,
  PiPauseFill,
} from "react-icons/pi"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Voice Agents Data
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
    description: "Specializes in executive-level travel arrangements with attention to luxury and convenience.",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Corporate Travel Specialist",
    image: "/agents/agent-marcus.jpeg",
    rating: 4.8,
    callsToday: 32,
    languages: ["English", "German", "Dutch"],
    specialty: "Policy compliance & cost optimization",
    accent: "British",
    voice: "Direct, analytical, business-focused",
    status: "available" as const,
    description: "Expert in corporate travel policies and budget optimization for business travelers.",
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    rating: 4.9,
    callsToday: 28,
    languages: ["English", "French", "Italian"],
    specialty: "Luxury experiences & concierge",
    accent: "French",
    voice: "Elegant, sophisticated, personalized",
    status: "busy" as const,
    description: "Creates exceptional luxury travel experiences and personalized concierge services.",
  },
  {
    id: "alex",
    name: "Alex",
    role: "Tech & Innovation Guide",
    image: "/agents/agent-alex.jpeg",
    rating: 4.7,
    callsToday: 41,
    languages: ["English", "Spanish", "Portuguese"],
    specialty: "Travel tech & digital solutions",
    accent: "American",
    voice: "Modern, tech-savvy, enthusiastic",
    status: "available" as const,
    description: "Helps integrate cutting-edge travel technology into your business trips.",
  },
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  audioUrl?: string
  language?: string
}

export default function VoiceAIPage() {
  const [selectedAgent, setSelectedAgent] = useState(voiceAgents[0])
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [userTokens, setUserTokens] = useState({ used: 0, limit: 5000 })
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle")
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchUserData()
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
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setUser(userData)
          setUserTokens({
            used: userData.ai_tokens_used || 0,
            limit: userData.ai_tokens_limit || 5000,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  async function startCall() {
    setIsCallActive(true)
    setMessages([])
    setError(null)

    // Simulate welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `Hello! I'm ${selectedAgent.name}, your ${selectedAgent.role.toLowerCase()}. How can I help you with your business travel today?`,
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])
    setStatus("speaking")

    // Simulate speech
    setTimeout(() => {
      setStatus("idle")
    }, 3000)
  }

  function endCall() {
    setIsCallActive(false)
    setMessages([])
    setStatus("idle")
    setTranscript("")
    setError(null)
  }

  function startListening() {
    if (status === "listening") {
      setStatus("idle")
      setTranscript("")
    } else {
      setStatus("listening")
      setTranscript("Listening for your voice...")

      // Simulate listening and processing
      setTimeout(() => {
        setTranscript("I need to book a flight to New York for next week")
        setStatus("processing")

        setTimeout(() => {
          const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: "I need to book a flight to New York for next week",
            timestamp: new Date(),
          }

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "I'd be happy to help you book a flight to New York. Let me search for the best options for next week. What dates work best for you?",
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, userMessage, assistantMessage])
          setStatus("speaking")
          setTranscript("")

          setTimeout(() => {
            setStatus("idle")
          }, 4000)
        }, 2000)
      }, 3000)
    }
  }

  function formatCallDuration(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusInfo = () => {
    switch (status) {
      case "listening":
        return { color: "text-blue-600", text: "Listening...", icon: PiMicrophoneFill }
      case "processing":
        return { color: "text-orange-600", text: "Processing...", icon: PiWaveformBold }
      case "speaking":
        return { color: "text-green-600", text: `${selectedAgent.name} speaking...`, icon: PiSpeakerHighFill }
      default:
        return { color: "text-gray-600", text: "Ready", icon: PiMicrophoneFill }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  const getStatusColor = (agentStatus: string) => {
    switch (agentStatus) {
      case "available":
        return "bg-green-400"
      case "busy":
        return "bg-orange-400"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none">
            Voice AI Agents
          </h1>
          <p className="text-gray-600 mt-2 font-light">
            Have natural voice conversations with specialized AI travel agents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-gray-50 border-gray-200">
            <span className="text-xs font-medium">
              Tokens: {userTokens.used.toLocaleString()}/{userTokens.limit.toLocaleString()}
            </span>
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <PiChatCircleFill className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">Voice Ready</span>
          </Badge>
        </div>
      </div>

      {/* Agent Selection */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-medium tracking-tighter text-black">Choose Your AI Agent</CardTitle>
              <CardDescription className="font-light text-gray-600">
                Select a specialized agent for your business travel needs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <PiUserSwitchBold className="w-4 h-4" />
              <span>{voiceAgents.filter((a) => a.status === "available").length} available</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {voiceAgents.map((agent) => (
              <motion.button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full p-4 rounded-2xl border transition-all text-left ${
                  selectedAgent.id === agent.id
                    ? "bg-gray-50 border-gray-300 shadow-sm"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover"
                    />
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(
                        agent.status,
                      )} rounded-full border-2 border-white`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{agent.name}</h3>
                    <p className="text-sm text-gray-600 truncate font-light">{agent.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <PiStarFill className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-medium text-gray-600">{agent.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <PiChatCircleFill className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">{agent.callsToday}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600 line-clamp-2 font-light">{agent.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {agent.languages.slice(0, 2).map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700"
                      >
                        {lang}
                      </span>
                    ))}
                    {agent.languages.length > 2 && (
                      <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                        +{agent.languages.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-light">
                      <span className="font-medium">Voice:</span> {agent.voice}
                    </p>
                    <p className="text-xs text-gray-500 font-light">
                      <span className="font-medium">Accent:</span> {agent.accent}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Interface */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={selectedAgent.image || "/placeholder.svg"}
                alt={selectedAgent.name}
                width={40}
                height={40}
                className="rounded-xl object-cover"
              />
              <div>
                <CardTitle className="text-lg font-medium tracking-tighter text-black">{selectedAgent.name}</CardTitle>
                <CardDescription className="font-light text-gray-600">{selectedAgent.role}</CardDescription>
              </div>
            </div>
            {isCallActive && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <PiClockBold className="w-4 h-4" />
                  <span className="font-medium">{formatCallDuration(callDuration)}</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                  <span className="text-xs font-medium">Live</span>
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {isCallActive ? (
              <motion.div
                key="active-call"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Status Indicators */}
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className={`${statusInfo.color} border-current`}>
                    <StatusIcon className="w-3 h-3 mr-1.5 animate-pulse" />
                    <span className="text-xs font-medium">{statusInfo.text}</span>
                  </Badge>
                </div>

                {/* Waveform Visualization */}
                <div className="flex items-center justify-center gap-1 h-16 px-4">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-1 rounded-full ${
                        status === "speaking" ? "bg-green-500" : status === "listening" ? "bg-blue-500" : "bg-gray-300"
                      }`}
                      animate={{
                        height: status === "speaking" || status === "listening" ? [8, Math.random() * 40 + 8, 8] : 8,
                        opacity:
                          status === "speaking" || status === "listening" ? [0.3, 0.3 + Math.random() * 0.7, 0.3] : 0.3,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: status === "speaking" || status === "listening" ? Number.POSITIVE_INFINITY : 0,
                        delay: index * 0.05,
                      }}
                    />
                  ))}
                </div>

                {/* Current Transcript */}
                <AnimatePresence>
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                    >
                      <p className="text-sm text-blue-800 font-light">
                        <span className="font-medium">You:</span> {transcript}
                        <span className="animate-pulse">|</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Conversation Messages */}
                {messages.length > 0 && (
                  <div className="max-h-64 overflow-y-auto space-y-3 bg-gray-50 rounded-xl p-4">
                    <AnimatePresence>
                      {messages.slice(-4).map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm font-light ${
                              message.role === "user"
                                ? "bg-white text-gray-900 border border-gray-200"
                                : "bg-gray-800 text-white"
                            }`}
                          >
                            <span className="font-medium">{message.role === "user" ? "You" : selectedAgent.name}:</span>{" "}
                            {message.content}
                            {message.audioUrl && message.role === "assistant" && (
                              <button className="ml-2 text-gray-300 hover:text-white transition-colors">
                                <PiPlayFill className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={startListening}
                    variant={status === "listening" ? "default" : "outline"}
                    size="lg"
                    className={status === "listening" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                  >
                    <PiMicrophoneFill className="w-5 h-5 mr-2" />
                    {status === "listening" ? "Stop" : "Speak"}
                  </Button>

                  <Button onClick={endCall} variant="destructive" size="lg">
                    <PiStopFill className="w-5 h-5 mr-2" />
                    End Call
                  </Button>

                  <Button variant="outline" size="lg" disabled={!isAudioPlaying}>
                    {isAudioPlaying ? (
                      <PiPauseFill className="w-5 h-5 mr-2" />
                    ) : (
                      <PiSpeakerHighFill className="w-5 h-5 mr-2" />
                    )}
                    Audio
                  </Button>
                </div>

                {/* Error Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-700 font-light">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="call-setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  <Image
                    src={selectedAgent.image || "/placeholder.svg"}
                    alt={selectedAgent.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tighter">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-light">{selectedAgent.role}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <PiStarFill className="w-3 h-3 text-yellow-500" />
                      <span className="font-medium">{selectedAgent.rating} rating</span>
                    </div>
                    <span>•</span>
                    <span className="font-medium">{selectedAgent.callsToday} calls today</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 font-light">
                    {selectedAgent.voice} voice with {selectedAgent.accent} accent. Specializes in{" "}
                    {selectedAgent.specialty.toLowerCase()}.
                  </p>
                </div>

                <Button onClick={startCall} size="lg" className="bg-black text-white hover:bg-gray-800 font-medium">
                  <PiPhoneFill className="w-5 h-5 mr-2" />
                  Start Voice Conversation
                </Button>

                <p className="text-xs text-gray-500 mt-4 font-light">
                  Click to start a simulated voice conversation with {selectedAgent.name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiChatCircleFill className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 tracking-tighter">Natural Conversation</h3>
            <p className="text-sm text-gray-600 font-light">
              AI agents understand context and maintain natural dialogue flow
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiGlobeSimpleBold className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 tracking-tighter">Multi-language Support</h3>
            <p className="text-sm text-gray-600 font-light">
              Automatic language detection with support for 40+ languages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiWaveformBold className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 tracking-tighter">Realistic Voices</h3>
            <p className="text-sm text-gray-600 font-light">Powered by ElevenLabs for human-like speech synthesis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
