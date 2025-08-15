"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, Calendar, MapPin, Clock, CheckCircle } from "lucide-react"

interface VoiceSearchProps {
  userPlan: "free" | "basic" | "pro" | "custom"
}

export function VoiceSearchShowcase({ userPlan }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const mockCommands = [
    "I need to visit our client in Barcelona next Tuesday",
    "Book a flight to the Microsoft meeting tomorrow",
    "Find hotels near the conference in Amsterdam",
    "Schedule travel for the London office visit",
  ]

  const getFeaturesByPlan = () => {
    switch (userPlan) {
      case "free":
        return {
          languages: 1,
          contextual: false,
          integration: false,
          description: "Basic voice recognition demo",
        }
      case "basic":
        return {
          languages: 3,
          contextual: true,
          integration: false,
          description: "Voice search with basic context understanding",
        }
      case "pro":
        return {
          languages: 10,
          contextual: true,
          integration: true,
          description: "Advanced voice search with calendar integration",
        }
      case "custom":
        return {
          languages: "All",
          contextual: true,
          integration: true,
          description: "Enterprise voice AI with custom training",
        }
    }
  }

  const features = getFeaturesByPlan()

  const simulateVoiceSearch = () => {
    if (userPlan === "free" && isListening) return

    setIsListening(true)
    setTranscript("")
    setResult(null)

    // Simulate voice input
    const command = mockCommands[Math.floor(Math.random() * mockCommands.length)]
    let currentText = ""

    const typeText = () => {
      if (currentText.length < command.length) {
        currentText += command[currentText.length]
        setTranscript(currentText)
        setTimeout(typeText, 100)
      } else {
        setIsListening(false)
        setIsProcessing(true)

        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false)
          setResult({
            destination: "Barcelona",
            date: "Next Tuesday",
            type: "Business Meeting",
            autoApproved: true,
            confidence: 96,
          })
        }, 2000)
      }
    }

    setTimeout(typeText, 500)
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Volume2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight">Voice Search + Context</h3>
            <p className="text-gray-400 text-sm">{features.description}</p>
          </div>
          <Badge className="ml-auto bg-purple-500/20 text-purple-400 border-purple-500/30">
            {features.languages} Languages
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">30s</div>
            <div className="text-xs text-gray-400">Avg Booking</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">98%</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{features.contextual ? "Yes" : "No"}</div>
            <div className="text-xs text-gray-400">Contextual</div>
          </div>
        </div>

        <Button
          onClick={simulateVoiceSearch}
          className={`w-full mb-4 ${
            isListening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          } text-white`}
          disabled={isProcessing || (userPlan === "free" && (isListening || result))}
        >
          {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
          {isListening ? "Listening..." : isProcessing ? "Processing..." : "Start Voice Demo"}
        </Button>

        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-400">You said:</span>
              </div>
              <p className="text-white">{transcript}</p>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Analyzing context and finding options...</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-700/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">Auto-Approved</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                  {result.confidence}% confident
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">{result.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-300">{result.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-300">{result.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Policy Compliant</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {userPlan === "free" && (result || isListening) && (
          <div className="text-center py-4 border-t border-gray-700 mt-4">
            <p className="text-gray-400 text-sm mb-2">Upgrade for unlimited voice commands</p>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
              Upgrade Plan
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
