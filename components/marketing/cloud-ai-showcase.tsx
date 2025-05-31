"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import VantaCloudsCustomBackground from "../ui/vanta-clouds-custom-background"
import { SiBritishairways, SiTesla } from "react-icons/si"
import { MdMic, MdMicOff } from "react-icons/md"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import { detectLanguage } from "@/lib/language-detection"

// Placeholder simple para el input de voz
const voicePlaceholder = "Speak to your AI travel assistant..."

export default function CloudAIShowcase() {
  const [inputText, setInputText] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-US")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [highlightFlight, setHighlightFlight] = useState(false)
  const [highlightTransport, setHighlightTransport] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  // Configuración avanzada para el reconocimiento de voz
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

      // Si hay texto nuevo, activar el efecto brillante en los badges
      if (text && text.length > 0) {
        setHighlightFlight(true)
        setTimeout(() => {
          setHighlightTransport(true)
        }, 300)

        setTimeout(() => {
          setHighlightFlight(false)
        }, 2000)

        setTimeout(() => {
          setHighlightTransport(false)
        }, 2300)
      }

      // Detectar idioma automáticamente
      if (text.length > 10) {
        const detected = detectLanguage(text)
        if (detected.confidence > 0.6) {
          setDetectedLanguage(detected.speechCode)
        }
      }
    },
    onEnd: (finalTranscript) => {
      setInputText(finalTranscript)
    },
    continuous: true,
    language: detectedLanguage,
    autoDetectLanguage: true,
  })

  const toggleListening = async () => {
    if (isListening) {
      stopListening()
    } else {
      try {
        // Verificar permisos antes de iniciar
        await navigator.mediaDevices.getUserMedia({ audio: true })
        resetTranscript()
        setInputText("") // Limpiar el input text también
        startListening()
        setErrorMessage(null)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        setErrorMessage("No se pudo acceder al micrófono. Verifica los permisos del navegador.")
      }
    }
  }

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Badges centrados */}
            <div className="flex justify-center items-center gap-1.5 mb-3">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={50}
                  height={12}
                  className="h-2.5 w-auto mr-1"
                />
                Intelligence
              </span>
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
                Human-AI Agentic
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
              The future of business travel with Voice AI
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">
              Suitpax combines human expertise with AI agents to transform business travel.
            </p>
            <p className="mt-2 text-xs font-light text-gray-500 max-w-2xl">
              Seamless, intelligent, and always working for you — experience travel like never before.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <VantaCloudsCustomBackground className="w-full min-h-[500px] md:min-h-[600px] rounded-xl flex items-center justify-center p-4 md:p-6 overflow-hidden">
            <div className="w-full max-w-3xl">
              {/* Título y subtítulo por encima del input, estilo similar a BusinessTravelRevolution */}
              <div className="text-center mb-6 md:mb-8">
                <h3 className="inline-flex items-center rounded-xl bg-gray-800/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white mb-4 shadow-sm">
                  <Image
                    src="/logo/suitpax-cloud-logo.webp"
                    alt="Suitpax"
                    width={50}
                    height={12}
                    className="h-3 w-auto mr-1"
                  />
                  <em className="font-serif italic">AI Assistant</em>
                </h3>
                <h2 className="text-2xl sm:text-3xl md:text-3xl font-medium tracking-tighter text-white leading-none mb-3">
                  Speak your journey into existence
                </h2>
              </div>

              {/* Solo el input, sin la tarjeta blanca alrededor */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Input de chat con reconocimiento de voz */}
                <div className="relative flex items-center gap-2 p-1 rounded-xl border border-gray-400 shadow-sm bg-white/90 backdrop-blur-md mb-4 md:mb-6">
                  {/* Avatar del agente AI */}
                  <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-300 ml-2">
                    <Image
                      src="/agents/agent-12.png"
                      alt="Suitpax AI Agent"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Input de texto con reconocimiento de voz */}
                  <div ref={inputRef} className="flex-1 py-2 px-2 text-xs text-gray-900 h-10 flex items-center">
                    {isListening && transcript ? (
                      <span className="inline-block text-xs text-gray-900 font-medium">{transcript}</span>
                    ) : !isListening && !transcript ? (
                      <span className="inline-block text-xs text-gray-400">{voicePlaceholder}</span>
                    ) : null}
                  </div>

                  {/* Botón de micrófono con indicador de escucha */}
                  <div className="relative mr-2">
                    <button
                      onClick={toggleListening}
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                      aria-label={isListening ? "Stop listening" : "Start listening"}
                    >
                      {isListening ? <MdMicOff className="h-4 w-4" /> : <MdMic className="h-4 w-4" />}
                    </button>

                    {/* Indicador de escucha flotante */}
                    {isListening && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap animate-pulse">
                        Listening... ({detectedLanguage})
                      </div>
                    )}
                  </div>
                </div>

                {/* Mensajes de estado y error */}
                <div className="flex flex-col items-center space-y-1 -mt-3 mb-3">
                  {/* Mensaje de error */}
                  {errorMessage && (
                    <div className="text-xs text-red-500 text-center bg-red-50 px-2 py-1 rounded-full">
                      {errorMessage}
                    </div>
                  )}

                  {/* Mensaje de soporte del navegador */}
                  {!browserSupportsSpeechRecognition && (
                    <div className="text-xs text-red-500 text-center">
                      Tu navegador no soporta reconocimiento de voz. Intenta con Chrome o Edge.
                    </div>
                  )}
                </div>

                {/* Ejemplos de itinerarios de viaje visuales y espectaculares */}
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-medium mb-2 text-center text-white">
                    Your upcoming trip to San Francisco:
                  </p>

                  {/* British Airways Flight Card - Moderna y minimalista con efecto brillante */}
                  <div
                    className={`relative bg-gray-500/10 backdrop-blur-xl rounded-xl border overflow-hidden p-3 transition-all duration-500 ${
                      highlightFlight
                        ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.02]"
                        : "border-gray-400/20 shadow-sm"
                    }`}
                  >
                    {/* Efecto de brillo que se mueve a través de la tarjeta */}
                    <AnimatePresence>
                      {highlightFlight && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          initial={{ x: -200, opacity: 0 }}
                          animate={{ x: 400, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center space-x-2">
                        <SiBritishairways
                          className={`h-4 w-4 ${highlightFlight ? "text-blue-400" : "text-white"} transition-colors duration-500`}
                        />
                        <span className="font-medium text-xs text-white">British Airways</span>
                      </div>
                      <span
                        className={`text-[10px] ${highlightFlight ? "bg-blue-500/30 text-blue-100" : "bg-white/10 text-white/70"} px-2.5 py-0.5 rounded-full transition-colors duration-500`}
                      >
                        Business
                      </span>
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="text-center">
                        <p className="text-xs font-bold text-white">LHR</p>
                        <p className="text-[10px] text-gray-200">London</p>
                      </div>

                      <div className="flex-1 mx-3">
                        <div className="relative flex items-center justify-center">
                          <div
                            className={`h-px ${highlightFlight ? "bg-blue-400/70" : "bg-white/30"} w-full transition-colors duration-500`}
                          ></div>
                          <div className="absolute">
                            <svg
                              className={`h-3 w-3 ${highlightFlight ? "text-blue-300" : "text-white"} transition-colors duration-500`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-xs font-bold text-white">SFO</p>
                        <p className="text-[10px] text-gray-200">San Francisco</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[9px] text-white/70 relative z-10">
                      <span>BA 287 • May 18</span>
                      <span
                        className={`${highlightFlight ? "bg-white/40 text-white" : "bg-white/20 text-white"} px-1.5 py-0.5 rounded-full text-[8px] transition-colors duration-500`}
                      >
                        Confirmed
                      </span>
                    </div>
                  </div>

                  {/* Tesla Transportation Card - Moderna y minimalista con efecto brillante */}
                  <div
                    className={`relative bg-gray-500/10 backdrop-blur-xl rounded-xl border overflow-hidden p-3 transition-all duration-500 ${
                      highlightTransport
                        ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-[1.02]"
                        : "border-gray-400/20 shadow-sm"
                    }`}
                  >
                    {/* Efecto de brillo que se mueve a través de la tarjeta */}
                    <AnimatePresence>
                      {highlightTransport && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          initial={{ x: -200, opacity: 0 }}
                          animate={{ x: 400, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center space-x-2">
                        <SiTesla
                          className={`h-4 w-4 ${highlightTransport ? "text-red-400" : "text-white"} transition-colors duration-500`}
                        />
                        <span className="font-medium text-xs text-white">Tesla Model Y</span>
                      </div>
                      <span
                        className={`text-[10px] ${highlightTransport ? "bg-red-500/30 text-red-100" : "bg-white/10 text-white/70"} px-2.5 py-0.5 rounded-full transition-colors duration-500`}
                      >
                        Premium
                      </span>
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="text-center">
                        <p className="text-xs font-bold text-white">SFO</p>
                        <p className="text-[10px] text-gray-200">Airport</p>
                      </div>

                      <div className="flex-1 mx-3">
                        <div className="relative flex items-center justify-center">
                          <div
                            className={`h-px ${highlightTransport ? "bg-red-400/70" : "bg-white/30"} w-full transition-colors duration-500`}
                          ></div>
                          <div className="absolute">
                            <svg
                              className={`h-3 w-3 ${highlightTransport ? "text-red-300" : "text-white"} transition-colors duration-500`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-xs font-bold text-white">HTL</p>
                        <p className="text-[10px] text-gray-200">Marriott</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[9px] text-white/70 relative z-10">
                      <span>May 18 • 14:30</span>
                      <span
                        className={`${highlightTransport ? "bg-white/40 text-white" : "bg-white/20 text-white"} px-1.5 py-0.5 rounded-full text-[8px] transition-colors duration-500`}
                      >
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Talk to founders badge */}
                <div className="flex justify-center mt-6 mb-4">
                  <a
                    href="mailto:founders@suitpax.com"
                    className="inline-flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-sm px-4 py-2 text-xs font-medium text-white hover:bg-black/90 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Talk to founders
                  </a>
                </div>

                {/* "Powered by" text */}
                <div className="mt-2 text-center">
                  <span className="text-[10px] text-gray-600">Powered by Suitpax Engineering</span>
                </div>
              </motion.div>
            </div>
          </VantaCloudsCustomBackground>
        </motion.div>
      </div>
    </section>
  )
}
