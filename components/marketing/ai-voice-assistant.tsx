"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  PiMicrophoneBold,
  PiMicrophoneSlashBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
  PiStopBold,
  PiWaveformBold,
  PiCircleBold,
} from "react-icons/pi"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { useAudioPlayer } from "@/hooks/use-audio-player"

export default function AIVoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [conversation, setConversation] = useState<
    Array<{ id: string; type: "user" | "ai"; text: string; timestamp: Date }>
  >([])
  const [audioLevel, setAudioLevel] = useState(0)

  const { transcript, isListening: speechListening, startListening, stopListening, resetTranscript } = useSpeechToText()

  const { isPlaying, play, pause, stop } = useAudioPlayer()

  // Simulate audio level for visualization
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setAudioLevel(0)
    }
  }, [isListening])

  const handleStartListening = async () => {
    setIsListening(true)
    await startListening()
  }

  const handleStopListening = async () => {
    setIsListening(false)
    await stopListening()

    if (transcript) {
      const userMessage = {
        id: Date.now().toString(),
        type: "user" as const,
        text: transcript,
        timestamp: new Date(),
      }

      setConversation((prev) => [...prev, userMessage])

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai" as const,
          text: "I understand you're looking for travel assistance. Let me help you with that.",
          timestamp: new Date(),
        }
        setConversation((prev) => [...prev, aiResponse])
        setIsSpeaking(true)

        // Simulate speaking duration
        setTimeout(() => setIsSpeaking(false), 3000)
      }, 1000)

      resetTranscript()
    }
  }

  const toggleSpeaker = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-white mb-6">
            <Image
              src="/logo/suitpax-symbol.webp"
              alt="Suitpax"
              width={12}
              height={12}
              className="mr-1.5 w-3 h-3 brightness-0 invert"
            />
            AI Voice Assistant
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6 text-black">
            Habla con tu
            <br />
            <span className="text-gray-600">asistente de viajes</span>
          </h2>
          <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto">
            Interactúa naturalmente con nuestro asistente de IA usando tu voz. Planifica viajes, gestiona reservas y
            obtén recomendaciones personalizadas.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Voice Interface */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    {/* Audio Visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isListening && (
                        <motion.div
                          className="w-32 h-32 rounded-full bg-gray-200/30"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        />
                      )}
                    </div>

                    {/* Main Microphone Button */}
                    <motion.button
                      onClick={isListening ? handleStopListening : handleStartListening}
                      className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-gray-800 hover:bg-gray-900 text-white"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isListening ? (
                        <PiMicrophoneSlashBold className="w-8 h-8" />
                      ) : (
                        <PiMicrophoneBold className="w-8 h-8" />
                      )}
                    </motion.button>
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-700">
                    {isListening ? "Escuchando..." : "Toca para hablar"}
                  </p>
                </div>

                {/* Audio Level Indicator */}
                {isListening && (
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-gray-800 rounded-full"
                        animate={{
                          height: [4, Math.max(4, audioLevel * 0.3), 4],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={toggleSpeaker}
                    className="p-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    {isPlaying ? (
                      <PiSpeakerSlashBold className="w-5 h-5 text-gray-700" />
                    ) : (
                      <PiSpeakerHighBold className="w-5 h-5 text-gray-700" />
                    )}
                  </button>

                  <button
                    onClick={() => setConversation([])}
                    className="p-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <PiStopBold className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Current Transcript */}
                {transcript && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-700">{transcript}</p>
                  </div>
                )}
              </div>

              {/* Conversation History */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tighter text-black">Conversación</h3>

                <div className="h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  {conversation.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <PiWaveformBold className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Inicia una conversación</p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {conversation.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-xl ${
                              message.type === "user"
                                ? "bg-gray-800 text-white"
                                : "bg-white border border-gray-200 text-gray-700"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* AI Status */}
                {isSpeaking && (
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <PiCircleBold className="w-3 h-3 text-blue-500" />
                    </motion.div>
                    <p className="text-sm text-blue-700">IA está respondiendo...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
