"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MdMic, MdMicOff, MdVolumeUp } from "react-icons/md"
import { useSpeechToText } from "@/hooks/use-speech-recognition"

// Placeholder para el input de voz
const voicePlaceholder = "Ask about your business travel..."

// Respuestas predefinidas mejoradas para business travel y expense management
const businessTravelResponses = {
  flight: [
    "I found 3 direct flights to London departing tomorrow morning. British Airways at 9:30 AM for £420, Virgin Atlantic at 11:15 AM for £385, and Lufthansa at 2:45 PM for £445. Which would you prefer?",
    "There are excellent flight options to New York next week. Delta has a business class seat for $2,100 departing Monday at 8 AM, and American Airlines offers one for $1,950 on Tuesday at 10:30 AM.",
    "I can book your flight to Tokyo. JAL has availability in business class for $3,200 departing Friday evening, arriving Saturday morning local time. Shall I proceed with the booking?",
    "For your trip to Paris, I recommend Air France's morning flight at €450 or KLM's afternoon departure at €420. Both include checked baggage and are within your company's travel policy.",
  ],
  hotel: [
    "I've found premium hotels near your conference venue. The Marriott Downtown has executive rooms for £180/night, and the Hilton City Center offers suites for £220/night. Both include breakfast and WiFi.",
    "For your stay in San Francisco, I recommend the St. Regis near the financial district at $320/night, or the Four Seasons with bay views at $450/night. Both are within your company's travel policy.",
    "The Grand Hyatt in Singapore has availability for your dates at $280/night. It's 5 minutes from your client meeting location and includes airport transfer.",
    "I found the perfect hotel for your Berlin conference. The Adlon Kempinski offers luxury suites at €350/night, or the more budget-friendly Marriott at €180/night. Both have excellent business facilities.",
  ],
  expense: [
    "I've automatically categorized your recent expenses: £45 for airport parking, £120 for client dinner, and £85 for taxi rides. All receipts have been scanned and uploaded to your expense report.",
    "Your expense report for the London trip totals £1,240. This includes flights, accommodation, meals, and transportation. It's 15% under your allocated budget and ready for approval.",
    "I notice you haven't submitted receipts for your coffee meetings yesterday. Would you like me to remind you to photograph them, or shall I mark them as business entertainment expenses?",
    "Your monthly travel expenses are trending 12% lower than last quarter. You've saved €2,400 through smart booking choices and policy compliance. Great work!",
  ],
  policy: [
    "Your flight selection complies with company travel policy. Business class is approved for flights over 6 hours, and you're within the £2,000 budget limit for European travel.",
    "I've checked your hotel choice against company policy. The rate of £180/night is within the London allowance of £200/night, and the hotel has a corporate rate agreement.",
    "Your expense total is within policy limits. However, I notice the client dinner exceeded the £100 per person limit. Would you like me to add a business justification note?",
    "All your bookings are policy-compliant. You're using preferred suppliers and staying within budget limits. Your compliance score this quarter is 98%.",
  ],
  general: [
    "I'm Emma, your AI travel assistant. I can book flights, find hotels, manage expenses, and ensure policy compliance. What would you like assistance with today?",
    "I can help you plan your entire business trip from start to finish. Just tell me your destination, dates, and preferences, and I'll handle the rest while keeping you within company policy.",
    "As your intelligent travel companion, I can save you time on bookings, automatically process expenses, and provide real-time travel updates. How can I assist you today?",
    "Welcome! I'm here to make your business travel seamless. Whether you need flight bookings, hotel recommendations, or expense management, I'm ready to help.",
  ],
}

