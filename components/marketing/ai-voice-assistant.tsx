"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Loader2 } from "lucide-react"
import AgentGrid from "@/components/ui/agent-grid"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

// AI Agents data for the grid
const aiAgents = [
  { id: 1, image: "/agents/agent-1.png" },
  { id: 2, image: "/agents/agent-2.png" },
  { id: 3, image: "/agents/agent-3.png" },
  { id: 4, image: "/agents/agent-4.png" },
  { id: 5, image: "/agents/agent-5.png" },
  { id: 6, image: "/agents/agent-6.png" },
  { id: 7, image: "/agents/agent-7.png" },
  { id: 8, image: "/agents/agent-8.png" },
  { id: 9, image: "/agents/agent-9.png" },
  { id: 10, image: "/agents/agent-10.png" },
  { id: 11, image: "/agents/agent-11.png" },
  { id: 12, image: "/agents/agent-12.png" },
  { id: 13, image: "/agents/agent-13.png" },
  { id: 14, image: "/agents/agent-15.png" },
  { id: 15, image: "/agents/agent-16.png" },
  { id: 16, image: "/agents/agent-17.png" },
  { id: 17, image: "/agents/agent-18.png" },
  { id: 18, image: "/agents/agent-19.png" },
  { id: 19, image: "/agents/agent-20.png" },
  { id: 20, image: "/agents/agent-21.png" },
  { id: 21, image: "/agents/agent-22.png" },
  { id: 22, image: "/agents/agent-23.png" },
  { id: 23, image: "/agents/agent-24.png" },
  { id: 24, image: "/agents/agent-25.png" },
  { id: 25, image: "/agents/agent-26.png" },
  { id: 26, image: "/agents/agent-27.png" },
  { id: 27, image: "/agents/agent-28.png" },
  { id: 28, image: "/agents/agent-29.png" },
  { id: 29, image: "/agents/agent-30.png" },
  { id: 30, image: "/agents/agent-31.png" },
  { id: 31, image: "/agents/agent-32.png" },
  { id: 32, image: "/agents/agent-33.png" },
  { id: 33, image: "/agents/agent-34.png" },
  { id: 34, image: "/agents/agent-35.png" },
  { id: 35, image: "/agents/agent-36.png" },
  { id: 36, image: "/agents/agent-37.png" },
  { id: 37, image: "/agents/agent-38.png" },
  { id: 38, image: "/agents/agent-39.png" },
  { id: 39, image: "/agents/agent-40.png" },
  { id: 40, image: "/agents/agent-41.png" },
  { id: 41, image: "/agents/agent-42.png" },
  { id: 42, image: "/agents/agent-43.png" },
  { id: 43, image: "/agents/agent-44.png" },
  { id: 44, image: "/agents/agent-45.png" },
  { id: 45, image: "/agents/agent-46.png" },
  { id: 46, image: "/agents/agent-47.png" },
  { id: 47, image: "/agents/agent-48.png" },
  { id: 48, image: "/agents/agent-49.png" },
  { id: 49, image: "/agents/agent-50.png" },
  { id: 50, image: "/agents/agent-51.png" },
  { id: 51, image: "/agents/agent-52.png" },
  { id: 52, image: "/agents/agent-53.png" },
  { id: 53, image: "/agents/agent-54.png" },
  { id: 54, image: "/agents/agent-55.png" },
  { id: 55, image: "/agents/agent-56.png" },
  { id: 56, image: "/agents/agent-marcus.jpeg" },
  { id: 57, image: "/agents/agent-sophia.jpeg" },
  { id: 58, image: "/agents/agent-emma.jpeg" },
  { id: 59, image: "/agents/agent-alex.jpeg" },
  { id: 60, image: "/agents/agent-zara.jpeg" },
  { id: 61, image: "/agents/agent-luna.jpeg" },
  { id: 62, image: "/agents/agent-kai.jpeg" },
  { id: 63, image: "/agents/agent-nova.jpeg" },
  { id: 64, image: "/agents/agent-aria.jpeg" },
  { id: 65, image: "/agents/agent-sage.jpeg" },
  { id: 66, image: "/agents/agent-ruby.png" },
  { id: 67, image: "/agents/agent-tyler.png" },
  { id: 68, image: "/agents/agent-maya.jpeg" },
  { id: 69, image: "/agents/agent-zoe.jpeg" },
  { id: 70, image: "/agents/agent-kai-new.png" },
  { id: 71, image: "/agents/agent-luna-new.png" },
]

