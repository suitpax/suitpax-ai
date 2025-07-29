"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { PiPhoneFill, PiMicrophoneFill, PiStopFill, PiSpeakerHighFill } from "react-icons/pi"

const voiceAgents = [
  {
    id: 1,
    name: "Emma",
    role: "Executive Travel Assistant",
    image: "/agents/agent-emma.jpeg",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - Professional female
    languages: ["English", "Spanish", "French"],
    specialty: "Executive flights and luxury accommodations",
    accent: "American",
    status: "available" as const,
  },
  {
    id: 2,
    name: "Marcus",
    role: "Corporate Travel Specialist",
    image: "/agents/agent-marcus.jpeg",
    voiceId: "VR6AewLTigWG4xSOukaG", // Josh - Professional male
    languages: ["English", "German", "Italian"],
    specialty: "Policy compliance and cost optimization",
    accent: "British",
    status: "available" as const,
  },
  {
    id: 3,
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - Elegant female
    languages: ["English", "French", "Portuguese"],
    specialty: "Luxury experiences and concierge services",
    accent: "Canadian",
    status: "available" as const,
  },
  {
    id: 4,
    name: "Alex",
    role: "Tech & Innovation Guide",
    image: "/agents/agent-alex.jpeg",
    voiceId: "29vD33N1CtxCmqQRPOHJ", // Drew - Tech-savvy male
    languages: ["English", "Mandarin", "Korean"],
    specialty: "Travel apps and digital integration",
    accent: "Australian",
    status: "available" as const,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-400"
    case "busy":
      return "bg-orange-400"
    case "offline":
      return "bg-gray-400"
    default:
      return "bg-gray-300"
  }
}

export const AIVoiceCallingHub = () => {
  const [selectedAgent, setSelectedAgent] = useState(voiceAgents[0])
  const [isCallActive, setIsCallActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsListening(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      // Convert speech to text
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const transcriptResponse = await fetch("/api/elevenlabs/speech-to-text", {
        method: "POST",
        body: formData,
      })

      const { transcript: userTranscript } = await transcriptResponse.json()
      setTranscript(userTranscript)

      // Generate AI response
      const chatResponse = await fetch("/api/voice-ai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userTranscript,
          agentId: selectedAgent.id,
        }),
      })

      const { response: aiResponse } = await chatResponse.json()
      setResponse(aiResponse)

      // Generate speech from AI response
      const speechResponse = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: aiResponse,
          voiceId: selectedAgent.voiceId,
        }),
      })

      if (speechResponse.ok) {
        const audioBlob = await speechResponse.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)

        // Play the audio
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
        }
      }
    } catch (error) {
      console.error("Error processing audio:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCall = () => {
    if (isCallActive) {
      // End call
      setIsCallActive(false)
      setIsListening(false)
      setTranscript("")
      setResponse("")
      setAudioUrl(null)
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
    } else {
      // Start call
      setIsCallActive(true)
      setResponse(
        `Hello! I'm ${selectedAgent.name}, your ${selectedAgent.role.toLowerCase()}. How can I help you with your business travel today?`,
      )
    }
  }

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
              <PiMicrophoneFill className="w-2.5 h-2.5 mr-1" />
              Voice AI
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Live Demo
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-black leading-none mb-3">
            Talk to our AI agents
          </h2>
          <p className="text-xs font-medium text-gray-500 max-w-lg mx-auto">
            Experience natural voice conversations with AI travel specialists powered by ElevenLabs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Agent Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Choose your specialist</h3>
              <div className="grid grid-cols-2 gap-3">
                {voiceAgents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedAgent.id === agent.id
                        ? "bg-gray-50 border-gray-300 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <Image
                          src={agent.image || "/placeholder.svg"}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                        <div
                          className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${getStatusColor(
                            agent.status,
                          )} rounded-full border-2 border-white`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{agent.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{agent.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{agent.specialty}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Voice Interface */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <Image
                    src={selectedAgent.image || "/placeholder.svg"}
                    alt={selectedAgent.name}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor(
                      selectedAgent.status,
                    )} rounded-full border-2 border-white`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedAgent.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgent.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="space-y-4">
                <motion.button
                  onClick={handleCall}
                  className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    isCallActive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-black hover:bg-gray-800 text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PiPhoneFill className="w-4 h-4" />
                  {isCallActive ? "End Call" : "Start Voice Call"}
                </motion.button>

                {isCallActive && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    {/* Voice Controls */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={isListening ? stopListening : startListening}
                        disabled={isProcessing}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          isListening
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isListening ? (
                          <>
                            <PiStopFill className="w-3 h-3" />
                            Stop Listening
                          </>
                        ) : (
                          <>
                            <PiMicrophoneFill className="w-3 h-3" />
                            {isProcessing ? "Processing..." : "Speak"}
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Conversation Display */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 max-h-48 overflow-y-auto">
                      {response && (
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <PiSpeakerHighFill className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900 mb-1">{selectedAgent.name}</p>
                            <p className="text-xs text-gray-600">{response}</p>
                          </div>
                        </div>
                      )}

                      {transcript && (
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <PiMicrophoneFill className="w-3 h-3 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900 mb-1">You</p>
                            <p className="text-xs text-gray-600">{transcript}</p>
                          </div>
                        </div>
                      )}

                      {isListening && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          Listening...
                        </div>
                      )}

                      {isProcessing && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          Processing your request...
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Hidden audio element for playback */}
              <audio ref={audioRef} style={{ display: "none" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIVoiceCallingHub
