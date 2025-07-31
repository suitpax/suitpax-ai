"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MdPhone, MdStar, MdPhoneInTalk, MdClose } from "react-icons/md"
import Image from "next/image"
import { useState, useRef } from "react"
import { generateAgentResponse, generateWelcomeMessage } from "@/lib/anthropic"
import { generateSpeech, AGENT_VOICES } from "@/lib/elevenlabs"
import toast from "react-hot-toast"

const AI_AGENTS = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Specialist",
    image: "/agents/agent-emma.jpeg",
    rating: 4.9,
    status: "available",
    description: "Luxury business travel and VIP services",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Corporate Travel Expert",
    image: "/agents/agent-marcus.jpeg",
    rating: 4.8,
    status: "available",
    description: "Policy compliance and cost optimization",
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    rating: 4.9,
    status: "available",
    description: "Luxury experiences and personalized services",
  },
  {
    id: "alex",
    name: "Alex",
    role: "Tech & Innovation Guide",
    image: "/agents/agent-alex.jpeg",
    rating: 4.7,
    status: "available",
    description: "Travel technology and digital solutions",
  },
]

interface CallState {
  isActive: boolean
  agentId: string | null
  isConnecting: boolean
  isListening: boolean
  isSpeaking: boolean
}

export default function AIVoiceCallingHub() {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    agentId: null,
    isConnecting: false,
    isListening: false,
    isSpeaking: false,
  })

  const [conversation, setConversation] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const startCall = async (agentId: string) => {
    try {
      setCallState({ isActive: true, agentId, isConnecting: true, isListening: false, isSpeaking: false })

      // Generate welcome message
      const welcomeMessage = await generateWelcomeMessage(agentId)

      // Generate speech for welcome message
      const voice = AGENT_VOICES[agentId]
      if (voice) {
        const audioBuffer = await generateSpeech(welcomeMessage, voice.voice_id)
        const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
          setCallState((prev) => ({ ...prev, isConnecting: false, isSpeaking: true }))

          audioRef.current.onended = () => {
            setCallState((prev) => ({ ...prev, isSpeaking: false, isListening: true }))
          }
        }
      }

      setConversation([{ role: "assistant", content: welcomeMessage }])
    } catch (error) {
      console.error("Error starting call:", error)
      toast.error("Failed to connect to agent")
      endCall()
    }
  }

  const endCall = () => {
    setCallState({ isActive: false, agentId: null, isConnecting: false, isListening: false, isSpeaking: false })
    setConversation([])
    setIsRecording(false)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // Here you would typically send the audio to a speech-to-text service
        // For demo purposes, we'll simulate user input
        handleUserInput("I need to book a flight to New York for next week")
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Stop recording after 5 seconds for demo
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop()
          setIsRecording(false)
        }
      }, 5000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast.error("Could not access microphone")
    }
  }

  const handleUserInput = async (userMessage: string) => {
    if (!callState.agentId) return

    try {
      setCallState((prev) => ({ ...prev, isListening: false, isSpeaking: true }))

      const newConversation = [...conversation, { role: "user" as const, content: userMessage }]

      // Generate agent response
      const response = await generateAgentResponse(newConversation, callState.agentId)

      // Generate speech for response
      const voice = AGENT_VOICES[callState.agentId]
      if (voice) {
        const audioBuffer = await generateSpeech(response, voice.voice_id)
        const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()

          audioRef.current.onended = () => {
            setCallState((prev) => ({ ...prev, isSpeaking: false, isListening: true }))
          }
        }
      }

      setConversation([...newConversation, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error handling user input:", error)
      toast.error("Failed to process your request")
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6"
          >
            <MdPhone className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">AI Voice Calling</em>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none mb-6"
          >
            <em className="font-serif italic">Speak with AI Agents</em>
            <br />
            <span className="text-gray-600">Like Real Humans</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xs font-medium text-gray-500 max-w-2xl mx-auto"
          >
            Experience natural voice conversations with specialized AI travel agents powered by advanced speech
            technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {AI_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mx-auto">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      agent.status === "available" ? "bg-green-500" : "bg-orange-500"
                    }`}
                  ></div>
                </div>

                <h3 className="text-sm font-medium tracking-tighter mb-1">{agent.name}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  <em className="font-serif italic">{agent.role}</em>
                </p>
                <p className="text-xs text-gray-500 mb-3">{agent.description}</p>

                <div className="flex items-center justify-center space-x-1 text-xs mb-4">
                  <MdStar className="h-3 w-3 text-yellow-500" />
                  <span className="font-medium text-gray-700">{agent.rating}</span>
                </div>

                <button
                  onClick={() => startCall(agent.id)}
                  disabled={callState.isActive}
                  className="w-full py-2 px-4 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <MdPhone className="h-4 w-4" />
                  <span>Call {agent.name}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Call Interface */}
        <AnimatePresence>
          {callState.isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <div className="text-center">
                  {callState.agentId && (
                    <>
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 mx-auto mb-4">
                        <Image
                          src={AI_AGENTS.find((a) => a.id === callState.agentId)?.image || "/placeholder.svg"}
                          alt="Agent"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h3 className="text-lg font-medium tracking-tighter mb-2">
                        {AI_AGENTS.find((a) => a.id === callState.agentId)?.name}
                      </h3>

                      <div className="mb-6">
                        {callState.isConnecting && <p className="text-sm text-gray-600">Connecting...</p>}
                        {callState.isSpeaking && (
                          <p className="text-sm text-green-600 flex items-center justify-center">
                            <MdPhoneInTalk className="mr-2 h-4 w-4" />
                            Speaking...
                          </p>
                        )}
                        {callState.isListening && (
                          <div>
                            <p className="text-sm text-blue-600 mb-3">Listening...</p>
                            <button
                              onClick={startListening}
                              disabled={isRecording}
                              className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                isRecording ? "bg-red-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            >
                              {isRecording ? "Recording..." : "Hold to Speak"}
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={endCall}
                        className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <MdClose className="h-4 w-4" />
                        <span>End Call</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <audio ref={audioRef} className="hidden" />
      </div>
    </section>
  )
}