export default function AIVoiceAssistant() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript)
            handleUserMessage(finalTranscript)
            setTranscript("")
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    // Audio element setup
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      audioRef.current.onplay = () => setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onpause = () => setIsPlaying(false)
    }
  }, [])

  const startCall = async () => {
    setIsCallActive(true)
    setError(null)
    setMessages([])

    // Suitpax AI greeting
    const greeting = "Hello! I'm your Suitpax AI assistant. How can I help you with your business travel today?"

    const greetingMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: greeting,
      timestamp: new Date(),
    }

    setMessages([greetingMessage])

    // Convert greeting to speech
    if (!isMuted) {
      await textToSpeech(greeting)
    }
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsListening(false)
    setMessages([])
    setTranscript("")
    setError(null)
    setSelectedAgent(null)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
      setError(null)
    }
  }

  const handleUserMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return

    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      // Send to AI API
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context:
            "You are Suitpax AI, a helpful AI travel assistant for business travel. Provide concise, helpful responses about flights, hotels, expenses, and travel policies. Keep responses under 50 words.",
        }),
      })

      if (!response.ok) throw new Error("Failed to get AI response")

      const data = await response.json()
      const aiResponse = data.message || "I'm sorry, I didn't understand that. Could you please rephrase?"

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Convert response to speech
      if (!isMuted) {
        await textToSpeech(aiResponse)
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const textToSpeech = async (text: string) => {
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error("Failed to generate speech")

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        await audioRef.current.play()
      }
    } catch (error) {
      console.error("Text-to-speech error:", error)
    }
  }

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId)
    // Add some visual feedback or functionality here
    setTimeout(() => setSelectedAgent(null), 2000)
  }

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-2 mb-6">
              <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={50} height={12} className="h-3 w-auto" />
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                AI Voice
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none max-w-4xl mx-auto mb-6 text-black">
              Talk to <span className="font-serif italic">Suitpax AI</span> naturally
            </h2>

            <p className="mt-4 text-lg font-light text-gray-600 max-w-3xl mb-8">
              Have natural voice conversations with Suitpax AI about your business travel needs. Book flights, find
              hotels, manage expenses, and get travel policy guidance - all through voice commands.
            </p>
          </motion.div>
        </div>

        {/* AI Agent Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-600">Choose from our AI agents network</p>
            </div>
            <AgentGrid agents={aiAgents} onAgentSelect={handleAgentSelect} selectedAgent={selectedAgent} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
            {!isCallActive ? (
              // Initial state - Show Suitpax AI
              <div className="text-center">
                <div className="relative inline-block mb-8">
                  <div className="relative">
                    {/* Bubble-style avatar like Grok */}
                    <div className="w-36 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                      <div className="w-32 h-32 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center">
                        <Image
                          src="/logo/suitpax-symbol.webp"
                          alt="Suitpax AI"
                          width={60}
                          height={60}
                          className="w-16 h-16 opacity-90"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-medium tracking-tighter text-black mb-2">Suitpax AI Assistant</h3>
                <p className="text-base font-light text-gray-600 mb-8">Ready to help with your business travel</p>

                <button
                  onClick={startCall}
                  className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Start Voice Call
                </button>

                {!recognitionRef.current && (
                  <p className="text-sm text-gray-500 mt-4">
                    Voice recognition not supported in this browser. Please use Chrome or Safari.
                  </p>
                )}
              </div>
            ) : (
              // Active call state
              <div className="space-y-8">
                {/* Call header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {/* Bubble-style avatar for active call */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center">
                          <Image
                            src="/logo/suitpax-symbol.webp"
                            alt="Suitpax AI"
                            width={24}
                            height={24}
                            className="w-6 h-6 opacity-90"
                          />
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black">Suitpax AI Assistant</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Connected</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-xl transition-colors ${
                        isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                      } hover:bg-gray-200`}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={endCall}
                      className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages - Bubble style like Grok */}
                <div className="bg-white rounded-2xl p-6 max-h-80 overflow-y-auto space-y-4 border border-gray-200">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-sm px-6 py-4 text-sm ${
                            message.type === "user"
                              ? "bg-black text-white rounded-full"
                              : "bg-gray-100 text-gray-900 border border-gray-200 rounded-full"
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-6 py-4 rounded-full border border-gray-200">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Current transcript */}
                {transcript && (
                  <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">You're saying:</span> {transcript}
                    </p>
                  </div>
                )}

                {/* Voice controls - Bubble style */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={toggleListening}
                      disabled={isProcessing}
                      className={`rounded-full w-20 h-20 transition-all duration-200 ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/25"
                          : "bg-black hover:bg-gray-800 shadow-lg"
                      } disabled:opacity-50`}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8 text-white mx-auto" />
                      ) : (
                        <Mic className="w-8 h-8 text-white mx-auto" />
                      )}
                    </button>

                    {isPlaying && (
                      <div className="flex items-center space-x-3 px-6 py-3 bg-gray-100 rounded-full border border-gray-200">
                        <Volume2 className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">Suitpax AI is speaking...</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">
                      {isListening
                        ? "Listening... Speak now"
                        : isProcessing
                          ? "Processing your request..."
                          : "Click the microphone to speak"}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features - Bubble style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: "✈️",
                title: "Flight Booking",
                description:
                  '"Book me a flight to New York next Tuesday" - Suitpax AI handles complex travel requests naturally.',
              },
              {
                icon: "🏨",
                title: "Hotel Search",
                description:
                  '"Find hotels near the convention center under $200" - Get personalized recommendations instantly.',
              },
              {
                icon: "💳",
                title: "Expense Help",
                description: '"What\'s our meal policy for international travel?" - Get instant policy clarification.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-8"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium tracking-tighter text-black mb-4">{feature.title}</h3>
                <p className="text-base font-light text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
