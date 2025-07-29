"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from "lucide-react"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { useAudioPlayer } from "@/hooks/use-audio-player"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIVoiceAssistant() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")

  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useSpeechToText()

  const { play, isPlaying } = useAudioPlayer()

  // Auto-send transcript when user stops speaking
  useEffect(() => {
    if (transcript && !isListening && isCallActive) {
      handleSendMessage(transcript)
      resetTranscript()
    }
  }, [transcript, isListening, isCallActive])

  const startCall = async () => {
    setIsCallActive(true)
    setMessages([])

    // Zia's greeting
    const greeting = "Hi! I'm Zia, your AI travel assistant. How can I help you with your business travel today?"

    const greetingMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: greeting,
      timestamp: new Date(),
    }

    setMessages([greetingMessage])

    // Convert greeting to speech
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: greeting }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        await play(audioUrl)
      }
    } catch (error) {
      console.error("Error generating speech:", error)
    }
  }

  const endCall = () => {
    setIsCallActive(false)
    stopListening()
    setMessages([])
    setCurrentResponse("")
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return

    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      // Get AI response
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context:
            "You are Zia, a helpful AI travel assistant for business travelers. Keep responses concise and focused on travel-related topics like flights, hotels, expenses, and travel policies.",
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
      setCurrentResponse(aiResponse)

      // Convert to speech
      const speechResponse = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiResponse }),
      })

      if (speechResponse.ok) {
        const audioBlob = await speechResponse.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        await play(audioUrl)
      }
    } catch (error) {
      console.error("Error processing message:", error)
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

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <section className="w-full py-12 pb-6 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-1.5 mb-4">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                AI Voice Assistant
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none max-w-4xl mx-auto mb-6 text-black">
              Meet Zia, your AI travel assistant
            </h2>

            <p className="mt-4 text-base font-light text-gray-600 max-w-3xl mb-8">
              Have natural voice conversations with Zia about your business travel needs. Book flights, find hotels,
              manage expenses, and get travel policy guidance - all through voice commands.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm">
            {!isCallActive ? (
              // Initial state - Show Zia
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="relative">
                    <Image
                      src="/agents/agent-5.png"
                      alt="Zia - AI Travel Assistant"
                      width={120}
                      height={120}
                      className="rounded-md mx-auto"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-medium tracking-tighter text-black mb-2">Zia</h3>
                <p className="text-sm font-light text-gray-600 mb-6">AI Travel Assistant</p>

                <Button
                  onClick={startCall}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl"
                  disabled={!isSupported}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start Voice Call
                </Button>

                {!isSupported && (
                  <p className="text-xs text-gray-500 mt-2">Voice recognition not supported in this browser</p>
                )}
              </div>
            ) : (
              // Active call state
              <div className="space-y-6">
                {/* Call header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image src="/agents/agent-5.png" alt="Zia" width={80} height={80} className="rounded-md" />
                    <div>
                      <h3 className="font-medium text-black">Zia</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Connected</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={endCall} variant="destructive" size="sm" className="rounded-xl">
                    <PhoneOff className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                </div>

                {/* Messages */}
                <div className="bg-white rounded-xl p-4 max-h-64 overflow-y-auto space-y-3">
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
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.type === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Current transcript */}
                {transcript && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">You're saying:</span> {transcript}
                    </p>
                  </div>
                )}

                {/* Voice controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={toggleListening}
                    disabled={isProcessing}
                    className={`rounded-full w-16 h-16 ${
                      isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-black hover:bg-gray-800"
                    }`}
                  >
                    {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </Button>

                  {isPlaying && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-xl">
                      <Volume2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">Zia is speaking...</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {isListening ? "Listening... Speak now" : "Click the microphone to speak"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">✈️</span>
                </div>
                <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Flight Booking</h3>
                <p className="text-sm font-light text-gray-600">
                  "Book me a flight to New York next Tuesday" - Zia handles complex travel requests naturally.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🏨</span>
                </div>
                <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Hotel Search</h3>
                <p className="text-sm font-light text-gray-600">
                  "Find hotels near the convention center under $200" - Get personalized recommendations instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-lg font-medium tracking-tighter text-black mb-2">Expense Help</h3>
                <p className="text-sm font-light text-gray-600">
                  "What's our meal policy for international travel?" - Get instant policy clarification.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
