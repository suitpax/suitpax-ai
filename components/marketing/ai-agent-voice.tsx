"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { PiMicrophone, PiPause, PiArrowRight, PiArrowLeft, PiX, PiPhone } from "react-icons/pi"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import { ELEVENLABS_VOICES } from "@/lib/elevenlabs"
import { detectLanguage } from "@/lib/language-detection"

interface Message {
  id: string
  sender: "user" | "assistant"
  text: string
  timestamp: Date
  audioUrl?: string
  language?: string
}

const assistants = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Assistant",
    image: "/agents/agent-13.png",
    voiceId: ELEVENLABS_VOICES.EMMA,
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge Specialist",
    image: "/agents/agent-30.png",
    voiceId: ELEVENLABS_VOICES.SOPHIA,
  },
  {
    id: "michael",
    name: "Michael",
    role: "Flight Operations",
    image: "/agents/agent-5.png",
    voiceId: ELEVENLABS_VOICES.MICHAEL,
  },
]

export default function AIAgentVoice() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAssistantIndex, setCurrentAssistantIndex] = useState(0)
  const [showLanguageIndicator, setShowLanguageIndicator] = useState(false)

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const currentAssistant = assistants[currentAssistantIndex]

  const { isListening, transcript, startListening, stopListening, detectedLanguage, browserSupportsSpeechRecognition } =
    useSpeechToText({
      onEnd: (finalTranscript, detectedLang) => {
        if (finalTranscript) {
          const userMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: finalTranscript,
            timestamp: new Date(),
            language: detectedLang,
          }
          setMessages((prev) => [...prev, userMessage])
          processUserMessage(finalTranscript, userMessage.id, detectedLang)
        }
      },
      continuous: false,
      autoDetectLanguage: true,
    })

  useEffect(() => {
    if (detectedLanguage && detectedLanguage !== "en-US") {
      setShowLanguageIndicator(true)
      const timer = setTimeout(() => setShowLanguageIndicator(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [detectedLanguage])

  useEffect(() => {
    if (isCallActive && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now().toString(),
        sender: "assistant" as const,
        text: `Hello! I'm ${currentAssistant.name}, your ${currentAssistant.role.toLowerCase()}. How can I help you today?`,
        timestamp: new Date(),
        language: "en-US",
      }
      setMessages([welcomeMessage])
      convertTextToSpeech(welcomeMessage.text, currentAssistant.voiceId).then((audioUrl) => {
        setMessages((prev) => prev.map((msg) => (msg.id === welcomeMessage.id ? { ...msg, audioUrl } : msg)))
        if (audioPlayerRef.current && audioUrl) {
          audioPlayerRef.current.src = audioUrl
          audioPlayerRef.current.play()
        }
      })
    }
  }, [isCallActive, messages.length, currentAssistant])

  const processUserMessage = async (userText: string, userMessageId: string, detectedLang?: string) => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const userLanguage = detectedLang || detectLanguage(userText).speechCode
    let responseText = "I understand you need assistance. Could you provide more details?"
    if (userText.toLowerCase().includes("flight")) {
      responseText =
        "I've found several flight options for your trip. The best morning flights are with Iberia and Delta. Would you like more details?"
    } else if (userText.toLowerCase().includes("hotel")) {
      responseText =
        "I can recommend several hotels. The Hilton Midtown and The Peninsula are excellent for business travelers. Shall I book a room?"
    }
    const assistantMessage: Message = {
      id: Date.now().toString(),
      sender: "assistant",
      text: responseText,
      timestamp: new Date(),
      language: "en-US",
    }
    setMessages((prev) => [...prev, assistantMessage])
    try {
      const audioUrl = await convertTextToSpeech(responseText, currentAssistant.voiceId, "en-US")
      setMessages((prev) => prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, audioUrl } : msg)))
      if (audioPlayerRef.current && audioUrl) {
        audioPlayerRef.current.src = audioUrl
        audioPlayerRef.current.play()
      }
    } catch (error) {
      console.error("Error converting text to speech:", error)
    }
    setIsProcessing(false)
  }

  const convertTextToSpeech = async (text: string, voiceId: string, language = "en-US"): Promise<string> => {
    const response = await fetch("/api/elevenlabs/text-to-speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId, language }),
    })
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    const audioBlob = await response.blob()
    return URL.createObjectURL(audioBlob)
  }

  const toggleCall = () => {
    if (isCallActive) {
      if (isListening) stopListening()
      if (audioPlayerRef.current) audioPlayerRef.current.pause()
      setMessages([])
    }
    setIsCallActive(!isCallActive)
  }

  const changeAssistant = (direction: "next" | "prev") => {
    const newIndex =
      direction === "next"
        ? (currentAssistantIndex + 1) % assistants.length
        : (currentAssistantIndex - 1 + assistants.length) % assistants.length
    setCurrentAssistantIndex(newIndex)
  }

  return (
    <section className="w-full py-20 md:py-28 bg-gray-50 overflow-hidden font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            AI Voice Interface
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black leading-tight max-w-3xl mx-auto">
            Conversations that get work done.
            <span className="italic font-serif text-gray-600"> Naturally.</span>
          </h2>
        </div>

        <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-lg mx-auto min-h-[550px] flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={currentAssistant.image || "/placeholder.svg"}
                  alt={currentAssistant.name}
                  width={32}
                  height={32}
                  className="rounded-full h-8 w-8 object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-sm text-black font-medium">{currentAssistant.name}</p>
                <p className="text-xs text-gray-500">{currentAssistant.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => changeAssistant("prev")}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <PiArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => changeAssistant("next")}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <PiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <AnimatePresence>
              {isCallActive ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 mb-4 ${
                        msg.sender === "user" ? "justify-end flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[80%] text-xs ${
                          msg.sender === "user"
                            ? "bg-black text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 rounded-lg rounded-bl-none p-3">
                        <div className="flex items-center space-x-1 h-4">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                            className="flex space-x-1"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-gray-400"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-gray-400"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center p-6"
                >
                  <Image
                    src={currentAssistant.image || "/placeholder.svg"}
                    alt={currentAssistant.name}
                    width={80}
                    height={80}
                    className="rounded-full h-20 w-20 object-cover mb-4"
                  />
                  <h3 className="text-lg font-medium text-black mb-1">{currentAssistant.name}</h3>
                  <p className="text-sm text-gray-600 mb-6">{currentAssistant.role}</p>
                  <button
                    onClick={toggleCall}
                    className="bg-black hover:bg-black/90 text-white rounded-xl px-6 py-2.5 text-sm flex items-center space-x-2 font-medium shadow-lg"
                  >
                    <PiPhone className="h-4 w-4" />
                    <span>Start Conversation</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          {isCallActive && (
            <div className="border-t border-gray-200 p-4 flex items-center justify-between">
              <button
                onClick={toggleCall}
                className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-sm"
              >
                <PiX className="h-4 w-4" />
              </button>
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`p-4 rounded-full transition-all duration-300 shadow-lg ${
                  isListening ? "bg-red-500 animate-pulse" : "bg-black"
                }`}
              >
                {isListening ? (
                  <PiPause className="h-5 w-5 text-white" />
                ) : (
                  <PiMicrophone className="h-5 w-5 text-white" />
                )}
              </button>
              <div className="w-10 h-10">{/* Placeholder for symmetry */}</div>
            </div>
          )}
          <audio ref={audioPlayerRef} className="hidden" />
        </div>
      </div>
    </section>
  )
}
