"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  PiMicrophoneFill,
  PiPhoneFill,
  PiPauseFill,
  PiPlayFill,
  PiWaveformBold,
  PiXBold,
  PiGlobeSimpleBold,
  PiStarFill,
} from "react-icons/pi"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import { ELEVENLABS_VOICES } from "@/lib/elevenlabs"
import { getSupportedLanguages, detectLanguage } from "@/lib/language-detection"

// Message type
interface Message {
  id: string
  sender: "user" | "assistant"
  text: string
  timestamp: Date
  audioUrl?: string
  language?: string
}

export default function AIAgentVoice() {
  // Interface states
  const [isCallActive, setIsCallActive] = useState(false)
  const [activeTab, setActiveTab] = useState("voice")
  const [audioProgress, setAudioProgress] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAssistant, setCurrentAssistant] = useState({
    id: "emma",
    name: "Emma",
    role: "Executive Travel Assistant",
    image: "/agents/agent-13.png",
    voiceId: ELEVENLABS_VOICES.EMMA,
    rating: 4.9,
    calls: 47,
  })
  const [supportedLanguages] = useState(getSupportedLanguages())
  const [showLanguageIndicator, setShowLanguageIndicator] = useState(false)

  // References
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)

  // Audio recorder hook
  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    error: recordingError,
  } = useAudioRecorder({
    onRecordingComplete: handleRecordingComplete,
  })

  // Speech recognition hook with language detection
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechRecognitionError,
    browserSupportsSpeechRecognition,
    detectedLanguage,
  } = useSpeechToText({
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

  // Effect to show language indicator
  useEffect(() => {
    if (detectedLanguage && detectedLanguage !== "en-US") {
      setShowLanguageIndicator(true)
      const timer = setTimeout(() => {
        setShowLanguageIndicator(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [detectedLanguage])

  // Effect to start conversation when call is activated
  useEffect(() => {
    if (isCallActive && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now().toString(),
        sender: "assistant" as const,
        text: `Hello! I'm ${currentAssistant.name}, your Suitpax AI ${currentAssistant.role.toLowerCase()}. How can I help you today?`,
        timestamp: new Date(),
        language: "en-US",
      }

      setMessages([welcomeMessage])

      // Convert welcome message to speech
      convertTextToSpeech(welcomeMessage.text, currentAssistant.voiceId).then((audioUrl) => {
        setMessages((prev) => prev.map((msg) => (msg.id === welcomeMessage.id ? { ...msg, audioUrl } : msg)))

        // Auto-play welcome message
        if (audioPlayerRef.current && audioUrl) {
          audioPlayerRef.current.src = audioUrl
          audioPlayerRef.current.play()
        }
      })
    }
  }, [isCallActive, messages.length, currentAssistant])

  // Effect to simulate audio progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive && audioPlayerRef.current) {
      interval = setInterval(() => {
        if (audioPlayerRef.current) {
          const duration = audioPlayerRef.current.duration || 1
          const currentTime = audioPlayerRef.current.currentTime
          const progress = (currentTime / duration) * 100
          setAudioProgress(progress)
        }
      }, 100)
    } else {
      setAudioProgress(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCallActive])

  // Effect to animate waveform
  useEffect(() => {
    if ((isRecording || isListening) && waveformRef.current) {
      const waveformBars = waveformRef.current.querySelectorAll("div[data-waveform-bar]")

      waveformBars.forEach((bar, index) => {
        const animateBar = () => {
          const randomHeight = Math.random() * 24 + 4
          const htmlBar = bar as HTMLElement
          htmlBar.style.height = `${randomHeight}px`
          htmlBar.style.opacity = `${0.3 + Math.random() * 0.7}`
        }

        const interval = setInterval(animateBar, 200 + Math.random() * 300)
        return () => clearInterval(interval)
      })
    }
  }, [isRecording, isListening])

  // Function to handle completed recording
  async function handleRecordingComplete(blob: Blob) {
    if (!blob) return

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: "Processing your message...",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsProcessing(true)

      try {
        const { text, detectedLanguage } = await convertSpeechToText(blob)

        setMessages((prev) =>
          prev.map((msg) => (msg.id === userMessage.id ? { ...msg, text, language: detectedLanguage } : msg)),
        )

        await processUserMessage(text, userMessage.id, detectedLanguage)
      } catch (error) {
        console.error("Transcription error:", error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, text: "Sorry, I couldn't understand what you said. Could you try again?" }
              : msg,
          ),
        )
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      setIsProcessing(false)
    }
  }

  // Update toggleRecording function to use the new hook
  const toggleRecording = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Function to process user message and generate response
  async function processUserMessage(userText: string, userMessageId: string, detectedLang?: string) {
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userLanguage = detectedLang || detectLanguage(userText).speechCode

    let responseText = ""
    let responseLanguage = userLanguage

    // Responses in different languages based on detected language
    if (userLanguage === "es-ES") {
      if (
        userText.toLowerCase().includes("vuelo") ||
        userText.toLowerCase().includes("madrid") ||
        userText.toLowerCase().includes("nueva york")
      ) {
        responseText =
          "I found several flight options from Madrid to New York for next week. The best morning flights are with Iberia at 10:30 AM and Delta at 11:15 AM. Would you like more details on these options?"
      } else if (userText.toLowerCase().includes("hotel") || userText.toLowerCase().includes("alojamiento")) {
        responseText =
          "I can recommend several hotels in New York based on your preferences. The Hilton Midtown and The Peninsula are excellent options for business travelers. Would you like me to book a room for you?"
      } else {
        responseText =
          "I understand you need help with your travel plans. Could you provide more details about your requirements so I can help you better?"
      }
      responseLanguage = "en-US" // Keep responses in English
    } else {
      // English responses by default
      responseLanguage = "en-US"
      if (
        userText.toLowerCase().includes("flight") ||
        userText.toLowerCase().includes("madrid") ||
        userText.toLowerCase().includes("new york")
      ) {
        responseText =
          "I've found several options for flights from Madrid to New York next week. The best morning flights are with Iberia at 10:30 AM and Delta at 11:15 AM. Would you like me to provide more details on these options?"
      } else if (userText.toLowerCase().includes("hotel") || userText.toLowerCase().includes("stay")) {
        responseText =
          "I can recommend several hotels in New York based on your preferences. The Hilton Midtown and The Peninsula are excellent options for business travelers. Would you like me to book a room for you?"
      } else if (
        userText.toLowerCase().includes("budget") ||
        userText.toLowerCase().includes("cost") ||
        userText.toLowerCase().includes("price")
      ) {
        responseText =
          "Based on current rates, your trip to New York would cost approximately $2,800, including flights, 4 nights at a business hotel, and transportation. This is within your company's travel policy limits."
      } else {
        responseText =
          "I understand you need assistance with your travel plans. Could you provide more details about your trip requirements so I can help you better?"
      }
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      sender: "assistant",
      text: responseText,
      timestamp: new Date(),
      language: responseLanguage,
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      const audioUrl = await convertTextToSpeech(responseText, currentAssistant.voiceId, responseLanguage)

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

  // Function to convert speech to text using ElevenLabs API
  async function convertSpeechToText(audioBlob: Blob): Promise<{ text: string; detectedLanguage: string }> {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch("/api/elevenlabs/speech-to-text", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()

      if (!data.text || data.text.trim() === "") {
        throw new Error("No speech detected")
      }

      const detected = detectLanguage(data.text)

      return {
        text: data.text,
        detectedLanguage: detected.speechCode,
      }
    } catch (error) {
      console.error("Error in speech-to-text:", error)
      throw error
    }
  }

  // Function to convert text to speech using ElevenLabs API
  async function convertTextToSpeech(text: string, voiceId: string, language = "en-US"): Promise<string> {
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voiceId, language }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      return URL.createObjectURL(audioBlob)
    } catch (error) {
      console.error("Error in text-to-speech:", error)
      throw error
    }
  }

  // Function to start/stop call
  const toggleCall = () => {
    if (isCallActive) {
      if (isRecording) {
        stopRecording()
      }

      if (isListening) {
        stopListening()
      }

      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
      }
    }

    setIsCallActive(!isCallActive)
  }

  // Function to get language name from code
  const getLanguageName = (code: string) => {
    const language = supportedLanguages.find((lang) => lang.speechCode === code)
    return language ? language.name : "Unknown"
  }

  // Function to get native language name from code
  const getLanguageNativeName = (code: string) => {
    const language = supportedLanguages.find((lang) => lang.speechCode === code)
    return language ? language.nativeName : "Unknown"
  }

  const assistants = [
    {
      id: "emma",
      name: "Emma",
      role: "Executive Travel Assistant",
      image: "/agents/agent-13.png",
      voiceId: ELEVENLABS_VOICES.EMMA,
      rating: 4.9,
      calls: 47,
    },
    {
      id: "sophia",
      name: "Sophia",
      role: "Concierge",
      image: "/agents/agent-30.png",
      voiceId: ELEVENLABS_VOICES.SOPHIA,
      rating: 4.8,
      calls: 32,
    },
    {
      id: "michael",
      name: "Michael",
      role: "Flight Specialist",
      image: "/agents/agent-5.png",
      voiceId: ELEVENLABS_VOICES.MICHAEL,
      rating: 4.7,
      calls: 28,
    },
  ]

  return (
    <section className="w-full py-20 md:py-28 bg-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[9px] font-medium text-gray-300 border border-gray-700">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Voice AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[8px] font-medium text-gray-300 border border-gray-700">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse mr-1"></span>
              Coming Q2 2025
            </span>
          </div>

          <motion.h2
            className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-white leading-none max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI-Powered Voice Conversations
          </motion.h2>

          {/* AI Agent Video - Small but spectacular */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 mb-8"
          >
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supermotion_co%20%282%29-LZW6upr6wueJqrBR2IXAVsHnPh3bJs.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-1 left-1 right-1 text-center">
                <span className="text-[8px] font-medium text-white bg-black/50 rounded-full px-2 py-0.5">
                  Live AI Agent
                </span>
              </div>
            </div>
          </motion.div>

          <div className="max-w-5xl mx-auto w-full">
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-5 h-full">
                {/* Left sidebar */}
                <div className="md:col-span-1 bg-gray-800/50 border-r border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="bg-gray-700 rounded-full p-1">
                      <Image
                        src="/logo/suitpax-cloud-logo.webp"
                        alt="Suitpax"
                        width={16}
                        height={16}
                        className="h-3 w-auto"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-300">Suitpax Voice</span>
                  </div>

                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab("voice")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center space-x-2 ${
                        activeTab === "voice" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"
                      }`}
                    >
                      <PiWaveformBold className="h-3.5 w-3.5" />
                      <span>Voice Chat</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center space-x-2 ${
                        activeTab === "history" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M12 8v4l3 3" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <span>History</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center space-x-2 ${
                        activeTab === "settings" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Settings</span>
                    </button>
                  </nav>

                  <div className="mt-8">
                    <p className="text-[10px] text-gray-500 mb-2 font-medium">VOICE ASSISTANTS</p>
                    <div className="space-y-2">
                      {assistants.map((assistant) => (
                        <div
                          key={assistant.id}
                          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            currentAssistant.id === assistant.id
                              ? "bg-gray-700 border border-gray-600"
                              : "hover:bg-gray-700/50"
                          }`}
                          onClick={() => setCurrentAssistant(assistant)}
                        >
                          <Image
                            src={assistant.image || "/placeholder.svg"}
                            alt={assistant.name}
                            width={24}
                            height={24}
                            className="rounded-full h-6 w-6 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{assistant.name}</p>
                            <div className="flex items-center gap-1">
                              <PiStarFill className="w-2 h-2 text-yellow-400" />
                              <span className="text-[9px] text-gray-400">{assistant.rating}</span>
                            </div>
                          </div>
                          {currentAssistant.id === assistant.id && (
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="md:col-span-4 flex flex-col h-full min-h-[550px]">
                  {/* Header */}
                  <div className="border-b border-gray-700 p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={currentAssistant.image || "/placeholder.svg"}
                        alt={currentAssistant.name}
                        width={32}
                        height={32}
                        className="rounded-full h-8 w-8 object-cover"
                      />
                      <div>
                        <p className="text-sm text-white font-medium">{currentAssistant.name}</p>
                        <p className="text-xs text-gray-400">{currentAssistant.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Language indicator */}
                      <AnimatePresence>
                        {showLanguageIndicator && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-[8px] font-medium text-gray-300 border border-gray-600"
                          >
                            <PiGlobeSimpleBold className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{getLanguageName(detectedLanguage)}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-[8px] font-medium text-gray-300 border border-gray-600">
                        <span className="mr-1.5">Suitpax AI</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>

                  {/* Conversation area */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-gray-800/30">
                    <AnimatePresence>
                      {isCallActive ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex items-start space-x-3 mb-4 ${
                                message.sender === "user" ? "justify-end flex-row-reverse space-x-reverse" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 mt-1">
                                <div
                                  className={`h-6 w-6 rounded-full ${
                                    message.sender === "user"
                                      ? "bg-white flex items-center justify-center"
                                      : "bg-gray-700 flex items-center justify-center"
                                  }`}
                                >
                                  {message.sender === "user" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-3 w-3 text-black"
                                    >
                                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                      <circle cx="12" cy="7" r="4" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-3 w-3 text-gray-300"
                                    >
                                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div
                                  className={`${
                                    message.sender === "user"
                                      ? "bg-white rounded-lg rounded-tr-none"
                                      : "bg-gray-700 rounded-lg rounded-tl-none"
                                  } p-3 text-xs ${message.sender === "user" ? "text-black" : "text-gray-200"}`}
                                >
                                  {message.text}
                                  {message.language && message.language !== "en-US" && (
                                    <span className="ml-2 inline-flex items-center text-[8px] opacity-70">
                                      <PiGlobeSimpleBold className="h-2 w-2 mr-0.5" />
                                      {getLanguageNativeName(message.language)}
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={`mt-1 flex items-center ${message.sender === "user" ? "justify-end" : ""}`}
                                >
                                  <span className="text-[10px] text-gray-500">
                                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  {message.sender === "assistant" && message.audioUrl && (
                                    <button
                                      className="ml-2 text-gray-400 hover:text-gray-200"
                                      onClick={() => {
                                        if (audioPlayerRef.current && message.audioUrl) {
                                          audioPlayerRef.current.src = message.audioUrl
                                          audioPlayerRef.current.play()
                                        }
                                      }}
                                    >
                                      <PiPlayFill className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {isProcessing && (
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3 text-gray-300"
                                  >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-700 rounded-lg rounded-tl-none p-3">
                                  <div className="flex items-center space-x-1 h-4">
                                    <motion.div
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                                      className="flex space-x-1"
                                    >
                                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                    </motion.div>
                                  </div>
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
                          <h3 className="text-lg font-medium text-white mb-2">{currentAssistant.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{currentAssistant.role}</p>
                          <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-1">
                              <PiStarFill className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs text-gray-400">{currentAssistant.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-400">{currentAssistant.calls} calls today</span>
                          </div>
                          <p className="text-xs text-gray-500 max-w-md mb-8">
                            Start a voice conversation with {currentAssistant.name} to plan your next business trip,
                            book flights, find hotels, and more. Powered by Suitpax AI technology.
                          </p>
                          <button
                            onClick={toggleCall}
                            className="bg-white hover:bg-gray-100 text-black rounded-xl px-8 py-3 text-sm flex items-center space-x-2 font-medium shadow-lg"
                          >
                            <PiPhoneFill className="h-4 w-4" />
                            <span>Start Conversation</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Audio controls */}
                  {isCallActive && (
                    <div className="border-t border-gray-700 p-4">
                      <div className="mb-3">
                        <div className="relative h-10 bg-gray-800 rounded-lg overflow-hidden">
                          <div ref={waveformRef} className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center space-x-[2px] h-full px-2">
                              {Array.from({ length: 60 }).map((_, index) => (
                                <motion.div
                                  key={index}
                                  data-waveform-bar
                                  className={`w-[2px] rounded-full ${isListening ? "bg-white" : "bg-gray-600"}`}
                                  initial={{ height: 4 }}
                                  animate={
                                    isListening
                                      ? {
                                          height: [4, 8 + Math.random() * 16, 4],
                                          opacity: [0.3, 0.7, 0.3],
                                        }
                                      : {}
                                  }
                                  transition={{
                                    repeat: isListening ? Number.POSITIVE_INFINITY : 0,
                                    duration: 0.5 + Math.random() * 0.5,
                                    ease: "easeInOut",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                          <div
                            className="h-full bg-gray-600"
                            style={{ width: `${audioProgress}%`, transition: "width 0.1s linear" }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={toggleRecording}
                            disabled={isProcessing}
                            className={`rounded-xl p-2.5 ${
                              isListening
                                ? "bg-red-500"
                                : isProcessing
                                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                                  : "bg-gray-700 hover:bg-gray-600"
                            } transition-colors shadow-sm`}
                          >
                            {isListening ? (
                              <PiPauseFill className="h-4 w-4 text-white" />
                            ) : (
                              <PiMicrophoneFill className="h-4 w-4 text-gray-300" />
                            )}
                          </button>
                          <button
                            className="rounded-xl p-2.5 bg-gray-700 hover:bg-gray-600 transition-colors shadow-sm"
                            onClick={() => {
                              if (audioPlayerRef.current) {
                                audioPlayerRef.current.play()
                              }
                            }}
                          >
                            <PiPlayFill className="h-4 w-4 text-gray-300" />
                          </button>

                          <button
                            className="rounded-xl p-2.5 bg-gray-700 hover:bg-gray-600 transition-colors shadow-sm"
                            onClick={() => setShowLanguageIndicator(!showLanguageIndicator)}
                          >
                            <PiGlobeSimpleBold className="h-4 w-4 text-gray-300" />
                          </button>
                        </div>

                        <div className="text-xs text-gray-400">
                          {audioPlayerRef.current
                            ? `${Math.floor(audioPlayerRef.current.currentTime / 60)}:${Math.floor(
                                audioPlayerRef.current.currentTime % 60,
                              )
                                .toString()
                                .padStart(2, "0")}`
                            : "0:00"}
                        </div>

                        <button
                          onClick={toggleCall}
                          className="rounded-xl p-2.5 bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <PiXBold className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      {/* Hidden audio player */}
                      <audio ref={audioPlayerRef} className="hidden" onEnded={() => setAudioProgress(0)} />

                      {recordingError && <p className="text-xs text-red-400 mt-2">{recordingError}</p>}
                      {speechRecognitionError && <p className="text-xs text-red-400 mt-2">{speechRecognitionError}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics in vertical format similar to Hero badges */}
            <div className="flex flex-col space-y-2 mt-8">
              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                  <span>Voice Recognition</span>
                </div>
                <span className="font-medium ml-2">99% Accuracy</span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                  <span>Language Support</span>
                </div>
                <span className="font-medium ml-2">40+ Languages</span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                  <span>Response Time</span>
                </div>
                <span className="font-medium ml-2">0.8s Average</span>
              </div>

              <div className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-medium text-gray-300 border border-gray-700 shadow-sm">
                <div className="flex-1 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                  <span>Powered by</span>
                </div>
                <span className="font-medium ml-2">ElevenLabs & Suitpax AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
