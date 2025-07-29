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

      // Generate AI response with ElevenLabs
      setTimeout(async () => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai" as const,
          text: "I understand you're looking for travel assistance. Let me help you with that booking right away.",
          timestamp: new Date(),
        }
        setConversation((prev) => [...prev, aiResponse])
        setIsSpeaking(true)

        // Generate speech with ElevenLabs
        try {
          const response = await fetch("/api/elevenlabs/generate-speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: aiResponse.text,
              agentId: "emma",
            }),
          })

          if (response.ok) {
            const audioBlob = await response.blob()
            const audioUrl = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioUrl)
            audio.play()

            audio.onended = () => {
              setIsSpeaking(false)
              URL.revokeObjectURL(audioUrl)
            }
          }
        } catch (error) {
          console.error("Error generating speech:", error)
          setIsSpeaking(false)
        }
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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <Image src="/logo/suitpax-symbol.webp" alt="Suitpax" width={12} height={12} className="mr-1.5 w-3 h-3" />
            AI Voice Assistant
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tighter leading-none mb-6 text-black">
            Speak with your
            <br />
            <span className="text-gray-600 font-inter">travel assistant</span>
          </h2>
          <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto font-inter">
            Interact naturally with our AI assistant using your voice. Plan trips, manage bookings, and get personalized
            recommendations through natural conversation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8">
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

                  <p className="mt-4 text-sm font-medium text-gray-700 font-inter">
                    {isListening ? "Listening..." : "Tap to speak"}
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
                    <p className="text-sm text-gray-700 font-inter">{transcript}</p>
                  </div>
                )}
              </div>

              {/* Conversation History */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tighter text-black font-serif">Conversation</h3>

                <div className="h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  {conversation.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <PiWaveformBold className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-inter">Start a conversation</p>
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
                            {message.type === "ai" && (
                              <div className="flex items-center mb-2">
                                <Image
                                  src="/logo/suitpax-bl-logo.webp"
                                  alt="Suitpax AI"
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 rounded-xl mr-2"
                                />
                                <span className="text-xs font-medium text-gray-500 font-inter">Suitpax AI</span>
                              </div>
                            )}
                            <p className="text-sm font-inter">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1 font-inter">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
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
                    <p className="text-sm text-blue-700 font-inter">AI is responding...</p>
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
