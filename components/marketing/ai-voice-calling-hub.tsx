"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Phone,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

// AI Agents data with larger images
const aiAgents = [
  {
    id: "sophia",
    name: "Sophia",
    role: "Travel Specialist",
    avatar: "/agents/agent-sophia.jpeg",
    voice: "alloy",
    description: "Expert in business travel planning",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Expense Manager",
    avatar: "/agents/agent-marcus.jpeg",
    voice: "echo",
    description: "Specialized in expense optimization",
  },
  {
    id: "emma",
    name: "Emma",
    role: "Policy Advisor",
    avatar: "/agents/agent-emma.jpeg",
    voice: "fable",
    description: "Travel policy compliance expert",
  },
  {
    id: "alex",
    name: "Alex",
    role: "Booking Assistant",
    avatar: "/agents/agent-alex.jpeg",
    voice: "onyx",
    description: "Flight and hotel booking specialist",
  },
]

interface CallStatus {
  type: "idle" | "connecting" | "connected" | "speaking" | "listening" | "error"
  message: string
}

export default function AIVoiceCallingHub() {
  const [selectedAgent, setSelectedAgent] = useState(aiAgents[0])
  const [callStatus, setCallStatus] = useState<CallStatus>({ type: "idle", message: "Ready to call" })
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.onended = () => setIsPlaying(false)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startCall = async () => {
    try {
      setCallStatus({ type: "connecting", message: "Connecting to AI agent..." })

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCallStatus({ type: "connected", message: `Connected to ${selectedAgent.name}` })

      // Auto-start with greeting
      setTimeout(() => {
        handleAIResponse(
          "Hello! I'm " +
            selectedAgent.name +
            ", your " +
            selectedAgent.role +
            ". How can I help you with your business travel today?",
        )
      }, 1000)
    } catch (error) {
      setCallStatus({ type: "error", message: "Failed to connect. Please try again." })
    }
  }

  const endCall = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setCallStatus({ type: "idle", message: "Ready to call" })
    setIsRecording(false)
    setIsPlaying(false)
    setAudioUrl(null)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await processVoiceInput(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setCallStatus({ type: "listening", message: "Listening..." })
    } catch (error) {
      setCallStatus({ type: "error", message: "Microphone access denied" })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processVoiceInput = async (audioBlob: Blob) => {
    try {
      setCallStatus({ type: "speaking", message: "Processing your request..." })

      // Convert speech to text (simulated)
      const transcript = "I need to book a flight from New York to London for next week"

      // Get AI response
      const response = await fetch("/api/voice-ai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: transcript,
          agent: selectedAgent.id,
          context: "business_travel_booking",
        }),
      })

      const data = await response.json()

      if (data.success) {
        await handleAIResponse(data.response)
      } else {
        setCallStatus({ type: "error", message: "Failed to process request" })
      }
    } catch (error) {
      setCallStatus({ type: "error", message: "Processing failed" })
    }
  }

  const handleAIResponse = async (text: string) => {
    try {
      // Convert text to speech using ElevenLabs
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: selectedAgent.voice,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
          setIsPlaying(true)
        }

        setCallStatus({ type: "connected", message: `${selectedAgent.name} is speaking...` })
      }
    } catch (error) {
      setCallStatus({ type: "error", message: "Speech synthesis failed" })
    }
  }

  const togglePlayback = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const getStatusIcon = () => {
    switch (callStatus.type) {
      case "connecting":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Phone className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <section className="pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <em className="font-serif italic">AI Voice Calling</em>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
            <em className="font-serif italic">Talk to Your</em>
            <br />
            <span className="text-gray-700">AI Travel Assistant</span>
          </h2>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
            Experience the future of business travel with voice-powered AI agents. Just speak naturally and get instant
            help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Agent Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium tracking-tighter mb-4">
              <em className="font-serif italic">Choose Your AI Agent</em>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {aiAgents.map((agent) => (
                <motion.button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-2xl border transition-all duration-200 text-left ${
                    selectedAgent.id === agent.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-xs text-gray-600">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-xs font-light text-gray-500">{agent.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Voice Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm"
          >
            {/* Selected Agent Display */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <Image
                  src={selectedAgent.avatar || "/placeholder.svg"}
                  alt={selectedAgent.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mx-auto"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                    callStatus.type === "connected"
                      ? "bg-green-500"
                      : callStatus.type === "connecting"
                        ? "bg-yellow-500"
                        : callStatus.type === "error"
                          ? "bg-red-500"
                          : "bg-gray-400"
                  }`}
                />
              </div>
              <h4 className="text-lg font-medium text-gray-900">{selectedAgent.name}</h4>
              <p className="text-sm text-gray-600">{selectedAgent.role}</p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-gray-50">
              {getStatusIcon()}
              <span className="text-sm font-medium text-gray-700">{callStatus.message}</span>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {callStatus.type === "idle" && (
                <button
                  onClick={startCall}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="h-5 w-5" />
                  Start Call with {selectedAgent.name}
                </button>
              )}

              {(callStatus.type === "connected" ||
                callStatus.type === "listening" ||
                callStatus.type === "speaking") && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={callStatus.type === "speaking"}
                      className={`flex-1 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
                      }`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isRecording ? "Stop" : "Speak"}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                        isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>

                  {audioUrl && (
                    <button
                      onClick={togglePlayback}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause Response" : "Play Response"}
                    </button>
                  )}

                  <button
                    onClick={endCall}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4 rotate-[135deg]" />
                    End Call
                  </button>
                </div>
              )}

              {callStatus.type === "error" && (
                <button
                  onClick={() => setCallStatus({ type: "idle", message: "Ready to call" })}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Try Again
                </button>
              )}
            </div>

            {/* Demo Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">
                <em className="font-serif italic">Try saying:</em>
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• "Book me a flight to London next week"</li>
                <li>• "What's my travel budget status?"</li>
                <li>• "Find hotels near the conference center"</li>
                <li>• "Check my expense reports"</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