export default function AIVoiceAssistant() {
  const [userInput, setUserInput] = useState("")
  const [assistantResponse, setAssistantResponse] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-US")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{ type: "user" | "assistant"; text: string }>>(
    [],
  )
  const userInputRef = useRef<HTMLDivElement>(null)
  const assistantInputRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Speech to text para el input del usuario
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechToText({
    onTranscriptChange: (text) => {
      setUserInput(text)
    },
    onEnd: (finalTranscript) => {
      if (finalTranscript && finalTranscript.trim()) {
        setUserInput(finalTranscript)
        handleUserInput(finalTranscript)
      }
    },
    continuous: false,
    language: detectedLanguage,
    autoDetectLanguage: true,
  })

  const toggleListening = async () => {
    if (isListening) {
      stopListening()
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        resetTranscript()
        setUserInput("")
        setAssistantResponse("")
        startListening()
        setErrorMessage(null)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        setErrorMessage("Could not access microphone. Please check browser permissions.")
      }
    }
  }

  // Función para manejar el input del usuario y generar respuesta
  const handleUserInput = async (input: string) => {
    setIsProcessing(true)

    // Añadir al historial
    setConversationHistory((prev) => [...prev, { type: "user", text: input }])

    // Simular tiempo de procesamiento más realista
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Detectar el tipo de consulta y generar respuesta apropiada
    const lowerInput = input.toLowerCase()
    let response = ""

    if (
      lowerInput.includes("flight") ||
      lowerInput.includes("fly") ||
      lowerInput.includes("plane") ||
      lowerInput.includes("book")
    ) {
      response = businessTravelResponses.flight[Math.floor(Math.random() * businessTravelResponses.flight.length)]
    } else if (
      lowerInput.includes("hotel") ||
      lowerInput.includes("accommodation") ||
      lowerInput.includes("stay") ||
      lowerInput.includes("room")
    ) {
      response = businessTravelResponses.hotel[Math.floor(Math.random() * businessTravelResponses.hotel.length)]
    } else if (
      lowerInput.includes("expense") ||
      lowerInput.includes("receipt") ||
      lowerInput.includes("cost") ||
      lowerInput.includes("money") ||
      lowerInput.includes("budget")
    ) {
      response = businessTravelResponses.expense[Math.floor(Math.random() * businessTravelResponses.expense.length)]
    } else if (
      lowerInput.includes("policy") ||
      lowerInput.includes("compliance") ||
      lowerInput.includes("approve") ||
      lowerInput.includes("rule")
    ) {
      response = businessTravelResponses.policy[Math.floor(Math.random() * businessTravelResponses.policy.length)]
    } else {
      response = businessTravelResponses.general[Math.floor(Math.random() * businessTravelResponses.general.length)]
    }

    setAssistantResponse(response)
    setConversationHistory((prev) => [...prev, { type: "assistant", text: response }])
    setIsProcessing(false)

    // Generar audio de la respuesta automáticamente
    await generateSpeech(response)
  }

  // Función para generar voz usando ElevenLabs
  const generateSpeech = async (text: string) => {
    try {
      setIsPlaying(true)
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice (female English)
          language: "en-US",
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      setIsPlaying(false)
    }
  }

  // Manejar eventos de audio
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current

      const handleEnded = () => setIsPlaying(false)
      const handleError = () => setIsPlaying(false)

      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("error", handleError)

      return () => {
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("error", handleError)
      }
    }
  }, [])

  return (
    <section className="w-full py-12 md:py-24 bg-gray-300 text-black">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Coordenadas decorativas como en el componente Hiring */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            <div className="flex justify-between text-xs border-b border-black/20 pb-2 mb-8 w-[200%]">
              <span>37° 46' 30.0"</span>
              <span>N</span>
              <span>122° 25' 09.0"</span>
              <span>W</span>
              <span>37.7750</span>
              <span>↑</span>
              <span>-122.4194</span>
              <span>→</span>
              <span>San Francisco</span>
              <span>California</span>
              <span>37° 46' 30.0"</span>
              <span>N</span>
              <span>122° 25' 09.0"</span>
              <span>W</span>
              <span>37.7750</span>
              <span>↑</span>
              <span>-122.4194</span>
              <span>→</span>
              <span>San Francisco</span>
              <span>California</span>
            </div>
          </div>
        </div>

        <div className="pt-12">
          {/* Suitpax symbol en el centro */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo/suitpax-symbol-2.png"
              alt="Suitpax Symbol"
              width={30}
              height={30}
              className="rounded-lg"
            />
          </div>

          {/* Badges similares a AI Travel Agents */}
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[10px] font-medium text-black">
              Voice Assistant
            </span>
            <span className="inline-flex items-center rounded-xl bg-black/10 px-2.5 py-0.5 text-[9px] font-medium text-black">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              AI Powered
            </span>
          </div>

          {/* Título principal con estilo similar a AI Travel Agents */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl text-center mx-auto mb-4">
            Talk to your AI travel assistant
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl text-center mx-auto mb-12">
            Speak naturally and get intelligent responses about flights, hotels, and expenses
          </p>

          {/* Card principal con estilo del BusinessTravelPlatform */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl transition-all bg-gray-100 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black text-white">
                      <MdMic className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Voice Commands</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">Ask questions using your voice</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-xl transition-all hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                      <MdVolumeUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Voice Responses</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">Listen to AI responses</p>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-xl transition-all hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Personal Assistant</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">Tailored to your needs</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="h-full flex flex-col">
                <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-cover bg-center bg-gray-100">
                    <div className="absolute inset-0 bg-black/10"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11/12 md:w-4/5 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
                        <div className="flex flex-col">
                          {/* Header con avatar de Emma */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 overflow-hidden rounded-full border border-gray-200">
                                <Image
                                  src="/agents/agent-emma.jpeg"
                                  alt="Emma - AI Travel Assistant"
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                                {isPlaying && (
                                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Emma</h4>
                                <span className="text-[10px] text-gray-500">AI Travel Assistant</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-medium text-gray-500">VOICE ENABLED</span>
                          </div>

                          {/* Input del usuario */}
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50 mb-3">
                            <div
                              ref={userInputRef}
                              className="flex-1 py-1 px-2 text-xs text-gray-900 min-h-[24px] flex items-center"
                            >
                              {isListening && transcript ? (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="inline-block text-xs text-gray-900 font-medium"
                                >
                                  {transcript}
                                </motion.span>
                              ) : !isListening && !transcript ? (
                                <span className="inline-block text-xs text-gray-400">{voicePlaceholder}</span>
                              ) : null}
                            </div>
                            <button
                              onClick={toggleListening}
                              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                                isListening
                                  ? "bg-red-500 text-white animate-pulse"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              {isListening ? <MdMicOff className="h-3 w-3" /> : <MdMic className="h-3 w-3" />}
                            </button>
                          </div>

                          {/* Respuesta del asistente */}
                          <div className="flex items-start gap-2 p-2 rounded-lg border border-gray-200 bg-white">
                            <div
                              ref={assistantInputRef}
                              className="flex-1 py-1 px-2 text-xs text-gray-900 flex items-start"
                            >
                              {isProcessing ? (
                                <div className="flex items-center space-x-1">
                                  <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                                    className="flex space-x-1"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                  </motion.div>
                                  <span className="text-xs text-gray-500 ml-2">Thinking...</span>
                                </div>
                              ) : assistantResponse ? (
                                <motion.span
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="inline-block text-xs text-gray-900 leading-relaxed"
                                >
                                  {assistantResponse}
                                </motion.span>
                              ) : (
                                <span className="inline-block text-xs text-gray-400">
                                  Ask me anything about your business travel...
                                </span>
                              )}
                            </div>
                            {assistantResponse && (
                              <button
                                onClick={() => generateSpeech(assistantResponse)}
                                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                                  isPlaying
                                    ? "bg-blue-500 text-white animate-pulse"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                              >
                                <MdVolumeUp className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-medium tracking-tighter text-black mb-2">
                    Voice-Enabled Travel Assistant
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Emma can help you book flights, find hotels, and manage your travel expenses with simple voice
                    commands.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-xs font-medium text-gray-500 mb-3">EXAMPLE COMMANDS</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Book me a flight to London",
                        "Find hotels in New York",
                        "Process my expenses",
                        "Check travel policy",
                      ].map((example, i) => (
                        <motion.div
                          key={example}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, type: "spring", stiffness: 400, damping: 15 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                          onClick={() => handleUserInput(example)}
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                            <MdMic className="h-3 w-3 text-gray-700" />
                          </span>
                          <span className="text-xs font-medium">{example}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-1">POWERED BY ELEVENLABS</h4>
                <p className="text-sm text-gray-600">Natural voice technology for seamless communication</p>
              </div>
              <motion.div
                className="flex items-center gap-1 text-xs font-medium text-black"
                whileHover={{ scale: 1.05 }}
              >
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Audio element oculto */}
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>
    </section>
  )
}
