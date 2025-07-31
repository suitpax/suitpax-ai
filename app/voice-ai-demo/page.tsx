"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { VoiceAIProvider, type VoiceCommand } from "@/contexts/voice-ai-context"
import VoiceControlPanel from "@/components/voice-ai/voice-control-panel"
import { ConversationInterface } from "@/components/voice-ai/conversation-interface"
import { useVoiceAIConsolidated } from "@/hooks/use-voice-ai-consolidated"
import { AgentCard } from "@/components/shared/agent-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PiMicrophoneFill, PiSpeakerHighFill, PiRobotFill, PiPhoneFill } from "react-icons/pi"
import Image from "next/image"

// Agentes disponibles para Voice AI
const VOICE_AGENTS = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Assistant",
    image: "/agents/agent-emma.jpeg",
    rating: 4.9,
    callsToday: 127,
    languages: ["English", "Spanish", "French"],
    specialty: "Luxury business travel and VIP services with attention to executive-level arrangements",
    accent: "Professional American",
    voice: "Warm, Professional",
    status: "available" as const,
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Corporate Travel Specialist",
    image: "/agents/agent-marcus.jpeg",
    rating: 4.8,
    callsToday: 89,
    languages: ["English", "German", "Dutch"],
    specialty: "Policy compliance and cost optimization for corporate travel programs",
    accent: "British Professional",
    voice: "Authoritative, Clear",
    status: "available" as const,
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    rating: 5.0,
    callsToday: 64,
    languages: ["English", "French", "Italian"],
    specialty: "Luxury experiences, fine dining reservations, and exclusive concierge services",
    accent: "Elegant European",
    voice: "Sophisticated, Refined",
    status: "busy" as const,
  },
  {
    id: "alex",
    name: "Alex",
    role: "Tech & Innovation Guide",
    image: "/agents/agent-alex.jpeg",
    rating: 4.7,
    callsToday: 156,
    languages: ["English", "Spanish", "Portuguese"],
    specialty: "Travel technology integration and digital solutions for modern travelers",
    accent: "Casual American",
    voice: "Enthusiastic, Modern",
    status: "available" as const,
  },
]

// Comandos de voz para la demo
const DEMO_COMMANDS: VoiceCommand[] = [
  {
    phrase: "buscar vuelo",
    action: () => console.log("🔍 Buscando vuelos disponibles..."),
    description: "Busca vuelos disponibles",
  },
  {
    phrase: "reservar hotel",
    action: () => console.log("🏨 Buscando hoteles..."),
    description: "Busca hoteles disponibles",
  },
  {
    phrase: "mostrar itinerario",
    action: () => console.log("📅 Mostrando itinerario..."),
    description: "Muestra tu itinerario actual",
  },
  {
    phrase: "ayuda",
    action: () => console.log("❓ Mostrando ayuda..."),
    description: "Muestra la ayuda disponible",
  },
  {
    phrase: "llamar agente",
    action: () => console.log("📞 Conectando con agente..."),
    description: "Conecta con un agente humano",
  },
]

