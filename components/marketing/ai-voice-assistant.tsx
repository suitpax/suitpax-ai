"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MdMic, MdMicOff, MdVolumeUp, MdSend } from "react-icons/md"
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
  const [activeFeature, setActiveFeature] = useState("voice")
  const userInputRef = useRef<HTMLDivElement>(null)
  const assistantInputRef = useRef<HTMLDivElement>(null)

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

    // Generar audio de la respuesta usando Web Speech API
    await generateSpeech(response)
  }

  // Función para generar voz usando Web Speech API nativa
  const generateSpeech = async (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        setIsPlaying(true)
        
        // Cancelar cualquier síntesis anterior
        window.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 0.8
        
        // Buscar una voz femenina en inglés
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('woman') ||
           voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('karen') ||
           voice.name.toLowerCase().includes('susan'))
        ) || voices.find(voice => voice.lang.includes('en'))
        
        if (femaleVoice) {
          utterance.voice = femaleVoice
        }
        
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      setIsPlaying(false)
    }
  }

  const features = [
    {
      id: "voice",
      title: "Voice Commands",
      description: "Natural speech recognition",
      icon: MdMic,
      color: "bg-blue-500",
    },
    {
      id: "responses",
      title: "AI Responses",
      description: "Intelligent voice replies",
      icon: MdVolumeUp,
      color: "bg-green-500",
    },
    {
      id: "assistant",
      title: "Personal Assistant",
      description: "24/7 travel support",
      icon: MdSend,
      color: "bg-purple-500",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50 text-black">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12">
          {/* Logo pequeño */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax"
              width={80}
              height={20}
              className="h-5 w-auto"
            />
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <span className="inline-flex items-center rounded-xl bg-black/10 px-3 py-1 text-xs font-medium text-black">
              Voice Assistant
            </span>
            <span className="inline-flex items-center rounded-xl bg-black/10 px-3 py-1 text-xs font-medium text-black">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
              AI Powered
            </span>
          </div>

          {/* Título principal */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black leading-none max-w-5xl mx-auto mb-6">
            Talk to your AI travel assistant
          </h2>
          <p className="text-sm sm:text-base font-medium text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the future of business travel with voice-enabled AI that understands your needs and responds instantly
          </p>
        </div>

        {/* Layout principal responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Panel lateral de características */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-medium tracking-tighter text-black mb-4">Features</h3>
            {features.map((feature) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                  activeFeature === feature.id
                    ? "bg-white border-gray-300 shadow-lg"
                    : "bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${feature.color} text-white`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-black">{feature.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  {activeFeature === feature.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 rounded-full bg-black"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </motion.button>
            ))}

            {/* Estadísticas */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
              <h4 className="text-sm font-medium text-black mb-3">Voice AI Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Response Time</span>
                  <span className="text-xs font-medium text-black">< 2s</span>\
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Accuracy</span>
                  <span className="text-xs font-medium text-black">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Languages</span>
                  <span className="text-xs font-medium text-black">12+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel principal de chat */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Header del chat */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-gray-200">
                      <Image
                        src="/agents/agent-emma.jpeg"
                        alt="Emma - AI Travel Assistant"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-black">Emma</h4>
                      <p className="text-xs text-gray-600">AI Travel Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Área de chat */}
              <div className="p-6 min-h-[300px] flex flex-col">
                {/* Input del usuario */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Your Message</label>
                  <div className="relative flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-gray-300 transition-colors">
                    <div
                      ref={userInputRef}
                      className="flex-1 py-2 px-3 text-sm text-gray-900 min-h-[40px] flex items-center"
                    >
                      {isListening && transcript ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="inline-block text-sm text-gray-900 font-medium"
                        >
                          {transcript}
                        </motion.span>
                      ) : !isListening && !transcript ? (
                        <span className="inline-block text-sm text-gray-400">{voicePlaceholder}</span>
                      ) : null}
                    </div>

                    <motion.button
                      onClick={toggleListening}
                      className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                        isListening
                          ? "bg-red-500 text-white shadow-lg scale-110"
                          : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
                      }`}
                      whileHover={{ scale: isListening ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isListening ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
                    </motion.button>

                    {/* Indicador de escucha */}
                    <AnimatePresence>
                      {isListening && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg"
                        >
                          Listening...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Respuesta del asistente */}
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Emma's Response</label>
                  <div className="relative flex items-start gap-3 p-4 rounded-xl border-2 border-blue-100 bg-blue-50/50 min-h-[120px]">
                    <div ref={assistantInputRef} className="flex-1 py-2 text-sm text-gray-900">
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                            className="flex space-x-1"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          </motion.div>
                          <span className="text-sm text-blue-600 ml-2">Emma is thinking...</span>
                        </div>
                      ) : assistantResponse ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <p className="text-sm text-gray-900 leading-relaxed">{assistantResponse}</p>
                        </motion.div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Ask me anything about your business travel and I'll help you instantly...
                        </span>
                      )}
                    </div>

                    {assistantResponse && (
                      <motion.button
                        onClick={() => generateSpeech(assistantResponse)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                          isPlaying
                            ? "bg-blue-500 text-white shadow-lg animate-pulse"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdVolumeUp className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer con ejemplos */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-3 text-center">Try these voice commands:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Book me a flight to London",
                    "Find hotels in New York",
                    "Process my expenses",
                    "Check travel policy",
                  ].map((example, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUserInput(example)}
                      className="text-xs bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition-all duration-300 border border-gray-200 text-left"
                    >
                      <MdMic className="inline w-3 h-3 mr-2 text-gray-500" />
                      "{example}"
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer informativo */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-1">POWERED BY SUITPAX AI VOICE</h4>
                  <p className="text-sm text-gray-600">Advanced voice recognition and natural language processing</p>
                </div>
                <motion.div
                  className="flex items-center gap-1 text-xs font-medium text-black cursor-pointer"
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
          </div>
        </div>

        {/* Mensajes de estado */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-sm text-red-600 text-center bg-red-50 px-4 py-3 rounded-xl border border-red-200 max-w-2xl mx-auto"
            >
              {errorMessage}
            </motion.div>
          )}

          {!browserSupportsSpeechRecognition && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-sm text-orange-600 text-center bg-orange-50 px-4 py-3 rounded-xl border border-orange-200 max-w-2xl mx-auto"
            >
              Your browser doesn't support speech recognition. Try Chrome or Edge for the best experience.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
