"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Loader2 } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIVoiceAssistant() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

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

    // Zia's greeting
    const greeting = "Hello! I'm Zia, your AI travel assistant. How can I help you with your business travel today?"

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
            "You are Zia, a helpful AI travel assistant for business travel. Provide concise, helpful responses about flights, hotels, expenses, and travel policies. Keep responses under 50 words.",
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
              <span className="font-serif italic">Meet Zia,</span> your AI travel assistant
            </h2>

            <p className="mt-4 text-lg font-light text-gray-600 max-w-3xl mb-8">
              Have natural voice conversations with Zia about your business travel needs. Book flights, find hotels,
              manage expenses, and get travel policy guidance - all through voice commands.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
            {!isCallActive ? (
              // Initial state - Show Zia
              <div className="text-center">
                <div className="relative inline-block mb-8">
                  <div className="relative">
                    <Image
                      src="/agents/agent-5.png"
                      alt="Zia - AI Travel Assistant"
                      width={140}
                      height={140}
                      className="rounded-xl mx-auto border border-gray-200"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-4 border-white">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-medium tracking-tighter text-black mb-2">Zia AI Assistant</h3>
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
                      <Image
                        src="/agents/agent-5.png"
                        alt="Zia"
                        width={70}
                        height={70}
                        className="rounded-xl border border-gray-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black">Zia AI Assistant</h3>
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

                {/* Messages */}
                <div className="bg-white rounded-xl p-6 max-h-80 overflow-y-auto space-y-4 border border-gray-200">
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
                          className={`max-w-sm px-4 py-3 rounded-xl text-sm ${
                            message.type === "user"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-900 border border-gray-200"
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Current transcript */}
                {transcript && (
                  <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">You're saying:</span> {transcript}
                    </p>
                  </div>
                )}

                {/* Voice controls */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={toggleListening}
                      disabled={isProcessing}
                      className={`rounded-xl w-20 h-20 transition-all duration-200 ${
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
                      <div className="flex items-center space-x-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                        <Volume2 className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">Zia is speaking...</span>
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
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: "✈️",
                title: "Flight Booking",
                description:
                  '"Book me a flight to New York next Tuesday" - Zia handles complex travel requests naturally.',
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
                className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-8"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
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
