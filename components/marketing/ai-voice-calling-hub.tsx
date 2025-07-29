"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Phone, PhoneCall, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

export default function AIVoiceCallingHub() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)

  const handleStartCall = () => {
    setIsCallActive(true)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-950 text-white">Centro de Llamadas IA</Badge>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-6">
            Habla directamente con tu asistente de viajes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Realiza llamadas de voz con Zia para gestionar tus viajes de forma natural y conversacional.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                {!isCallActive ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="w-24 h-24 bg-emerald-950 rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Zia AI Assistant</h3>
                      <p className="text-gray-600">Listo para ayudarte con tus viajes</p>
                    </div>
                    <Button
                      onClick={handleStartCall}
                      size="lg"
                      className="bg-emerald-950 hover:bg-emerald-900 text-white px-8 py-4 rounded-full"
                    >
                      <PhoneCall className="w-5 h-5 mr-2" />
                      Iniciar Llamada
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto"
                      >
                        <Mic className="w-16 h-16 text-white" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Llamada Activa</h3>
                      <p className="text-gray-600">Hablando con Zia AI</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          00:45
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button
                        variant={isMuted ? "destructive" : "outline"}
                        size="lg"
                        onClick={toggleMute}
                        className="rounded-full w-14 h-14"
                      >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>

                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleEndCall}
                        className="rounded-full w-14 h-14"
                      >
                        <PhoneCall className="w-6 h-6" />
                      </Button>

                      <Button
                        variant={isSpeakerOn ? "default" : "outline"}
                        size="lg"
                        onClick={toggleSpeaker}
                        className="rounded-full w-14 h-14"
                      >
                        {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Reconocimiento de Voz</h4>
              <p className="text-sm text-gray-600">Tecnología avanzada de procesamiento de lenguaje natural</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Llamadas HD</h4>
              <p className="text-sm text-gray-600">Calidad de audio cristalina para conversaciones fluidas</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Respuestas Inteligentes</h4>
              <p className="text-sm text-gray-600">IA contextual que entiende tus necesidades de viaje</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
