"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Sparkles, Zap, Brain, MessageSquare, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import Image from "next/image"

interface Message {
  id: string
  sender: "user" | "assistant"
  text: string
  timestamp: Date
  audioUrl?: string
}

const WaveformVisualizer = ({ isActive, intensity = 0.5 }: { isActive: boolean; intensity?: number }) => (
  <div className="flex items-center justify-center space-x-1 h-16">
    {Array.from({ length: 32 }).map((_, index) => (
      <motion.div
        key={index}
        className="w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full"
        initial={{ height: 4 }}
        animate={{
          height: isActive ? [4, 8 + Math.random() * 32 * intensity, 4] : 4,
          opacity: isActive ? [0.3, 0.9, 0.3] : 0.2,
        }}
        transition={{
          repeat: isActive ? Number.POSITIVE_INFINITY : 0,
          duration: 0.5 + Math.random() * 0.8,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
)

const FloatingOrb = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white/20 rounded-full"
    initial={{
      x: Math.random() * 400,
      y: Math.random() * 300,
      opacity: 0,
    }}
    animate={{
      x: Math.random() * 400,
      y: Math.random() * 300,
      opacity: [0, 0.6, 0],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      repeat: Number.POSITIVE_INFINITY,
      delay: delay,
      ease: "easeInOut",
    }}
  />
)

export default function AIVoiceAssistant() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentInput, setCurrentInput] = useState("")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const callStartTime = useRef<number>(0)

  // Speech to text hook
  const { isListening, transcript, startListening, stopListening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechToText({
      onTranscriptChange: (text) => {
        setCurrentInput(text)
      },
      onEnd: async (finalTranscript) => {
        if (finalTranscript.trim()) {
          await handleUserMessage(finalTranscript)
        }
      },
      continuous: false,
      language: "en-US",
    })

  // Audio player hook
  const { playAudio, stopAudio, isPlaying } = useAudioPlayer()

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      callStartTime.current = Date.now()
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000))
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCallActive])

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)
    setCurrentInput("")
    resetTranscript()

    try {
      // Send to AI chat API
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          context:
            "You are Zia, an executive travel assistant for Suitpax. Help with business travel planning, flight bookings, hotel reservations, and travel policies. Be concise and professional. Keep responses under 50 words.",
        }),
      })

      if (!response.ok) throw new Error("Failed to get AI response")

      const aiResponse = await response.json()

      // Generate speech if audio is enabled
      let audioUrl = null
      if (audioEnabled) {
        try {
          const speechResponse = await fetch("/api/elevenlabs/text-to-speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: aiResponse.message,
              voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
            }),
          })

          if (speechResponse.ok) {
            const audioBlob = await speechResponse.blob()
            audioUrl = URL.createObjectURL(audioBlob)
          }
        } catch (error) {
          console.error("Error generating speech:", error)
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: aiResponse.message,
        timestamp: new Date(),
        audioUrl: audioUrl,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-play the response
      if (audioUrl && audioEnabled) {
        setTimeout(() => {
          playAudio(audioUrl)
        }, 500)
      }
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleListening = async () => {
    if (isListening) {
      stopListening()
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        resetTranscript()
        setCurrentInput("")
        startListening()
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }
  }

  const startCall = async () => {
    setIsCallActive(true)
    setMessages([])

    // Welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      sender: "assistant",
      text: "Hello! I'm Zia, your AI travel assistant. How can I help you with your business travel today?",
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])

    // Auto-play welcome if audio is enabled
    if (audioEnabled) {
      try {
        const response = await fetch("/api/elevenlabs/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: welcomeMessage.text,
            voice_id: "21m00Tcm4TlvDq8ikWAM",
          }),
        })

        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          setTimeout(() => playAudio(audioUrl), 1000)
        }
      } catch (error) {
        console.error("Error generating welcome speech:", error)
      }
    }
  }

  const endCall = () => {
    setIsCallActive(false)
    setMessages([])
    setCurrentInput("")
    setIsProcessing(false)
    if (isListening) {
      stopListening()
    }
    if (isPlaying) {
      stopAudio()
    }
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/images/glass-cube-reflection-bg.jpg" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Floating orbs */}
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingOrb key={i} delay={i * 0.5} />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="inline-flex items-center rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
              Voice AI Technology
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-8 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            Meet Zia, your AI assistant
          </h2>

          <p className="text-xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of business travel with natural voice conversations. Book flights, manage expenses,
            and get instant travel assistance.
          </p>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              {!isCallActive ? (
                <motion.div
                  key="start-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 text-center"
                >
                  {/* AI Agent Video/Avatar */}
                  <div className="relative mb-8">
                    <div className="relative w-48 h-48 mx-auto">
                      {/* Placeholder for AI agent video */}
                      <div className="w-full h-full rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover rounded-3xl"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src="/videos/ai-agent-zia.mp4" type="video/mp4" />
                          {/* Fallback to image */}
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Brain className="w-16 h-16 text-white" />
                          </div>
                        </video>
                      </div>

                      {/* Status indicator */}
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl border-4 border-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                      </div>

                      {/* Floating elements */}
                      <motion.div
                        className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/30 rounded-full backdrop-blur-sm"
                        animate={{
                          y: [-10, 10, -10],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="absolute -bottom-4 -left-8 w-6 h-6 bg-purple-400/30 rounded-full backdrop-blur-sm"
                        animate={{
                          y: [10, -10, 10],
                          x: [-5, 5, -5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="text-4xl font-bold text-white mb-3 tracking-tight">Zia</h3>
                  <p className="text-xl text-gray-300 font-light mb-8">Executive Travel Assistant</p>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                      {
                        icon: MessageSquare,
                        title: "Natural Conversations",
                        desc: "Speak naturally, get instant responses",
                      },
                      { icon: Zap, title: "Real-time Processing", desc: "Lightning-fast AI understanding" },
                      { icon: Brain, title: "Travel Expertise", desc: "Specialized in business travel" },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                      >
                        <feature.icon className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                        <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    onClick={startCall}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-12 py-6 text-lg font-semibold shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <Phone className="w-6 h-6 mr-3" />
                    Start Voice Call
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="call-screen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8"
                >
                  {/* Call Header */}
                  <div className="flex items-center justify-between mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white/20" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Zia</h3>
                        <p className="text-gray-300">Executive Travel Assistant</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-white font-mono text-lg">{formatDuration(callDuration)}</div>
                        <div className="text-gray-400 text-sm">Call duration</div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="text-white hover:bg-white/10 rounded-xl"
                      >
                        {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </Button>

                      <Button onClick={endCall} size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Conversation Area */}
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-8 min-h-[400px] max-h-[500px] overflow-y-auto border border-white/10">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] ${message.sender === "user" ? "text-right" : "text-left"}`}>
                            <div
                              className={`inline-block p-4 rounded-2xl ${
                                message.sender === "user"
                                  ? "bg-blue-500 text-white rounded-br-lg"
                                  : "bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-bl-lg"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.text}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                              <span>
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.audioUrl && (
                                <button
                                  onClick={() => playAudio(message.audioUrl!)}
                                  className="flex items-center gap-1 hover:text-white transition-colors"
                                >
                                  <Play className="w-3 h-3" />
                                  Play
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {isProcessing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl rounded-bl-lg p-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-white/60 rounded-full"
                                    animate={{
                                      scale: [1, 1.2, 1],
                                      opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Number.POSITIVE_INFINITY,
                                      delay: i * 0.2,
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-white/80">Thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentInput && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                          <div className="bg-blue-500/50 backdrop-blur-sm text-white rounded-2xl rounded-br-lg p-4 max-w-[80%]">
                            <p className="text-sm opacity-80">{currentInput}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Voice Controls */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    {/* Waveform */}
                    <div className="mb-6">
                      <WaveformVisualizer isActive={isListening || isProcessing} intensity={isListening ? 1 : 0.3} />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-6">
                      <Button
                        onClick={toggleListening}
                        disabled={isProcessing}
                        size="lg"
                        className={`w-20 h-20 rounded-full transition-all duration-300 ${
                          isListening
                            ? "bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/50 animate-pulse"
                            : isProcessing
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600 shadow-2xl shadow-blue-500/50 hover:scale-110"
                        }`}
                      >
                        {isListening ? (
                          <MicOff className="w-8 h-8 text-white" />
                        ) : (
                          <Mic className="w-8 h-8 text-white" />
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-white font-medium">
                        {isListening
                          ? "Listening... Speak now"
                          : isProcessing
                            ? "Processing your request..."
                            : "Tap the microphone to speak"}
                      </p>
                      {!browserSupportsSpeechRecognition && (
                        <p className="text-amber-400 text-sm mt-2">Speech recognition not supported in this browser</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { title: "Real-time Voice", desc: "Natural conversations with instant AI responses", icon: MessageSquare },
            { title: "Travel Expertise", desc: "Specialized knowledge in business travel and bookings", icon: Brain },
            { title: "Always Available", desc: "24/7 assistance for all your travel needs", icon: Zap },
            { title: "Secure & Private", desc: "Enterprise-grade security for your conversations", icon: Sparkles },
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
              <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
