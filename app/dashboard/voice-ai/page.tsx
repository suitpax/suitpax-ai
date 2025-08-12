"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  MessageSquare,
  Clock,
  BarChart3,
  Users,
  Zap,
  Brain,
  Headphones,
  RotateCcw,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { useVoiceAI } from "@/contexts/voice-ai-context"

export default function VoiceAIPage() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [volume, setVolume] = useState([75])
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const supabase = createClient()
  const { startListening, stopListening, isSupported } = useVoiceAI()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Get user profile for display name
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
        if (profile) {
          setUser({ ...user, profile })
        }
      }
    }
    getUser()

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [supabase])

  const getDisplayName = () => {
    if (!user) return "User"
    return user.profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleVoiceToggle = async () => {
    if (isListening) {
      setIsListening(false)
      stopListening()
    } else {
      setIsListening(true)
      startListening()
    }
  }

  const voiceFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Understanding",
      description: "Advanced natural language processing for complex business queries",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate answers to travel planning and expense questions",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Data Insights",
      description: "Voice-activated analytics and reporting for business travel",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Coordinate team travel and expenses through voice commands",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
  ]

  const quickCommands = [
    "Book a flight to New York",
    "Show my expense reports",
    "What's my travel budget?",
    "Schedule a team meeting",
    "Find hotels in San Francisco",
    "Generate monthly travel report",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <VantaHaloBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Voice Assistant
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none text-gray-900 mb-4">
            {getGreeting()}, {getDisplayName().split(" ")[0]}!
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto">
            Your intelligent voice assistant for business travel management and expense tracking
          </p>
        </motion.div>

        {/* Main Voice Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-center">
              {/* Voice Visualizer */}
              <div className="relative mb-8">
                <div
                  className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 animate-pulse"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <Button
                    onClick={handleVoiceToggle}
                    disabled={!isSupported}
                    className={`w-24 h-24 rounded-full border-0 shadow-none ${
                      isListening
                        ? "bg-white text-blue-600 hover:bg-gray-50"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                </div>

                {isListening && (
                  <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
                )}
              </div>

              <h2 className="text-2xl font-medium tracking-tighter text-gray-900 mb-2">
                {isListening ? "Listening..." : "Ready to help"}
              </h2>
              <p className="text-gray-600 font-light mb-6">
                {isListening
                  ? "Speak naturally about your travel needs"
                  : "Click the microphone to start voice interaction"}
              </p>

              {/* Voice Controls */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} disabled={isListening} />
                  <span className="text-sm text-gray-600">Voice responses</span>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl bg-white/80">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-white/95 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Voice Volume</label>
                        <div className="flex items-center gap-3">
                          <VolumeX className="h-4 w-4 text-gray-400" />
                          <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                          <Volume2 className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500">{volume[0]}%</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Transcript and Response */}
              {(transcript || response) && (
                <div className="space-y-4 text-left">
                  {transcript && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">You said:</span>
                      </div>
                      <p className="text-gray-700">{transcript}</p>
                    </div>
                  )}

                  {response && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">AI Response:</span>
                      </div>
                      <p className="text-gray-700">{response}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium tracking-tighter text-gray-900 mb-2">Try these voice commands</h3>
            <p className="text-gray-600 font-light">Click any command to try it out, or speak naturally</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                className="p-4 h-auto text-left justify-start bg-white/80 hover:bg-white border-gray-200 rounded-xl"
                onClick={() => setTranscript(command)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700">"{command}"</span>
                </div>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Voice AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-medium tracking-tighter text-gray-900 mb-2">Powerful Voice Capabilities</h3>
            <p className="text-gray-600 font-light">Advanced AI features designed for business travel management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {voiceFeatures.map((feature, index) => (
              <Card key={index} className={`p-6 rounded-2xl border shadow-sm ${feature.color}`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h4 className="font-medium tracking-tight text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm font-light text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Voice Sessions Today</p>
                  <p className="text-3xl font-medium tracking-tighter text-gray-900">12</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-blue-600 font-medium">2.5 hours total</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Headphones className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Commands Processed</p>
                  <p className="text-3xl font-medium tracking-tighter text-gray-900">47</p>
                  <div className="flex items-center mt-2 text-sm">
                    <Zap className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">98% accuracy</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Time Saved</p>
                  <p className="text-3xl font-medium tracking-tighter text-gray-900">3.2h</p>
                  <div className="flex items-center mt-2 text-sm">
                    <RotateCcw className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-purple-600 font-medium">vs manual tasks</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
