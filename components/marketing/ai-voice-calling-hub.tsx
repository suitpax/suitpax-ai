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

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <Image src="/logo/suitpax-symbol.webp" alt="Suitpax" width={12} height={12} className="mr-1.5 w-3 h-3" />
            AI Voice Calling Hub
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tighter leading-none mb-6 text-black">
            Enterprise Voice
            <br />
            <span className="text-gray-600 font-inter">Communication Platform</span>
          </h2>
          <p className="text-lg font-light text-gray-700 max-w-3xl mx-auto font-inter">
            Advanced AI-powered voice calling with real-time transcription, voice recognition, and intelligent
            conversation analysis for business communications.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Call Header */}
            <div className="flex items-center justify-between p-4 bg-gray-100/50 backdrop-blur-sm rounded-xl border border-gray-200 mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isCallActive ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-sm font-medium font-inter">
                  {isCallActive ? "Call Active" : "Ready to Connect"}
                </span>
                {isCallActive && (
                  <span className="text-sm text-gray-500 font-inter">{formatDuration(callDuration)}</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-green-600 font-inter">EXCELLENT</span>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-3 rounded-full bg-green-500" />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Participants */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {participants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 p-4 text-center"
                      animate={participant.isSpeaking ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 0.5, repeat: participant.isSpeaking ? Number.POSITIVE_INFINITY : 0 }}
                    >
                      <div className="relative inline-block mb-3">
                        <Image
                          src={participant.avatar || "/placeholder.svg"}
                          alt={participant.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            participant.status === "connected"
                              ? "bg-green-500"
                              : participant.status === "connecting"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        {participant.isSpeaking && (
                          <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-green-500"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          />
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 font-inter">{participant.name}</h4>
                      <p className="text-xs text-gray-500 capitalize font-inter">{participant.status}</p>
                      {participant.isMuted && <PiMicrophoneSlashBold className="w-3 h-3 text-red-500 mx-auto mt-1" />}
                    </motion.div>
                  ))}
                </div>

                {/* Live Transcription */}
                {isCallActive && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center font-inter">
                        <PiWaveformBold className="w-4 h-4 mr-2" />
                        Live Transcription
                      </h4>
                      <button
                        onClick={toggleVoiceRecognition}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors font-inter ${
                          voiceRecognitionActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {voiceRecognitionActive ? "ON" : "OFF"}
                      </button>
                    </div>
                    <div className="min-h-[60px] p-3 bg-gray-50 rounded-xl border border-gray-200">
                      {liveTranscript ? (
                        <p className="text-sm text-gray-700 font-inter">{liveTranscript}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic font-inter">
                          {voiceRecognitionActive ? "Listening for speech..." : "Voice recognition disabled"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium tracking-tighter text-gray-900 font-serif">Call Controls</h3>

                {/* Main Call Button */}
                <div className="text-center">
                  <motion.button
                    onClick={isCallActive ? handleEndCall : handleStartCall}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                      isCallActive
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCallActive ? <PiPhoneSlashBold className="w-6 h-6" /> : <PiPhoneBold className="w-6 h-6" />}
                  </motion.button>
                  <p className="mt-2 text-sm text-gray-600 font-inter">{isCallActive ? "End Call" : "Start Call"}</p>
                </div>

                {/* Control Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-xl transition-colors ${
                      isMuted
                        ? "bg-red-100 border border-red-200 text-red-600"
                        : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={!isCallActive}
                  >
                    {isMuted ? (
                      <PiMicrophoneSlashBold className="w-4 h-4 mx-auto" />
                    ) : (
                      <PiMicrophoneBold className="w-4 h-4 mx-auto" />
                    )}
                    <p className="text-xs mt-1 font-inter">{isMuted ? "Unmute" : "Mute"}</p>
                  </button>

                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`p-3 rounded-xl transition-colors ${
                      !isSpeakerOn
                        ? "bg-yellow-100 border border-yellow-200 text-yellow-600"
                        : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={!isCallActive}
                  >
                    {isSpeakerOn ? (
                      <PiSpeakerHighBold className="w-4 h-4 mx-auto" />
                    ) : (
                      <PiSpeakerSlashBold className="w-4 h-4 mx-auto" />
                    )}
                    <p className="text-xs mt-1 font-inter">Speaker</p>
                  </button>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-3 rounded-xl transition-colors ${
                      isRecording
                        ? "bg-red-100 border border-red-200 text-red-600"
                        : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={!isCallActive}
                  >
                    {isRecording ? (
                      <PiStopBold className="w-4 h-4 mx-auto" />
                    ) : (
                      <PiRecordBold className="w-4 h-4 mx-auto" />
                    )}
                    <p className="text-xs mt-1 font-inter">{isRecording ? "Stop" : "Record"}</p>
                  </button>

                  <button
                    onClick={toggleVoiceRecognition}
                    className={`p-3 rounded-xl transition-colors ${
                      voiceRecognitionActive
                        ? "bg-blue-100 border border-blue-200 text-blue-600"
                        : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={!isCallActive}
                  >
                    <PiWaveformBold className="w-4 h-4 mx-auto" />
                    <p className="text-xs mt-1 font-inter">Voice AI</p>
                  </button>
                </div>

                {/* Call Stats */}
                {isCallActive && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 p-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 font-inter">Call Statistics</h4>
                    <div className="space-y-1 text-xs font-inter">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="text-gray-900">{formatDuration(callDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span className="text-gray-900">
                          {participants.filter((p) => p.status === "connected").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quality:</span>
                        <span className="text-green-600">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recording:</span>
                        <span className={isRecording ? "text-red-600" : "text-gray-600"}>
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