export default function VoiceAIDemoPage() {
  const [selectedAgent, setSelectedAgent] = useState(VOICE_AGENTS[0])
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Hook consolidado para Voice AI
  const {
    messages,
    status,
    transcript,
    detectedLanguage,
    audioState,
    startListening,
    stopListening,
    startConversation,
    clearConversation,
    playMessage,
    pauseAudio,
    stopAudio,
    browserSupportsSpeechRecognition,
  } = useVoiceAIConsolidated({
    agentId: selectedAgent.id,
    onMessage: (message) => {
      console.log("New message:", message)
    },
    onError: (error) => {
      setError(error)
      setTimeout(() => setError(null), 5000)
    },
    onStatusChange: (newStatus) => {
      console.log("Status changed:", newStatus)
    },
  })

  // Timer para la duración de la llamada
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCallActive])

  // Formatear duración de llamada
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Iniciar llamada
  const handleStartCall = async () => {
    try {
      setIsCallActive(true)
      setCallDuration(0)
      setError(null)
      await startConversation()
    } catch (error) {
      setError("Error al iniciar la llamada")
      setIsCallActive(false)
    }
  }

  // Terminar llamada
  const handleEndCall = () => {
    setIsCallActive(false)
    setCallDuration(0)
    stopAudio()
    stopListening()
    clearConversation()
  }

  // Seleccionar agente
  const handleAgentSelect = (agent: (typeof VOICE_AGENTS)[0]) => {
    if (!isCallActive) {
      setSelectedAgent(agent)
      clearConversation()
    }
  }

  // Verificar soporte del navegador
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <PiMicrophoneFill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-xl font-medium tracking-tighter">Navegador No Compatible</CardTitle>
            <CardDescription>
              Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome, Edge o Safari.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black">
                Voice AI Demo
              </h1>
              <p className="text-gray-600 font-light mt-2">
                Experimenta el futuro de los asistentes de viaje con IA conversacional
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-emerald-950 border-emerald-950">
                <PiRobotFill className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              {isCallActive && (
                <Badge variant="default" className="bg-red-500">
                  <PiPhoneFill className="w-3 h-3 mr-1 animate-pulse" />
                  En llamada {formatCallDuration(callDuration)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de Agentes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium tracking-tighter">Selecciona tu Agente AI</CardTitle>
                <CardDescription>Cada agente tiene especialidades y personalidades únicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {VOICE_AGENTS.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={handleAgentSelect}
                    isSelected={selectedAgent.id === agent.id}
                    showDetails={true}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Panel de Control de Voz */}
            <div className="mt-6">
              <VoiceAIProvider
                initialVoiceId={selectedAgent.id}
                initialLanguage="es-ES"
                enableLogging={true}
                commands={DEMO_COMMANDS}
              >
                <VoiceControlPanel className="w-full" />
              </VoiceAIProvider>
            </div>
          </div>

          {/* Interfaz Principal */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedAgent.image || "/placeholder.svg"}
                      alt={selectedAgent.name}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-medium tracking-tighter">{selectedAgent.name}</CardTitle>
                      <CardDescription>{selectedAgent.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {detectedLanguage === "es-ES" ? "Español" : "English"}
                    </Badge>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedAgent.status === "available"
                          ? "bg-green-400"
                          : selectedAgent.status === "busy"
                            ? "bg-orange-400"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {!isCallActive ? (
                  /* Estado Inicial */
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-8"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PiMicrophoneFill className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium tracking-tighter mb-2">Listo para conversar</h3>
                      <p className="text-gray-600 font-light mb-6">
                        Haz clic en "Iniciar Llamada" para comenzar a hablar con {selectedAgent.name}
                      </p>
                    </motion.div>

                    <Button
                      onClick={handleStartCall}
                      size="lg"
                      className="bg-emerald-950 hover:bg-emerald-900 text-white"
                      disabled={selectedAgent.status !== "available"}
                    >
                      <PiPhoneFill className="w-5 h-5 mr-2" />
                      Iniciar Llamada
                    </Button>

                    {selectedAgent.status !== "available" && (
                      <p className="text-sm text-orange-600 mt-2">
                        {selectedAgent.name} está ocupado. Intenta con otro agente.
                      </p>
                    )}
                  </div>
                ) : (
                  /* Interfaz de Conversación Activa */
                  <ConversationInterface
                    messages={messages}
                    status={status}
                    transcript={transcript}
                    agentName={selectedAgent.name}
                    onStartListening={startListening}
                    onStopListening={stopListening}
                    onEndCall={handleEndCall}
                    onPlayMessage={playMessage}
                    onPauseAudio={pauseAudio}
                    error={error}
                    isAudioPlaying={audioState.isPlaying}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <PiMicrophoneFill className="w-8 h-8 text-emerald-950 mx-auto mb-3" />
              <h3 className="font-medium tracking-tighter mb-2">Reconocimiento de Voz</h3>
              <p className="text-sm text-gray-600 font-light">
                Tecnología avanzada de speech-to-text con detección automática de idioma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <PiSpeakerHighFill className="w-8 h-8 text-emerald-950 mx-auto mb-3" />
              <h3 className="font-medium tracking-tighter mb-2">Síntesis de Voz</h3>
              <p className="text-sm text-gray-600 font-light">Voces naturales y expresivas powered by ElevenLabs AI</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <PiRobotFill className="w-8 h-8 text-emerald-950 mx-auto mb-3" />
              <h3 className="font-medium tracking-tighter mb-2">IA Conversacional</h3>
              <p className="text-sm text-gray-600 font-light">
                Agentes especializados con personalidades únicas y conocimiento experto
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comandos Disponibles */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium tracking-tighter">Comandos de Voz Disponibles</CardTitle>
              <CardDescription>Prueba estos comandos durante tu conversación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMO_COMMANDS.map((command, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <code className="text-sm font-medium text-emerald-950">"{command.phrase}"</code>
                    {command.description && <p className="text-xs text-gray-600 mt-1">{command.description}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
