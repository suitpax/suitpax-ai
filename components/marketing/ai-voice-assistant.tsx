"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MdMic, MdMicOff, MdVolumeUp, MdSend } from "react-icons/md"
import { useSpeechToText } from "@/hooks/use-speech-recognition"
import { detectLanguage } from "@/lib/language-detection"

export default function AIVoiceAssistant() {
  const [inputText, setInputText] = useState("")
  const [responseText, setResponseText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en-US")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Speech-to-text configuration
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechToText({
    onTranscriptChange: (text) => {
      setInputText(text) // Real-time transcription display

      // Detect language automatically
      if (text.length > 10) {
        const detected = detectLanguage(text)
        if (detected.confidence > 0.6) {
          setDetectedLanguage(detected.speechCode)
        }
      }
    },
    onEnd: (finalTranscript) => {
      setInputText(finalTranscript)
      if (finalTranscript.trim()) {
        processUserInput(finalTranscript)
      }
    },
    continuous: false,
    language: detectedLanguage,
    autoDetectLanguage: true,
  })

  const toggleListening = async () => {
    if (isListening) {
      stopListening()
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        resetTranscript()
        setInputText("")
        setResponseText("")
        startListening()
        setErrorMessage(null)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        setErrorMessage("Could not access microphone. Please check browser permissions.")
      }
    }
  }

  const processUserInput = async (userInput: string) => {
    setIsProcessing(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate contextual response for business travel
    let response = ""
    const input = userInput.toLowerCase()

    if (input.includes("flight") || input.includes("book") || input.includes("travel")) {
      response =
        "I've found several business class options for your trip. The best flights depart at 10:30 AM with British Airways and 2:15 PM with Lufthansa. Both comply with your company's travel policy. Would you like me to proceed with the booking?"
    } else if (input.includes("hotel") || input.includes("accommodation") || input.includes("stay")) {
      response =
        "I recommend the Marriott Downtown and Hilton Business Center for your stay. Both offer executive lounges and are within your approved budget of 300 euros per night. Shall I reserve a room with late checkout privileges?"
    } else if (input.includes("expense") || input.includes("receipt") || input.includes("cost")) {
      response =
        "I'll automatically categorize your travel expenses and submit them for approval. Your current trip budget utilization is at 78%, well within policy limits. All receipts will be digitally captured and processed."
    } else if (input.includes("meeting") || input.includes("schedule") || input.includes("calendar")) {
      response =
        "I've synchronized your travel itinerary with your calendar. Your meetings are scheduled around your flight times, and I've added buffer time for airport transfers. Would you like me to send calendar invites to all participants?"
    } else {
      response =
        "I understand you need assistance with your business travel arrangements. I can help you book flights, reserve hotels, manage expenses, and coordinate your schedule. What specific aspect would you like me to help you with?"
    }

    setResponseText(response)
    setIsProcessing(false)

    // Convert response to speech with female voice
    await convertTextToSpeech(response)
  }

  const convertTextToSpeech = async (text: string) => {
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - Female voice
          language: "en-US",
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlayingAudio(true)
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error)
    }
  }

  const handleManualSubmit = () => {
    if (inputText.trim()) {
      processUserInput(inputText)
    }
  }

  const playResponse = () => {
    if (audioRef.current && responseText) {
      audioRef.current.play()
      setIsPlayingAudio(true)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Badges estilo manifesto */}
            <div className="flex justify-center items-center gap-1.5 mb-3">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={50}
                  height={12}
                  className="h-2.5 w-auto mr-1"
                />
                <em className="font-serif italic">Voice Intelligence</em>
              </span>
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
                <em className="font-serif italic">Real-time Speech</em>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto">
              <em className="font-serif italic">Intelligent Voice Assistant</em> for Business Travel
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl">
              <em className="font-serif italic">Speak naturally</em> to manage your travel, expenses, and bookings with
              AI-powered voice recognition.
            </p>
            <p className="mt-2 text-xs font-light text-gray-500 max-w-2xl">
              Real-time transcription, intelligent responses, and seamless integration with your workflow.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 md:p-8">
            {/* Header con estilo manifesto */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Image
                  src="/agents/agent-emma.jpeg"
                  alt="Emma - AI Travel Assistant"
                  width={48}
                  height={48}
                  className="rounded-full h-12 w-12 object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-sm font-medium text-black">
                    <em className="font-serif italic">Emma</em>
                  </h3>
                  <p className="text-xs text-gray-600">
                    <em className="font-serif italic">AI Travel Assistant</em>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Voice-Powered Intelligence</em>
                </div>
                <div className="text-[10px] text-gray-500">Real-time speech processing</div>
              </div>
            </div>

            {/* Input Section con estilo manifesto */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Speak Your Request</em>
                </h4>
                <div className="relative flex items-center gap-2 p-1 rounded-xl border border-gray-300 shadow-sm bg-white transition-all duration-300 hover:shadow-md">
                  <div className="flex-1 py-3 px-4 text-sm text-gray-900 min-h-[48px] flex items-center">
                    {inputText ? (
                      <span className="text-sm text-gray-900">
                        <em className="font-serif italic">{inputText}</em>
                      </span>
                    ) : isListening ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-600 animate-pulse">
                          <em className="font-serif italic">Listening...</em>
                        </span>
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-600"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-600"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, delay: 0.4 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-600"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        <em className="font-serif italic">Click the microphone and speak your travel request...</em>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mr-2">
                    <button
                      onClick={toggleListening}
                      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                      }`}
                      aria-label={isListening ? "Stop listening" : "Start listening"}
                    >
                      {isListening ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
                    </button>

                    <button
                      onClick={handleManualSubmit}
                      disabled={!inputText.trim() || isProcessing}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MdSend className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Response Section con estilo manifesto */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">AI Response</em>
                </h4>
                <div className="relative flex items-center gap-2 p-1 rounded-xl border border-gray-300 shadow-sm bg-gray-50">
                  <div className="flex-1 py-3 px-4 text-sm text-gray-900 min-h-[48px] flex items-center">
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                            className="w-2 h-2 rounded-full bg-gray-400"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-gray-400"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-gray-400"
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          <em className="font-serif italic">Processing your request...</em>
                        </span>
                      </div>
                    ) : responseText ? (
                      <span className="text-sm text-gray-900">
                        <em className="font-serif italic">{responseText}</em>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        <em className="font-serif italic">AI response will appear here...</em>
                      </span>
                    )}
                  </div>

                  {responseText && (
                    <div className="mr-2">
                      <button
                        onClick={playResponse}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                          isPlayingAudio ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        aria-label="Play response"
                      >
                        <MdVolumeUp className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Messages con estilo manifesto */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">
                  <em className="font-serif italic">{errorMessage}</em>
                </p>
              </div>
            )}

            {!browserSupportsSpeechRecognition && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  <em className="font-serif italic">
                    Your browser doesn't support speech recognition. Please try Chrome or Edge for the best experience.
                  </em>
                </p>
              </div>
            )}

            {/* Features con estilo manifesto */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Real-time</em>
                </div>
                <div className="text-[10px] text-gray-500">Transcription</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Natural</em>
                </div>
                <div className="text-[10px] text-gray-500">Voice Response</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Multi-language</em>
                </div>
                <div className="text-[10px] text-gray-500">Support</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">Business</em>
                </div>
                <div className="text-[10px] text-gray-500">Context Aware</div>
              </div>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              onEnded={() => setIsPlayingAudio(false)}
              onPlay={() => setIsPlayingAudio(true)}
              className="hidden"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
