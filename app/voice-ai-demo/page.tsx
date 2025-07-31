"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MicrophoneIcon, SpeakerWaveIcon, StopIcon, PlayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { PiSparkle } from "react-icons/pi"

interface Agent {
  id: string
  name: string
  role: string
  avatar: string
  status: "available" | "busy" | "offline"
  specialties: string[]
}

interface Message {
  id: string
  type: "user" | "agent"
  content: string
  timestamp: Date
  audioUrl?: string
}

const agents: Agent[] = [
  {
    id: "sophia",
    name: "Sophia",
    role: "Senior Travel Coordinator",
    avatar: "/agents/agent-sophia.jpeg",
    status: "available",
    specialties: ["Flight Booking", "Hotel Reservations", "Itinerary Planning"],
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Expense Management Specialist",
    avatar: "/agents/agent-marcus.jpeg",
    status: "available",
    specialties: ["Expense Reports", "Policy Compliance", "Budget Analysis"],
  },
  {
    id: "emma",
    name: "Emma",
    role: "Corporate Travel Advisor",
    avatar: "/agents/agent-emma.jpeg",
    status: "busy",
    specialties: ["Group Travel", "Executive Assistance", "Travel Policies"],
  },
  {
    id: "alex",
    name: "Alex",
    role: "AI Travel Intelligence",
    avatar: "/agents/agent-alex.jpeg",
    status: "available",
    specialties: ["Route Optimization", "Cost Analysis", "Predictive Insights"],
  },
]

const quickCommands = [
  "Book a flight to New York next week",
  "Show me my expense report for this month",
  "Find hotels near the conference center",
  "What's my travel budget remaining?",
  "Reschedule my meeting for tomorrow",
]

export default function VoiceAIDemoPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: "welcome",
        type: "agent",
        content: `Hi! I'm ${selectedAgent.name}, your ${selectedAgent.role}. I'm here to help you with ${selectedAgent.specialties.join(", ").toLowerCase()}. How can I assist you today?`,
        timestamp: new Date(),
      },
    ])
  }, [selectedAgent])

  const handleStartRecording = () => {
    setIsRecording(true)
    // Simulate recording - in real app, this would use Web Speech API
    setTimeout(() => {
      setIsRecording(false)
      handleUserMessage("I need to book a flight to San Francisco for next Tuesday")
    }, 3000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  const handleUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: getAgentResponse(content, selectedAgent),
        timestamp: new Date(),
        audioUrl: "/audio/sample-response.mp3", // In real app, this would be generated
      }
      setMessages((prev) => [...prev, agentResponse])
    }, 1500)
  }

  const getAgentResponse = (userInput: string, agent: Agent): string => {
    const responses = {
      sophia:
        "I'd be happy to help you book that flight to San Francisco. Let me check available options for next Tuesday. I'm finding several flights with good prices and convenient times. Would you prefer morning or afternoon departure?",
      marcus:
        "I can help you with that expense report. Let me pull up your recent transactions and categorize them according to your company's travel policy. I see some items that need receipts - shall I send you reminders?",
      emma: "For your corporate travel needs, I recommend booking through our preferred partners for better rates and policy compliance. Let me coordinate the details and ensure everything aligns with your company guidelines.",
      alex: "Based on your travel patterns and current market data, I can optimize your route and suggest cost-effective alternatives. The AI analysis shows potential savings of 15% if you're flexible with timing.",
    }
    return (
      responses[agent.id as keyof typeof responses] ||
      "I'm here to help with your travel needs. Could you provide more specific details about what you're looking for?"
    )
  }

  const handlePlayAudio = (message: Message) => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
      setIsPlaying(false)
    }

    if (message.audioUrl) {
      const audio = new Audio(message.audioUrl)
      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        setCurrentAudio(null)
      }
      audio.play()
      setCurrentAudio(audio)
    }
  }

  const handleQuickCommand = (command: string) => {
    handleUserMessage(command)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-black">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-medium tracking-tighter text-black">Voice AI Demo</h1>
              <div className="inline-flex items-center rounded-lg bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
                <PiSparkle className="mr-1 h-2.5 w-2.5" />
                <em className="font-serif italic">Live Demo</em>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h3 className="text-sm font-medium text-black mb-4">Choose Your AI Agent</h3>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full p-3 rounded-xl border transition-all ${
                      selectedAgent.id === agent.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={agent.avatar || "/placeholder.svg"}
                          alt={agent.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            agent.status === "available"
                              ? "bg-green-500"
                              : agent.status === "busy"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-medium text-black">{agent.name}</p>
                        <p className="text-[10px] text-gray-600">{agent.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Agent Details */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-black mb-2">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center rounded-md bg-gray-200 px-1.5 py-0.5 text-[9px] font-medium text-gray-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mt-4">
              <h3 className="text-sm font-medium text-black mb-3">Quick Commands</h3>
              <div className="space-y-2">
                {quickCommands.map((command, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickCommand(command)}
                    className="w-full text-left p-2 text-xs text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    "{command}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Image
                    src={selectedAgent.avatar || "/placeholder.svg"}
                    alt={selectedAgent.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-black">{selectedAgent.name}</h3>
                    <p className="text-xs text-gray-600">{selectedAgent.role}</p>
                  </div>
                  <div
                    className={`ml-auto w-2 h-2 rounded-full ${
                      selectedAgent.status === "available"
                        ? "bg-green-500"
                        : selectedAgent.status === "busy"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.type === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.audioUrl && message.type === "agent" && (
                          <button
                            onClick={() => handlePlayAudio(message)}
                            className="mt-2 flex items-center space-x-2 text-xs text-gray-600 hover:text-black"
                          >
                            {isPlaying ? <StopIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
                            <span>Play Audio</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Voice Controls */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isRecording ? "bg-red-500 text-white animate-pulse" : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {isRecording ? <StopIcon className="h-6 w-6" /> : <MicrophoneIcon className="h-6 w-6" />}
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-medium text-black">{isRecording ? "Listening..." : "Tap to speak"}</p>
                    <p className="text-[10px] text-gray-600">Voice-powered AI assistance</p>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <SpeakerWaveIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
