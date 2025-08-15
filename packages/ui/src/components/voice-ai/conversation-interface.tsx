"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  PiMicrophoneFill,
  PiStopFill,
  PiPlayFill,
  PiSpeakerHighFill,
  PiWaveformBold,
  PiPauseFill,
} from "react-icons/pi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  audioUrl?: string
  language?: string
}

interface ConversationInterfaceProps {
  messages: Message[]
  status: "idle" | "listening" | "processing" | "speaking"
  transcript?: string
  agentName: string
  onStartListening: () => void
  onStopListening: () => void
  onEndCall: () => void
  onPlayMessage: (messageId: string) => void
  onPauseAudio: () => void
  error?: string | null
  isAudioPlaying?: boolean
}

export function ConversationInterface({
  messages,
  status,
  transcript,
  agentName,
  onStartListening,
  onStopListening,
  onEndCall,
  onPlayMessage,
  onPauseAudio,
  error,
  isAudioPlaying = false,
}: ConversationInterfaceProps) {
  const getStatusInfo = () => {
    switch (status) {
      case "listening":
        return { color: "text-blue-600", text: "Listening...", icon: PiMicrophoneFill }
      case "processing":
        return { color: "text-orange-600", text: "Processing...", icon: PiWaveformBold }
      case "speaking":
        return { color: "text-green-600", text: `${agentName} speaking...`, icon: PiSpeakerHighFill }
      default:
        return { color: "text-gray-600", text: "Ready", icon: PiMicrophoneFill }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-6">
      {/* Status Indicators */}
      <div className="flex items-center justify-center">
        <Badge variant="outline" className={`${statusInfo.color} border-current`}>
          <StatusIcon className="w-3 h-3 mr-1.5 animate-pulse" />
          {statusInfo.text}
        </Badge>
      </div>

      {/* Waveform Visualization */}
      <div className="flex items-center justify-center gap-1 h-16 px-4">
        {Array.from({ length: 30 }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-1 rounded-full ${
              status === "speaking" ? "bg-green-500" : status === "listening" ? "bg-blue-500" : "bg-gray-300"
            }`}
            animate={{
              height: status === "speaking" || status === "listening" ? [8, Math.random() * 40 + 8, 8] : 8,
              opacity: status === "speaking" || status === "listening" ? [0.3, 0.3 + Math.random() * 0.7, 0.3] : 0.3,
            }}
            transition={{
              duration: 0.5,
              repeat: status === "speaking" || status === "listening" ? Number.POSITIVE_INFINITY : 0,
              delay: index * 0.05,
            }}
          />
        ))}
      </div>

      {/* Current Transcript */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <p className="text-sm text-blue-800">
              <span className="font-medium">You:</span> {transcript}
              <span className="animate-pulse">|</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation Messages */}
      {messages.length > 0 && (
        <div className="max-h-64 overflow-y-auto space-y-3 bg-gray-50 rounded-xl p-4">
          <AnimatePresence>
            {messages.slice(-4).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.role === "user" ? "bg-white text-gray-900 border border-gray-200" : "bg-gray-800 text-white"
                  }`}
                >
                  <span className="font-medium">{message.role === "user" ? "You" : agentName}:</span> {message.content}
                  {message.audioUrl && message.role === "assistant" && (
                    <button
                      onClick={() => onPlayMessage(message.id)}
                      className="ml-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <PiPlayFill className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={status === "listening" ? onStopListening : onStartListening}
          disabled={status === "speaking" || status === "processing"}
          variant={status === "listening" ? "default" : "outline"}
          size="lg"
          className={status === "listening" ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <PiMicrophoneFill className="w-5 h-5 mr-2" />
          {status === "listening" ? "Stop" : "Speak"}
        </Button>

        <Button onClick={onEndCall} variant="destructive" size="lg">
          <PiStopFill className="w-5 h-5 mr-2" />
          End Call
        </Button>

        <Button onClick={onPauseAudio} variant="outline" size="lg" disabled={!isAudioPlaying}>
          {isAudioPlaying ? <PiPauseFill className="w-5 h-5 mr-2" /> : <PiSpeakerHighFill className="w-5 h-5 mr-2" />}
          Audio
        </Button>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ConversationInterface
