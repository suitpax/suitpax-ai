"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MdMic, MdMicOff, MdVolumeUp, MdSend, MdStop } from "react-icons/md"
import { PiGlobeSimpleBold, PiWaveformBold } from "react-icons/pi"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import { detectLanguage } from "@/lib/language-detection"

interface Message {
  id: string
  sender: "user" | "assistant"
  text: string
  timestamp: Date
  language?: string
  audioUrl?: string
}

export default function AIVoiceAssistant() {
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-US")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentAgent] = useState({
    name: "Emma",
    role: "AI Travel Assistant",
    image: "/agents/agent-emma.jpeg",
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveformRef = useRef<HTMLDivElement | null>(null)

  // Speech-to-text configuration
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
      setInputText(text)

      if (text.length > 10) {
        const detected = detectLanguage(text)
        if (detected.confidence > 0.6) {
          setDetectedLanguage(detected.speechCode)
        }
      }
    },
    onEnd: (finalTranscript) => {
      if (finalTranscript.trim()) {
        setInputText(finalTranscript)
        processUserInput(finalTranscript)
      }
    },
    continuous: false,
    language: detectedLanguage,
    autoDetectLanguage: true,
  })

  // Waveform animation effect
  useEffect(() => {
    if (isListening && waveformRef.current) {
      const waveformBars = waveformRef.current.querySelectorAll("[data-waveform-bar]")

      const intervals: NodeJS.Timeout[] = []

      waveformBars.forEach((bar, index) => {
        const animateBar = () => {
          const randomHeight = Math.random() * 20 + 4
          const htmlBar = bar as HTMLElement
          htmlBar.style.height = `${randomHeight}px`
          htmlBar.style.opacity = `${0.4 + Math.random() * 0.6}`
        }

        const interval = setInterval(animateBar, 150 + Math.random() * 200)
        intervals.push(interval)
      })

      return () => {
        intervals.forEach(clearInterval)
      }
    }
  }, [isListening])

  const toggleListening = async () => {
    if (isListening) {
      stopListening()
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        resetTranscript()
        setInputText("")
        setErrorMessage(null)
        startListening()
      } catch (error) {
        console.error("Error accessing microphone:", error)
        setErrorMessage("Could not access microphone. Please check browser permissions.")
      }
    }
  }

  const processUserInput = async (userInput: string) => {
    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userInput,
      timestamp: new Date(),
      language: detectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate contextual response based on input
    const response = generateResponse(userInput, detectedLanguage)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "assistant",
      text: response.text,
      timestamp: new Date(),
      language: response.language,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsProcessing(false)

    // Convert response to speech
    await convertTextToSpeech(response.text, response.language)
  }

  const generateResponse = (input: string, language: string) => {
    const lowerInput = input.toLowerCase()

    if (language === "es-ES" || language.startsWith("es")) {
      if (lowerInput.includes("vuelo") || lowerInput.includes("volar") || lowerInput.includes("avión")) {
        return {
          text: "He encontrado varias opciones de vuelos para ti. Los mejores vuelos salen por la mañana con Iberia a las 10:30 y con Delta a las 11:15. Ambos cumplen con la política de viajes de tu empresa. ¿Te gustaría que proceda con la reserva?",
          language: "es-ES",
        }
      } else if (
        lowerInput.includes("hotel") ||
        lowerInput.includes("alojamiento") ||
        lowerInput.includes("hospedaje")
      ) {
        return {
          text: "Te recomiendo el Marriott del centro y el Hilton Business Center para tu estancia. Ambos ofrecen salas ejecutivas y están dentro de tu presupuesto aprobado de 300 euros por noche. ¿Quieres que reserve una habitación con salida tardía?",
          language: "es-ES",
        }
      } else if (lowerInput.includes("gasto") || lowerInput.includes("recibo") || lowerInput.includes("costo")) {
        return {
          text: "Categorizaré automáticamente tus gastos de viaje y los enviaré para aprobación. Tu utilización actual del presupuesto de viaje está al 78%, bien dentro de los límites de la política. Todos los recibos serán capturados y procesados digitalmente.",
          language: "es-ES",
        }
      } else {
        return {
          text: "Entiendo que necesitas ayuda con tus arreglos de viaje de negocios. Puedo ayudarte a reservar vuelos, hoteles, gestionar gastos y coordinar tu horario. ¿En qué aspecto específico te gustaría que te ayude?",
          language: "es-ES",
        }
      }
    } else {
      // English responses
      if (lowerInput.includes("flight") || lowerInput.includes("fly") || lowerInput.includes("plane")) {
        return {
          text: "I've found several flight options for you. The best morning flights are with Iberia at 10:30 AM and Delta at 11:15 AM. Both comply with your company's travel policy. Would you like me to proceed with the booking?",
          language: "en-US",
        }
      } else if (lowerInput.includes("hotel") || lowerInput.includes("accommodation") || lowerInput.includes("stay")) {
        return {
          text: "I recommend the Marriott Downtown and Hilton Business Center for your stay. Both offer executive lounges and are within your approved budget of 300 euros per night. Shall I reserve a room with late checkout privileges?",
          language: "en-US",
        }
      } else if (lowerInput.includes("expense") || lowerInput.includes("receipt") || lowerInput.includes("cost")) {
        return {
          text: "I'll automatically categorize your travel expenses and submit them for approval. Your current trip budget utilization is at 78%, well within policy limits. All receipts will be digitally captured and processed.",
          language: "en-US",
        }
      } else if (lowerInput.includes("meeting") || lowerInput.includes("schedule") || lowerInput.includes("calendar")) {
        return {
          text: "I've synchronized your travel itinerary with your calendar. Your meetings are scheduled around your flight times, and I've added buffer time for airport transfers. Would you like me to send calendar invites to all participants?",
          language: "en-US",
        }
      } else {
        return {
          text: "I understand you need assistance with your business travel arrangements. I can help you book flights, reserve hotels, manage expenses, and coordinate your schedule. What specific aspect would you like me to help you with?",
          language: "en-US",
        }
      }
    }
  }

  const convertTextToSpeech = async (text: string, language = "en-US") => {
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - Female voice
          language,
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
        setIsPlayingAudio(true)
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error)
      // Fallback to browser speech synthesis
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language
        utterance.rate = 0.9
        utterance.pitch = 1.1
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handleManualSubmit = () => {
    if (inputText.trim()) {
      processUserInput(inputText)
      setInputText("")
    }
  }

  const clearConversation = () => {
    setMessages([])
    setInputText("")
    setErrorMessage(null)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-1.5 mb-3">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={50}
                  height={12}
                  className="h-2.5 w-auto mr-1"
                />
                Voice Intelligence
              </span>
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
                Real-time Speech
              </span>
            </div>

            <h2 className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
              Intelligent Voice Assistant for Business Travel
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">
              Speak naturally to manage your travel, expenses, and bookings with AI-powered voice recognition.
            </p>
            <p className="mt-2 text-xs font-light text-gray-500 max-w-2xl">
              Real-time transcription, intelligent responses, and seamless integration with your workflow.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80">
              <div className="flex items-center space-x-3">
                <Image
                  src={currentAgent.image || "/placeholder.svg"}
                  alt={currentAgent.name}
                  width={48}
                  height={48}
                  className="rounded-full h-12 w-12 object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-sm font-medium text-black">{currentAgent.name}</h3>
                  <p className="text-xs text-gray-600">{currentAgent.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[8px] font-medium text-gray-700 border border-gray-200">
                  <PiGlobeSimpleBold className="h-3 w-3 mr-1 text-gray-500" />
                  <span>{detectedLanguage === "es-ES" ? "Español" : "English"}</span>
                </div>
                <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[8px] font-medium text-gray-700 border border-gray-200">
                  <span className="mr-1.5">AI Powered</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="h-80 overflow-y-auto p-6 bg-gradient-to-b from-white/90 to-white/70">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <Image
                      src={currentAgent.image || "/placeholder.svg"}
                      alt={currentAgent.name}
                      width={80}
                      height={80}
                      className="rounded-full h-20 w-20 object-cover mb-4 border-2 border-gray-200"
                    />
                    <h3 className="text-lg font-medium text-black mb-2">{currentAgent.name}</h3>
                    <p className="text-sm text-gray-600 mb-6">{currentAgent.role}</p>
                    <p className="text-xs text-gray-500 max-w-md">
                      Start speaking to {currentAgent.name} about your travel needs. I can help you book flights, find
                      hotels, manage expenses, and more.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start space-x-3 ${
                          message.sender === "user" ? "justify-end flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              message.sender === "user" ? "bg-black" : "bg-gray-100"
                            }`}
                          >
                            {message.sender === "user" ? (
                              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <PiWaveformBold className="h-3 w-3 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div
                            className={`p-3 rounded-lg text-xs ${
                              message.sender === "user"
                                ? "bg-black text-white rounded-tr-none"
                                : "bg-gray-100 text-gray-700 rounded-tl-none"
                            }`}
                          >
                            {message.text}
                          </div>
                          <div
                            className={`mt-1 flex items-center text-[10px] text-gray-500 ${
                              message.sender === "user" ? "justify-end" : ""
                            }`}
                          >
                            <span>
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {message.sender === "assistant" && (
                              <button
                                className="ml-2 text-gray-500 hover:text-gray-700"
                                onClick={() => convertTextToSpeech(message.text, message.language)}
                              >
                                <MdVolumeUp className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <PiWaveformBold className="h-3 w-3 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg rounded-tl-none p-3">
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
                      </motion.div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Section */}
            <div className="p-6 border-t border-gray-200 bg-white/80">
              {/* Waveform Visualizer */}
              <div className="mb-4">
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div ref={waveformRef} className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center space-x-[2px] h-full px-2">
                      {Array.from({ length: 50 }).map((_, index) => (
                        <div
                          key={index}
                          data-waveform-bar
                          className={`w-[2px] rounded-full transition-all duration-200 ${
                            isListening ? "bg-black" : "bg-gray-400"
                          }`}
                          style={{ height: "4px" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input and Controls */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type your message or click the microphone to speak..."}
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && handleManualSubmit()}
                  />
                </div>

                <button
                  onClick={toggleListening}
                  disabled={isProcessing}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                      : isProcessing
                        ? "bg-gray-300 opacity-50 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleManualSubmit}
                  disabled={!inputText.trim() || isProcessing}
                  className="flex items-center justify-center w-12 h-12 rounded-xl bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MdSend className="h-4 w-4" />
                </button>

                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <MdStop className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Error Messages */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
              )}

              {!browserSupportsSpeechRecognition && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    Your browser doesn't support speech recognition. Please try Chrome or Edge for the best experience.
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 bg-gray-50">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">Real-time</div>
                <div className="text-[10px] text-gray-500">Transcription</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">Natural</div>
                <div className="text-[10px] text-gray-500">Voice Response</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">Multi-language</div>
                <div className="text-[10px] text-gray-500">Support</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">Business</div>
                <div className="text-[10px] text-gray-500">Context Aware</div>
              </div>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              onEnded={() => setIsPlayingAudio(false)}
              onPlay={() => setIsPlayingAudio(true)}
              className="hidden"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
