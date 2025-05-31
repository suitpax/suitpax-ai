"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MdMic, MdMicOff, MdVolumeUp, MdGraphicEq } from "react-icons/md"
import { PiWaveformBold, PiSpeakerHighBold, PiMicrophoneBold } from "react-icons/pi"
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
  const [audioWaveform, setAudioWaveform] = useState<number[]>([])
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

  // Generar waveform simulado
  useEffect(() => {
    if (isListening || isPlaying) {
      const interval = setInterval(() => {
        setAudioWaveform(Array.from({ length: 20 }, () => Math.random() * 100))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setAudioWaveform([])
    }
  }, [isListening, isPlaying])

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
    setIsProcessing(false)

    // Generar audio de la respuesta usando Web Speech API como fallback
    await generateSpeech(response)
  }

  // Función para generar voz usando múltiples APIs
  const generateSpeech = async (text: string) => {
    try {
      setIsPlaying(true)

      // Intentar primero con ElevenLabs
      try {
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

        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)

          if (audioRef.current) {
            audioRef.current.src = audioUrl
            audioRef.current.play()
            return
          }
        }
      } catch (error) {
        console.log("ElevenLabs not available, using Web Speech API")
      }

      // Fallback a Web Speech API
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 0.8

        // Buscar una voz femenina en inglés
        const voices = speechSynthesis.getVoices()
        const femaleVoice =
          voices.find(
            (voice) =>
              voice.lang.includes("en") &&
              (voice.name.toLowerCase().includes("female") ||
                voice.name.toLowerCase().includes("woman") ||
                voice.name.toLowerCase().includes("samantha") ||
                voice.name.toLowerCase().includes("karen")),
          ) || voices.find((voice) => voice.lang.includes("en"))

        if (femaleVoice) {
          utterance.voice = femaleVoice
        }

        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)

        speechSynthesis.speak(utterance)
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
    <section className="w-full py-12 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-1.5 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={40}
                height={10}
                className="h-2 w-auto mr-1"
              />
              Voice AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <PiWaveformBold className="h-2.5 w-2.5 mr-1" />
              Real-time
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none mb-6">
            Talk to your AI travel assistant
          </h2>

          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the future of business travel with our advanced voice AI technology. Speak naturally and get
            intelligent responses about flights, hotels, and expenses.
          </p>
        </div>

        {/* Main Voice Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel - Features */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xl font-medium tracking-tighter text-black mb-6">Voice-Powered Features</h3>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <PiMicrophoneBold className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Natural Speech Recognition</h4>
                      <p className="text-xs text-gray-500">Speak naturally in multiple languages</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                      <PiSpeakerHighBold className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Intelligent Voice Responses</h4>
                      <p className="text-xs text-gray-500">High-quality AI voice synthesis</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                      <MdGraphicEq className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Real-time Processing</h4>
                      <p className="text-xs text-gray-500">Instant understanding and responses</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Voice Waveform Visualization */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <h4 className="font-medium text-sm mb-3">Voice Activity</h4>
                <div className="flex items-center justify-center h-16 gap-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gray-300 rounded-full"
                      animate={{
                        height: audioWaveform[i] ? `${Math.max(audioWaveform[i] * 0.4, 8)}px` : "8px",
                        backgroundColor: isListening || isPlaying ? "#000" : "#d1d5db",
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Center Panel - Main Voice Interface */}
            <div className="lg:col-span-8">
              <div className="relative">
                {/* Background Image */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <Image
                    src="/images/glass-cube-voice-bg.jpeg"
                    alt="Glass Cube Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 lg:p-12">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-4 border border-white/20">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                        <Image
                          src="/agents/agent-emma.jpeg"
                          alt="Emma - AI Travel Assistant"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white text-sm font-medium">Emma</span>
                      <span className="text-white/70 text-xs">AI Travel Assistant</span>
                      {isPlaying && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                          className="w-2 h-2 bg-green-400 rounded-full"
                        />
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-2">Suitpax AI Voice Assistant</h3>
                    <p className="text-white/80 text-sm">
                      Powered by advanced neural networks and natural language processing
                    </p>
                  </div>

                  {/* Voice Interface */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
                    {/* User Input */}
                    <div className="mb-4">
                      <label className="text-white/80 text-xs font-medium mb-2 block">Your Question</label>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/20">
                        <div
                          ref={userInputRef}
                          className="flex-1 py-2 px-3 text-sm text-white min-h-[40px] flex items-center"
                        >
                          {isListening && transcript ? (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-white font-medium"
                            >
                              {transcript}
                            </motion.span>
                          ) : !isListening && !transcript ? (
                            <span className="text-white/50">{voicePlaceholder}</span>
                          ) : null}
                        </div>

                        <motion.button
                          onClick={toggleListening}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            isListening
                              ? "bg-red-500 text-white shadow-lg animate-pulse"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          {isListening ? <MdMicOff className="w-5 h-5" /> : <MdMic className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Assistant Response */}
                    <div>
                      <label className="text-white/80 text-xs font-medium mb-2 block">Emma's Response</label>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10 border border-white/20 min-h-[80px]">
                        <div ref={assistantInputRef} className="flex-1 py-2 px-3 text-sm text-white flex items-start">
                          {isProcessing ? (
                            <div className="flex items-center space-x-2">
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                                className="flex space-x-1"
                              >
                                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                                <div className="w-2 h-2 rounded-full bg-white/60"></div>
                              </motion.div>
                              <span className="text-white/80 ml-2">Emma is thinking...</span>
                            </div>
                          ) : assistantResponse ? (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-white leading-relaxed"
                            >
                              {assistantResponse}
                            </motion.span>
                          ) : (
                            <span className="text-white/50">Ask me anything about your business travel...</span>
                          )}
                        </div>

                        {assistantResponse && (
                          <motion.button
                            onClick={() => generateSpeech(assistantResponse)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              isPlaying
                                ? "bg-blue-500 text-white animate-pulse"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            <MdVolumeUp className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-3">Try these voice commands:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        "Book me a flight to London",
                        "Find hotels in New York",
                        "Process my expenses",
                        "Check travel policy",
                      ].map((command, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleUserInput(command)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-full border border-white/20 transition-all"
                        >
                          "{command}"
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-2xl mx-auto">
              <h4 className="font-medium text-black mb-2">Powered by Suitpax AI Voice</h4>
              <p className="text-sm text-gray-600 mb-4">
                Advanced neural voice synthesis with multi-language support and real-time processing
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>• Natural Language Processing</span>
                <span>• Voice Synthesis</span>
                <span>• Real-time Translation</span>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl text-center max-w-md mx-auto"
              >
                {errorMessage}
              </motion.div>
            )}

            {!browserSupportsSpeechRecognition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-orange-50 border border-orange-200 text-orange-600 text-sm p-4 rounded-xl text-center max-w-md mx-auto"
              >
                Your browser doesn't support speech recognition. Try Chrome or Edge for the best experience.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio element oculto */}
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>
    </section>
  )
}
