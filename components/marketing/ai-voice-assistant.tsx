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
    name: "Rhina",
    role: "AI Agent",
    image: "/agents/agent-41.jpeg",
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
    continuous: true,
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
    await new Promise((resolve) => setTimeout(resolve, 1200))

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
      // Spanish responses
      if (
        lowerInput.includes("vuelo") ||
        lowerInput.includes("volar") ||
        lowerInput.includes("avión") ||
        lowerInput.includes("aeropuerto")
      ) {
        const responses = [
          "He encontrado varias opciones de vuelos para ti. Los mejores vuelos salen por la mañana con Iberia a las 10:30 y con Delta a las 11:15. Ambos cumplen con la política de viajes de tu empresa. ¿Te gustaría que proceda con la reserva?",
          "Perfecto, puedo ayudarte con los vuelos. Tengo disponibilidad en clase business con Lufthansa a las 14:20 y Air France a las 16:45. Ambos incluyen equipaje adicional y acceso a salas VIP. ¿Cuál prefieres?",
          "Excelente elección de destino. He verificado las restricciones de viaje y todo está en orden. Los vuelos directos están disponibles con un 15% de descuento corporativo. ¿Necesitas también hotel en el destino?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      } else if (
        lowerInput.includes("hotel") ||
        lowerInput.includes("alojamiento") ||
        lowerInput.includes("hospedaje") ||
        lowerInput.includes("habitación")
      ) {
        const responses = [
          "Te recomiendo el Marriott del centro y el Hilton Business Center para tu estancia. Ambos ofrecen salas ejecutivas y están dentro de tu presupuesto aprobado de 300 euros por noche. ¿Quieres que reserve una habitación con salida tardía?",
          "He encontrado opciones fantásticas. El Four Seasons tiene disponibilidad con vista al mar y el Ritz-Carlton ofrece un 20% de descuento corporativo. Ambos incluyen desayuno ejecutivo y WiFi premium. ¿Cuál te interesa más?",
          "Perfecto, tengo varias opciones premium. El Grand Hyatt está a 5 minutos del centro de convenciones y el Westin ofrece spa incluido. Ambos tienen salas de reuniones disponibles las 24 horas. ¿Necesitas servicios adicionales?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      } else if (
        lowerInput.includes("gasto") ||
        lowerInput.includes("recibo") ||
        lowerInput.includes("costo") ||
        lowerInput.includes("factura")
      ) {
        const responses = [
          "Categorizaré automáticamente tus gastos de viaje y los enviaré para aprobación. Tu utilización actual del presupuesto de viaje está al 78%, bien dentro de los límites de la política. Todos los recibos serán capturados y procesados digitalmente.",
          "Excelente, he procesado todos tus recibos. Los gastos de comida están dentro del límite de 75 euros diarios y el transporte ha sido pre-aprobado. El reembolso se procesará en 2-3 días hábiles. ¿Necesitas el reporte detallado?",
          "He sincronizado todos tus gastos con el sistema contable. Los gastos de entretenimiento requieren justificación adicional, pero todo lo demás está aprobado automáticamente. Tu tarjeta corporativa se actualizará en tiempo real.",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      } else if (
        lowerInput.includes("reunión") ||
        lowerInput.includes("meeting") ||
        lowerInput.includes("cita") ||
        lowerInput.includes("agenda")
      ) {
        const responses = [
          "He sincronizado tu itinerario de viaje con tu calendario. Tus reuniones están programadas considerando los horarios de vuelo, y he añadido tiempo de buffer para traslados al aeropuerto. ¿Quieres que envíe invitaciones a todos los participantes?",
          "Perfecto, he coordinado todas tus reuniones. La sala de conferencias está reservada con equipo audiovisual y catering para 12 personas. He enviado recordatorios automáticos a todos los asistentes. ¿Necesitas materiales adicionales?",
          "Excelente, he optimizado tu agenda. Las reuniones matutinas están confirmadas y he reservado tiempo para almuerzo de negocios en el restaurante del hotel. Todos los documentos están sincronizados en la nube. ¿Algún cambio de último momento?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      } else if (
        lowerInput.includes("transporte") ||
        lowerInput.includes("taxi") ||
        lowerInput.includes("uber") ||
        lowerInput.includes("coche")
      ) {
        const responses = [
          "He organizado tu transporte completo. Un chofer ejecutivo te recogerá en el aeropuerto y estará disponible durante toda tu estancia. El vehículo incluye WiFi y estación de carga. ¿Necesitas paradas adicionales?",
          "Perfecto, he reservado un Tesla Model S para tu traslado. El conductor habla inglés y español, conoce perfectamente la ciudad y tiene acceso a carriles VIP. El costo está pre-aprobado por tu empresa.",
          "Excelente elección. He coordinado transporte premium con Mercedes clase E. Incluye agua, prensa internacional y clima personalizado. El conductor te contactará 30 minutos antes de cada recogida.",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      } else if (lowerInput.includes("clima") || lowerInput.includes("tiempo") || lowerInput.includes("temperatura")) {
        const responses = [
          "El clima en tu destino será perfecto para viajes de negocios. Temperaturas de 22-25°C, sin lluvia prevista. Te recomiendo llevar una chaqueta ligera para las reuniones en interiores con aire acondicionado.",
          "Excelente timing para tu viaje. El pronóstico muestra cielos despejados y temperaturas ideales. He actualizado tu lista de equipaje con recomendaciones específicas para el clima local.",
          "El tiempo será favorable durante toda tu estancia. Temperaturas estables y sin precipitaciones. He verificado que todos tus vuelos están confirmados sin retrasos por condiciones meteorológicas.",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      } else {
        const responses = [
          "Entiendo que necesitas ayuda con tus arreglos de viaje de negocios. Puedo ayudarte a reservar vuelos, hoteles, gestionar gastos y coordinar tu horario. ¿En qué aspecto específico te gustaría que te ayude?",
          "Estoy aquí para optimizar tu experiencia de viaje corporativo. Puedo manejar reservas, políticas de empresa, reembolsos y coordinación de agenda. ¿Qué necesitas organizar primero?",
          "Como tu asistente de viajes AI, puedo gestionar todo tu itinerario de negocios. Desde vuelos premium hasta reuniones ejecutivas y gastos corporativos. ¿Por dónde empezamos?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "es-ES" }
      }
    } else {
      // English responses
      if (
        lowerInput.includes("flight") ||
        lowerInput.includes("fly") ||
        lowerInput.includes("plane") ||
        lowerInput.includes("airport")
      ) {
        const responses = [
          "I've found several excellent flight options for you. The best morning flights are with British Airways at 10:30 AM and Lufthansa at 11:15 AM. Both comply with your company's travel policy and include priority boarding. Would you like me to proceed with the booking?",
          "Perfect! I can help you with flights. I have business class availability with Emirates at 2:20 PM and Air France at 4:45 PM. Both include extra baggage and lounge access. Which would you prefer?",
          "Excellent destination choice. I've verified all travel restrictions and everything is clear. Direct flights are available with a 15% corporate discount. Do you also need accommodation at your destination?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else if (
        lowerInput.includes("hotel") ||
        lowerInput.includes("accommodation") ||
        lowerInput.includes("stay") ||
        lowerInput.includes("room")
      ) {
        const responses = [
          "I recommend the Marriott Downtown and Hilton Business Center for your stay. Both offer executive lounges and are within your approved budget of $400 per night. Shall I reserve a room with late checkout privileges?",
          "I've found fantastic options for you. The Four Seasons has ocean view availability and the Ritz-Carlton offers a 20% corporate discount. Both include executive breakfast and premium WiFi. Which interests you more?",
          "Perfect! I have several premium options. The Grand Hyatt is 5 minutes from the convention center and the Westin offers complimentary spa access. Both have 24-hour meeting rooms available. Do you need additional services?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else if (
        lowerInput.includes("expense") ||
        lowerInput.includes("receipt") ||
        lowerInput.includes("cost") ||
        lowerInput.includes("invoice")
      ) {
        const responses = [
          "I'll automatically categorize your travel expenses and submit them for approval. Your current trip budget utilization is at 78%, well within policy limits. All receipts will be digitally captured and processed within 24 hours.",
          "Excellent! I've processed all your receipts. Meal expenses are within the $100 daily limit and transportation has been pre-approved. Reimbursement will be processed in 2-3 business days. Do you need the detailed report?",
          "I've synchronized all your expenses with the accounting system. Entertainment expenses require additional justification, but everything else is automatically approved. Your corporate card will be updated in real-time.",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else if (
        lowerInput.includes("meeting") ||
        lowerInput.includes("schedule") ||
        lowerInput.includes("calendar") ||
        lowerInput.includes("appointment")
      ) {
        const responses = [
          "I've synchronized your travel itinerary with your calendar. Your meetings are scheduled around your flight times, and I've added buffer time for airport transfers. Would you like me to send calendar invites to all participants?",
          "Perfect! I've coordinated all your meetings. The conference room is booked with AV equipment and catering for 12 people. I've sent automatic reminders to all attendees. Do you need additional materials?",
          "Excellent! I've optimized your schedule. Morning meetings are confirmed and I've reserved time for a business lunch at the hotel restaurant. All documents are synced to the cloud. Any last-minute changes needed?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else if (
        lowerInput.includes("transport") ||
        lowerInput.includes("taxi") ||
        lowerInput.includes("uber") ||
        lowerInput.includes("car")
      ) {
        const responses = [
          "I've arranged your complete transportation. An executive driver will pick you up at the airport and be available throughout your stay. The vehicle includes WiFi and charging station. Do you need additional stops?",
          "Perfect! I've booked a Tesla Model S for your transfer. The driver speaks multiple languages, knows the city perfectly, and has VIP lane access. The cost is pre-approved by your company.",
          "Excellent choice! I've coordinated premium transport with a Mercedes E-Class. Includes water, international press, and personalized climate control. The driver will contact you 30 minutes before each pickup.",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else if (
        lowerInput.includes("weather") ||
        lowerInput.includes("climate") ||
        lowerInput.includes("temperature")
      ) {
        const responses = [
          "The weather at your destination will be perfect for business travel. Temperatures of 72-77°F with no rain expected. I recommend bringing a light jacket for air-conditioned meeting rooms.",
          "Excellent timing for your trip! The forecast shows clear skies and ideal temperatures. I've updated your packing list with specific recommendations for the local climate.",
          "Weather will be favorable throughout your stay. Stable temperatures with no precipitation expected. I've verified that all your flights are confirmed with no weather-related delays.",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else if (
        lowerInput.includes("restaurant") ||
        lowerInput.includes("food") ||
        lowerInput.includes("dining") ||
        lowerInput.includes("eat")
      ) {
        const responses = [
          "I've curated a selection of top business dining venues. The Capital Grille has private dining rooms perfect for client meetings, and Nobu offers an exclusive chef's table experience. Both accommodate dietary restrictions. Which style do you prefer?",
          "Excellent! I have reservations at Michelin-starred restaurants within walking distance of your hotel. Le Bernardin for seafood excellence and Eleven Madison Park for innovative cuisine. Both have sommelier services available.",
          "Perfect timing! I've secured tables at the city's most prestigious business restaurants. All venues offer private dining, wine pairings, and can accommodate your company's entertainment budget. Shall I confirm the reservations?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
      } else {
        const responses = [
          "I understand you need assistance with your business travel arrangements. I can help you book flights, reserve hotels, manage expenses, and coordinate your schedule. What specific aspect would you like me to help you with?",
          "I'm here to optimize your corporate travel experience. I can handle bookings, company policies, reimbursements, and schedule coordination. What would you like to organize first?",
          "As your AI travel assistant, I can manage your entire business itinerary. From premium flights to executive meetings and corporate expenses. Where shall we start?",
        ]
        return { text: responses[Math.floor(Math.random() * responses.length)], language: "en-US" }
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
                <em className="font-serif italic">Voice Intelligence</em>
              </span>
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
                <em className="font-serif italic">Real-time Speech</em>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
              <em className="font-serif italic">Intelligent Voice Assistant</em> for Business Travel
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">
              <em className="font-serif italic">Speak naturally</em> to manage your travel, expenses, and bookings with
              AI-powered voice recognition.
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
                  width={40}
                  height={40}
                  className="rounded-xl h-10 w-10 object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-sm font-medium text-black">
                    <em className="font-serif italic">{currentAgent.name}</em>
                  </h3>
                  <p className="text-xs text-gray-600">
                    <em className="font-serif italic">{currentAgent.role}</em>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[8px] font-medium text-gray-700 border border-gray-200">
                  <PiGlobeSimpleBold className="h-3 w-3 mr-1 text-gray-500" />
                  <span>{detectedLanguage === "es-ES" ? "Español" : "English"}</span>
                </div>
                <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[8px] font-medium text-gray-700 border border-gray-200">
                  <span className="mr-1.5">
                    <em className="font-serif italic">AI Powered</em>
                  </span>
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
                      width={64}
                      height={64}
                      className="rounded-xl h-16 w-16 object-cover mb-4 border-2 border-gray-200"
                    />
                    <h3 className="text-lg font-medium text-black mb-2">
                      <em className="font-serif italic">{currentAgent.name}</em>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      <em className="font-serif italic">{currentAgent.role}</em>
                    </p>
                    <p className="text-xs text-gray-500 max-w-md">
                      <em className="font-serif italic">Start speaking to {currentAgent.name}</em> about your travel
                      needs. I can help you book flights, find hotels, manage expenses, and more.
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
                            <em className="font-serif italic">{message.text}</em>
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
                  <p className="text-xs text-red-600">
                    <em className="font-serif italic">{errorMessage}</em>
                  </p>
                </div>
              )}

              {!browserSupportsSpeechRecognition && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    <em className="font-serif italic">
                      Your browser doesn't support speech recognition. Please try Chrome or Edge for the best
                      experience.
                    </em>
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 bg-gray-50">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Real-time</em>
                </div>
                <div className="text-[10px] text-gray-500">Transcription</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Natural</em>
                </div>
                <div className="text-[10px] text-gray-500">Voice Response</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Multi-language</em>
                </div>
                <div className="text-[10px] text-gray-500">Support</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Business</em>
                </div>
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
