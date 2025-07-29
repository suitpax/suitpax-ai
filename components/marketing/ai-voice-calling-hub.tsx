"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Phone, PhoneCall, Mic, MicOff, Volume2, VolumeX, PhoneOff, Users, Zap, Globe } from "lucide-react"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { detectLanguage } from "@/lib/language-detection"

interface CallSession {
  id: string
  agentName: string
  agentRole: string
  agentImage: string
  duration: number
  status: "connecting" | "active" | "ended"
}

export default function AIVoiceCallingHub() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-US")
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [callQuality, setCallQuality] = useState<"excellent" | "good" | "fair">("excellent")

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [currentAgent] = useState({
    name: "Emma",
    role: "Senior Travel Specialist",
    image: "/agents/agent-emma.jpeg",
    specialties: ["Flight Booking", "Hotel Reservations", "Expense Management", "Policy Compliance"],
  })

  // Speech-to-text integration
  const { isListening, transcript, startListening, stopListening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechToText({
      onTranscriptChange: (text) => {
        setCurrentTranscript(text)
        if (text.length > 10) {
          const detected = detectLanguage(text)
          if (detected.confidence > 0.6) {
            setDetectedLanguage(detected.speechCode)
          }
        }
      },
      onEnd: (finalTranscript) => {
        if (finalTranscript.trim()) {
          processVoiceInput(finalTranscript)
        }
      },
      continuous: true,
      language: detectedLanguage,
      autoDetectLanguage: true,
    })

  // Call timer effect
  useEffect(() => {
    if (isCallActive && !callTimerRef.current) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else if (!isCallActive && callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [isCallActive])

  // Voice recognition effect
  useEffect(() => {
    if (isCallActive && !isListening && voiceRecognitionActive) {
      startListening()
    } else if (!isCallActive && isListening) {
      stopListening()
    }
  }, [isCallActive, voiceRecognitionActive, isListening, startListening, stopListening])

  const handleStartCall = async () => {
    setIsConnecting(true)
    setCallDuration(0)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnecting(false)
    setIsCallActive(true)
    setVoiceRecognitionActive(true)

    // Simulate call quality variations
    const qualityInterval = setInterval(() => {
      const qualities: ("excellent" | "good" | "fair")[] = ["excellent", "good", "fair"]
      setCallQuality(qualities[Math.floor(Math.random() * qualities.length)])
    }, 10000)

    return () => clearInterval(qualityInterval)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setIsConnecting(false)
    setIsMuted(false)
    setVoiceRecognitionActive(false)
    setCurrentTranscript("")
    stopListening()
    resetTranscript()

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopListening()
    } else if (voiceRecognitionActive) {
      startListening()
    }
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
  }

  const toggleVoiceRecognition = () => {
    setVoiceRecognitionActive(!voiceRecognitionActive)
    if (!voiceRecognitionActive && isCallActive) {
      startListening()
    } else {
      stopListening()
    }
  }

  const processVoiceInput = async (input: string) => {
    console.log("Processing voice input:", input)
    // Here you would integrate with your AI backend
    // For now, we'll just log the input
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getCallQualityColor = () => {
    switch (callQuality) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-yellow-500"
      case "fair":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-3 py-1 text-xs font-medium text-white">
              <Phone className="w-3 h-3 mr-1.5" />
              Voice Calling Hub
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-800 px-3 py-1 text-xs font-medium text-white">
              <Zap className="w-3 h-3 mr-1.5" />
              AI Powered
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto mb-4">
            Direct Voice Communication with Your <em className="font-serif italic">AI Travel Assistant</em>
          </h2>

          <p className="text-gray-600 font-light max-w-2xl mx-auto mb-2">
            Experience natural, real-time conversations with Emma, your dedicated AI travel specialist. Handle complex
            bookings, policy questions, and travel arrangements through voice.
          </p>

          <p className="text-xs font-light text-gray-500 max-w-2xl mx-auto">
            Advanced voice recognition • Real-time transcription • Multi-language support • HD audio quality
          </p>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Call Interface Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={currentAgent.image || "/placeholder.svg"}
                    alt={currentAgent.name}
                    width={48}
                    height={48}
                    className="rounded-xl object-cover border-2 border-gray-200"
                  />
                  {isCallActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-black">{currentAgent.name}</h3>
                  <p className="text-sm text-gray-600">{currentAgent.role}</p>
                  {isCallActive && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Call duration: {formatCallDuration(callDuration)}</span>
                      <span className={`text-xs ${getCallQualityColor()}`}>• {callQuality} quality</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                  <Globe className="w-3 h-3 mr-1" />
                  {detectedLanguage === "es-ES" ? "Spanish" : "English"}
                </div>

                {browserSupportsSpeechRecognition && (
                  <div className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                    <Mic className="w-3 h-3 mr-1" />
                    Voice Recognition
                  </div>
                )}
              </div>
            </div>

            {/* Call Status Display */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {isConnecting ? (
                  <motion.div
                    key="connecting"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-24 h-24 border-4 border-gray-200 border-t-black rounded-full mx-auto"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Phone className="w-8 h-8 text-black" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium text-black mb-2">Connecting to {currentAgent.name}</h3>
                      <p className="text-gray-600">Establishing secure voice connection...</p>
                    </div>
                  </motion.div>
                ) : !isCallActive ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto border-4 border-gray-200">
                      <Phone className="w-16 h-16 text-gray-600" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-medium text-black mb-2">Ready to Connect</h3>
                      <p className="text-gray-600 mb-4">Start a voice conversation with {currentAgent.name}</p>

                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {currentAgent.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleStartCall}
                      className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full text-lg font-medium tracking-tight transition-colors group"
                    >
                      <PhoneCall className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      Start Voice Call
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-6"
                  >
                    {/* Active Call Display */}
                    <div className="text-center">
                      <div className="relative mb-4">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                        >
                          <Mic className="w-16 h-16 text-white" />
                        </motion.div>

                        {/* Voice Activity Indicator */}
                        {isListening && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            className="absolute inset-0 w-32 h-32 border-4 border-green-400 rounded-full mx-auto"
                          />
                        )}
                      </div>

                      <h3 className="text-xl font-medium text-black mb-2">Call Active</h3>
                      <p className="text-gray-600">Speaking with {currentAgent.name}</p>
                    </div>

                    {/* Live Transcription */}
                    {currentTranscript && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-gray-700">Live Transcription</span>
                        </div>
                        <p className="text-sm text-gray-800 italic">"{currentTranscript}"</p>
                      </div>
                    )}

                    {/* Call Controls */}
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={toggleMute}
                        className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                          isMuted
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>

                      <button
                        onClick={handleEndCall}
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                        title="End Call"
                      >
                        <PhoneOff className="w-8 h-8" />
                      </button>

                      <button
                        onClick={toggleSpeaker}
                        className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                          isSpeakerOn
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        title={isSpeakerOn ? "Speaker On" : "Speaker Off"}
                      >
                        {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </button>

                      {browserSupportsSpeechRecognition && (
                        <button
                          onClick={toggleVoiceRecognition}
                          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                            voiceRecognitionActive
                              ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          title={voiceRecognitionActive ? "Voice Recognition On" : "Voice Recognition Off"}
                        >
                          <Zap className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-t border-gray-200">
              <div className="text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-medium text-black">Voice Recognition</h4>
                <p className="text-xs text-gray-600">Advanced speech processing</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-medium text-black">HD Audio</h4>
                <p className="text-xs text-gray-600">Crystal clear quality</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-medium text-black">Multi-Language</h4>
                <p className="text-xs text-gray-600">Global communication</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-medium text-black">AI Specialists</h4>
                <p className="text-xs text-gray-600">Expert travel agents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden audio element for call audio */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </section>
  )
}
