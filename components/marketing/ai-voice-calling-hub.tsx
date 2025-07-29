"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import {
  PiPhoneFill,
  PiMicrophoneFill,
  PiMicrophoneSlashFill,
  PiSpeakerHighFill,
  PiWaveformBold,
  PiStopFill,
  PiPlayFill,
  PiPauseFill,
  PiChatCircleFill,
  PiUserSwitchBold,
  PiStarFill,
} from "react-icons/pi"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const aiAgents = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Assistant",
    image: "/agents/agent-emma.jpeg",
    specialty: "Flight booking & luxury travel",
    status: "available",
    voice: "Professional, warm, efficient",
    accent: "American",
    sampleText:
      "Hello! I'm Emma, your Suitpax AI travel assistant. I specialize in executive travel, flight bookings, and luxury accommodations. How can I help make your business travel seamless today?",
    callsToday: 47,
    rating: 4.9,
    languages: ["English", "Spanish", "French"],
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Corporate Travel Specialist",
    image: "/agents/agent-marcus.jpeg",
    specialty: "Policy compliance & cost optimization",
    status: "available",
    voice: "Authoritative, detail-oriented",
    accent: "British",
    sampleText:
      "Good day! I'm Marcus, your Suitpax corporate travel specialist. I focus on policy compliance, expense optimization, and ensuring your company's travel budget is maximized efficiently. What can I assist you with?",
    callsToday: 32,
    rating: 4.8,
    languages: ["English", "German", "Dutch"],
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    specialty: "Luxury experiences & concierge",
    status: "available",
    voice: "Elegant, sophisticated",
    accent: "French",
    sampleText:
      "Bonjour! I'm Sophia, your Suitpax VIP concierge. I specialize in luxury travel experiences, exclusive reservations, and personalized concierge services. How may I elevate your travel experience?",
    callsToday: 28,
    rating: 4.9,
    languages: ["English", "French", "Italian"],
  },
  {
    id: "alex",
    name: "Alex",
    role: "Tech & Innovation Guide",
    image: "/agents/agent-alex.jpeg",
    specialty: "Digital tools & travel tech",
    status: "available",
    voice: "Modern, tech-savvy",
    accent: "Canadian",
    sampleText:
      "Hey there! I'm Alex, your Suitpax tech specialist. I help with digital travel tools, app integrations, and making your travel experience more efficient through technology. What tech challenge can I solve for you?",
    callsToday: 41,
    rating: 4.7,
    languages: ["English", "Japanese", "Korean"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
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

export default function AIVoiceCallingHub() {
  const [selectedAgent, setSelectedAgent] = useState<(typeof aiAgents)[0]>(aiAgents[0])
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  const [currentUserInput, setCurrentUserInput] = useState("")
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)

  const { audioState, playAudio, pauseAudio, resumeAudio, stopAudio } = useAudioPlayer()

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: speechSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({
    continuous: false,
    interimResults: true,
    language: "en-US",
    onResult: handleSpeechResult,
    onEnd: handleSpeechEnd,
  })

  // Handle speech recognition results
  function handleSpeechResult(transcript: string, isFinal: boolean) {
    if (isFinal && transcript.trim()) {
      setCurrentUserInput(transcript.trim())
    }
  }

  // Handle speech recognition end
  function handleSpeechEnd() {
    if (currentUserInput.trim()) {
      processUserMessage(currentUserInput)
      setCurrentUserInput("")
      resetTranscript()
    }
  }

  // Simulate call duration
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

  // Monitor audio state changes
  useEffect(() => {
    setIsAgentSpeaking(audioState.isPlaying)
  }, [audioState.isPlaying])

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startCall = async () => {
    setIsCallActive(true)
    setConversationHistory([])

    // Generate and play welcome message
    await generateAndPlaySpeech(selectedAgent.sampleText, selectedAgent.id)

    // Add welcome message to conversation history
    setConversationHistory([
      {
        role: "assistant",
        content: selectedAgent.sampleText,
        timestamp: new Date(),
      },
    ])
  }

  const endCall = () => {
    setIsCallActive(false)
    setConversationHistory([])
    setCurrentUserInput("")
    stopAudio()
    stopListening()
    resetTranscript()
  }

  const generateAndPlaySpeech = async (text: string, agentId: string) => {
    try {
      setIsGenerating(true)

      const response = await fetch("/api/elevenlabs/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, agentId }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const audioBuffer = await response.arrayBuffer()
      await playAudio(audioBuffer)
    } catch (error) {
      console.error("Error generating speech:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const processUserMessage = async (message: string) => {
    if (!selectedAgent || !message.trim()) return

    try {
      setIsProcessing(true)

      // Add user message to conversation
      const userMessage: Message = {
        role: "user",
        content: message,
        timestamp: new Date(),
      }

      setConversationHistory((prev) => [...prev, userMessage])

      // Get AI response
      const response = await fetch("/api/ai-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          agentId: selectedAgent.id,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const { response: aiResponse } = await response.json()

      // Add AI response to conversation
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setConversationHistory((prev) => [...prev, assistantMessage])

      // Generate and play AI response
      await generateAndPlaySpeech(aiResponse, selectedAgent.id)
    } catch (error) {
      console.error("Error processing user message:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMicrophoneToggle = () => {
    if (isListening) {
      stopListening()
    } else if (!isAgentSpeaking && !isProcessing) {
      startListening()
    }
  }

  const handlePlaySample = async () => {
    if (audioState.isPlaying) {
      pauseAudio()
    } else {
      await generateAndPlaySpeech(selectedAgent.sampleText, selectedAgent.id)
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[9px] font-medium text-gray-300 border border-gray-700">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1"
              />
              Voice AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[9px] font-medium text-gray-300 border border-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1"></span>
              Live Conversation
            </span>
          </div>
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-white leading-none mb-4">
            Talk to Suitpax AI Agents
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            Experience natural voice conversations with specialized AI travel agents. Each agent has unique expertise
            and personality.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Voice Interface Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl p-6 mb-8">
            {/* Agent Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Select Your AI Agent</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <PiUserSwitchBold className="w-3 h-3" />
                  <span>{aiAgents.length} agents available</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {aiAgents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      selectedAgent.id === agent.id
                        ? "bg-gray-800 border-gray-600 shadow-lg"
                        : "bg-gray-800/30 border-gray-700 hover:bg-gray-800/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative">
                        <Image
                          src={agent.image || "/placeholder.svg"}
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="rounded-lg object-cover"
                        />
                        <div
                          className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${getStatusColor(
                            agent.status,
                          )} rounded-full border border-gray-900`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                        <div className="flex items-center gap-1">
                          <PiStarFill className="w-2.5 h-2.5 text-yellow-400" />
                          <span className="text-xs text-gray-400">{agent.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{agent.role}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{agent.specialty}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{agent.accent} accent</span>
                      <span className="text-xs text-gray-400">{agent.callsToday} calls</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Agent Details */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-4">
                <Image
                  src={selectedAgent.image || "/placeholder.svg"}
                  alt={selectedAgent.name}
                  width={64}
                  height={64}
                  className="rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-medium text-white">{selectedAgent.name}</h4>
                    <div className="flex items-center gap-1">
                      <PiStarFill className="w-3 h-3 text-yellow-400" />
                      <span className="text-sm text-gray-300">{selectedAgent.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{selectedAgent.role}</p>
                  <p className="text-xs text-gray-500 mb-3">{selectedAgent.specialty}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.languages.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Voice Style</p>
                  <p className="text-xs text-gray-400">{selectedAgent.voice}</p>
                  <p className="text-xs text-gray-500 mt-2">{selectedAgent.accent} accent</p>
                </div>
              </div>
            </div>

            {/* Call Interface */}
            <AnimatePresence>
              {isCallActive ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Call duration: {formatCallDuration(callDuration)}</div>

                    {/* Status Indicators */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {isAgentSpeaking && (
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <PiSpeakerHighFill className="w-3 h-3" />
                          {selectedAgent.name} speaking...
                        </div>
                      )}
                      {isListening && (
                        <div className="flex items-center gap-2 text-xs text-blue-400">
                          <PiMicrophoneFill className="w-3 h-3 animate-pulse" />
                          Listening...
                        </div>
                      )}
                      {isProcessing && (
                        <div className="flex items-center gap-2 text-xs text-orange-400">
                          <PiWaveformBold className="w-3 h-3 animate-pulse" />
                          Processing...
                        </div>
                      )}
                    </div>

                    {/* Current User Input */}
                    {(currentUserInput || interimTranscript) && (
                      <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                        <p className="text-sm text-blue-200">
                          You: {currentUserInput || interimTranscript}
                          {interimTranscript && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    )}

                    {/* Audio Waveform Visualization */}
                    <div className="flex items-center justify-center gap-1 mb-6 h-12 px-4">
                      {Array.from({ length: 20 }).map((_, index) => (
                        <motion.div
                          key={index}
                          className={`w-1 rounded-full ${
                            isAgentSpeaking ? "bg-green-500" : isListening ? "bg-blue-500" : "bg-gray-600"
                          }`}
                          animate={{
                            height: isAgentSpeaking || isListening ? [4, Math.random() * 32 + 4, 4] : 4,
                            opacity: isAgentSpeaking || isListening ? [0.3, 0.3 + Math.random() * 0.7, 0.3] : 0.3,
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: isAgentSpeaking || isListening ? Number.POSITIVE_INFINITY : 0,
                            delay: index * 0.05,
                          }}
                        />
                      ))}
                    </div>

                    {/* Call Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={handleMicrophoneToggle}
                        disabled={isAgentSpeaking || isProcessing || !speechSupported}
                        className={`p-4 rounded-full border shadow-sm transition-colors ${
                          isListening
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isListening ? (
                          <PiMicrophoneFill className="w-5 h-5" />
                        ) : (
                          <PiMicrophoneSlashFill className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={endCall}
                        className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
                      >
                        <PiStopFill className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => (audioState.isPlaying ? pauseAudio() : resumeAudio())}
                        disabled={!audioState.isPlaying && !audioState.isPaused}
                        className="p-4 rounded-full bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 shadow-sm disabled:opacity-50"
                      >
                        <PiSpeakerHighFill className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      {!speechSupported ? (
                        <p className="text-xs text-red-400">Speech recognition not supported in this browser</p>
                      ) : speechError ? (
                        <p className="text-xs text-red-400">{speechError}</p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          {isAgentSpeaking
                            ? `${selectedAgent.name} is speaking...`
                            : isListening
                              ? "Listening for your response..."
                              : isProcessing
                                ? "Processing your message..."
                                : "Click microphone to speak"}
                        </p>
                      )}
                    </div>

                    {/* Conversation History */}
                    {conversationHistory.length > 1 && (
                      <div className="mt-6 w-full max-w-md mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <PiChatCircleFill className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-400">Conversation</span>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {conversationHistory.slice(-4).map((message, index) => (
                            <div
                              key={index}
                              className={`text-xs p-2 rounded-lg ${
                                message.role === "user"
                                  ? "bg-blue-900/30 text-blue-200 ml-4 border border-blue-800"
                                  : "bg-gray-800/50 text-gray-300 mr-4 border border-gray-700"
                              }`}
                            >
                              <span className="font-medium">
                                {message.role === "user" ? "You" : selectedAgent.name}:
                              </span>{" "}
                              {message.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-4">
                      Ready to start a conversation with {selectedAgent.name}?
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={handlePlaySample}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 border border-gray-600"
                      >
                        {isGenerating ? (
                          <PiWaveformBold className="w-4 h-4 animate-pulse" />
                        ) : audioState.isPlaying ? (
                          <PiPauseFill className="w-4 h-4" />
                        ) : (
                          <PiPlayFill className="w-4 h-4" />
                        )}
                        {isGenerating ? "Generating..." : audioState.isPlaying ? "Pause" : "Preview Voice"}
                      </button>

                      <button
                        onClick={startCall}
                        disabled={isCallActive}
                        className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        <PiPhoneFill className="w-4 h-4" />
                        Start Call
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 border border-gray-700">
                <PiChatCircleFill className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-medium text-white mb-2">Natural Conversation</h3>
              <p className="text-xs text-gray-400">AI agents understand context and maintain natural dialogue flow</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 border border-gray-700">
                <PiMicrophoneFill className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-medium text-white mb-2">Voice Recognition</h3>
              <p className="text-xs text-gray-400">Advanced speech-to-text with real-time processing and accuracy</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 border border-gray-700">
                <PiWaveformBold className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-medium text-white mb-2">Realistic Voices</h3>
              <p className="text-xs text-gray-400">Powered by ElevenLabs for human-like speech synthesis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
