"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  PiPhoneBold,
  PiPhoneSlashBold,
  PiMicrophoneBold,
  PiMicrophoneSlashBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
  PiRecordBold,
  PiStopBold,
  PiWaveformBold,
} from "react-icons/pi"
import { useSpeechToText } from "@/hooks/use-speech-to-text"

interface CallParticipant {
  id: string
  name: string
  avatar: string
  status: "connected" | "connecting" | "disconnected"
  isMuted: boolean
  isSpeaking: boolean
}

export default function AIVoiceCallingHub() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState("")
  const [callQuality, setCallQuality] = useState<"excellent" | "good" | "poor">("excellent")

  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechToText()

  const [participants] = useState<CallParticipant[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/agents/agent-sophia.jpeg",
      status: "connected",
      isMuted: false,
      isSpeaking: true,
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      avatar: "/agents/agent-marcus.jpeg",
      status: "connected",
      isMuted: false,
      isSpeaking: false,
    },
    {
      id: "3",
      name: "Emma Thompson",
      avatar: "/agents/agent-emma.jpeg",
      status: "connecting",
      isMuted: true,
      isSpeaking: false,
    },
  ])

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  // Voice recognition effect
  useEffect(() => {
    if (voiceRecognitionActive && transcript) {
      setLiveTranscript(transcript)
    }
  }, [transcript, voiceRecognitionActive])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartCall = () => {
    setIsCallActive(true)
    setCallDuration(0)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setCallDuration(0)
    setLiveTranscript("")
    if (isListening) {
      stopListening()
    }
    setVoiceRecognitionActive(false)
  }

  const toggleVoiceRecognition = async () => {
    if (voiceRecognitionActive) {
      await stopListening()
      setVoiceRecognitionActive(false)
    } else {
      await startListening()
      setVoiceRecognitionActive(true)
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-white px-2.5 py-0.5 text-[10px] font-medium text-black mb-6">
            <Image src="/logo/suitpax-symbol.webp" alt="Suitpax" width={12} height={12} className="mr-1.5 w-3 h-3" />
            AI Voice Calling Hub
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
            Enterprise Voice
            <br />
            <span className="text-gray-400">Communication Platform</span>
          </h2>
          <p className="text-lg font-light text-gray-300 max-w-3xl mx-auto">
            Advanced AI-powered voice calling with real-time transcription, voice recognition, and intelligent
            conversation analysis for business communications.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Call Interface */}
              <div className="lg:col-span-2 space-y-6">
                {/* Call Header */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${isCallActive ? "bg-green-500" : "bg-gray-500"}`} />
                    <span className="text-sm font-medium">{isCallActive ? "Call Active" : "Ready to Connect"}</span>
                    {isCallActive && <span className="text-sm text-gray-400">{formatDuration(callDuration)}</span>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${getQualityColor(callQuality)}`}>
                      {callQuality.toUpperCase()}
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-3 rounded-full ${
                            i < (callQuality === "excellent" ? 3 : callQuality === "good" ? 2 : 1)
                              ? "bg-green-500"
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Participants Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {participants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      className="relative p-4 bg-gray-800/30 rounded-xl border border-gray-700"
                      animate={participant.isSpeaking ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 0.5, repeat: participant.isSpeaking ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      <div className="text-center">
                        <div className="relative inline-block mb-3">
                          <Image
                            src={participant.avatar || "/placeholder.svg"}
                            alt={participant.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 rounded-full object-cover"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                              participant.status === "connected"
                                ? "bg-green-500"
                                : participant.status === "connecting"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          {participant.isSpeaking && (
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-green-500"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            />
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-white">{participant.name}</h4>
                        <p className="text-xs text-gray-400 capitalize">{participant.status}</p>
                        {participant.isMuted && <PiMicrophoneSlashBold className="w-3 h-3 text-red-500 mx-auto mt-1" />}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Live Transcription */}
                {isCallActive && (
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white flex items-center">
                        <PiWaveformBold className="w-4 h-4 mr-2" />
                        Live Transcription
                      </h4>
                      <button
                        onClick={toggleVoiceRecognition}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          voiceRecognitionActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {voiceRecognitionActive ? "ON" : "OFF"}
                      </button>
                    </div>
                    <div className="min-h-[80px] p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      {liveTranscript ? (
                        <p className="text-sm text-gray-300">{liveTranscript}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          {voiceRecognitionActive ? "Listening for speech..." : "Voice recognition disabled"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Control Panel */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium tracking-tighter text-white">Call Controls</h3>

                {/* Main Call Button */}
                <div className="text-center">
                  <motion.button
                    onClick={isCallActive ? handleEndCall : handleStartCall}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isCallActive
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCallActive ? <PiPhoneSlashBold className="w-8 h-8" /> : <PiPhoneBold className="w-8 h-8" />}
                  </motion.button>
                  <p className="mt-2 text-sm text-gray-400">{isCallActive ? "End Call" : "Start Call"}</p>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-xl transition-colors ${
                      isMuted
                        ? "bg-red-600/20 border border-red-600 text-red-400"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                    disabled={!isCallActive}
                  >
                    {isMuted ? (
                      <PiMicrophoneSlashBold className="w-5 h-5 mx-auto" />
                    ) : (
                      <PiMicrophoneBold className="w-5 h-5 mx-auto" />
                    )}
                    <p className="text-xs mt-1">{isMuted ? "Unmute" : "Mute"}</p>
                  </button>

                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`p-4 rounded-xl transition-colors ${
                      !isSpeakerOn
                        ? "bg-yellow-600/20 border border-yellow-600 text-yellow-400"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                    disabled={!isCallActive}
                  >
                    {isSpeakerOn ? (
                      <PiSpeakerHighBold className="w-5 h-5 mx-auto" />
                    ) : (
                      <PiSpeakerSlashBold className="w-5 h-5 mx-auto" />
                    )}
                    <p className="text-xs mt-1">Speaker</p>
                  </button>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-4 rounded-xl transition-colors ${
                      isRecording
                        ? "bg-red-600/20 border border-red-600 text-red-400"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                    disabled={!isCallActive}
                  >
                    {isRecording ? (
                      <PiStopBold className="w-5 h-5 mx-auto" />
                    ) : (
                      <PiRecordBold className="w-5 h-5 mx-auto" />
                    )}
                    <p className="text-xs mt-1">{isRecording ? "Stop" : "Record"}</p>
                  </button>

                  <button
                    onClick={toggleVoiceRecognition}
                    className={`p-4 rounded-xl transition-colors ${
                      voiceRecognitionActive
                        ? "bg-blue-600/20 border border-blue-600 text-blue-400"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                    disabled={!isCallActive}
                  >
                    <PiWaveformBold className="w-5 h-5 mx-auto" />
                    <p className="text-xs mt-1">Voice AI</p>
                  </button>
                </div>

                {/* Call Statistics */}
                {isCallActive && (
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700 space-y-3">
                    <h4 className="text-sm font-medium text-white">Call Statistics</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{formatDuration(callDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-white">
                          {participants.filter((p) => p.status === "connected").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quality:</span>
                        <span className={getQualityColor(callQuality)}>{callQuality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recording:</span>
                        <span className={isRecording ? "text-red-400" : "text-gray-400"}>
                          {isRecording ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
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
