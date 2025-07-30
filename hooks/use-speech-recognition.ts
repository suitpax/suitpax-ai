"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { detectLanguage } from "@/lib/language-detection"

interface SpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  autoDetectLanguage?: boolean
  onResult?: (transcript: string, isFinal: boolean) => void
  onEnd?: (finalTranscript: string, detectedLanguage?: string) => void
  onError?: (error: string) => void
}

interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  interimTranscript: string
  detectedLanguage: string
  error: string | null
  browserSupportsSpeechRecognition: boolean
  isMicrophoneAvailable: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechToText(options: SpeechRecognitionOptions = {}): SpeechRecognitionHook {
  const {
    continuous = false,
    interimResults = true,
    language = "en-US",
    autoDetectLanguage = false,
    onResult,
    onEnd,
    onError,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState(language)
  const [error, setError] = useState<string | null>(null)
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true)

  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef("")

  // Check browser support
  const browserSupportsSpeechRecognition =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  // Initialize speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    const recognition = recognitionRef.current

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = detectedLanguage

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript
        setTranscript(finalTranscript)

        // Auto-detect language if enabled
        if (autoDetectLanguage && finalTranscript.length > 10) {
          const detected = detectLanguage(finalTranscript)
          if (detected.confidence > 0.6) {
            setDetectedLanguage(detected.speechCode)
          }
        }

        onResult?.(finalTranscript, true)
      }

      if (interimTranscript) {
        setInterimTranscript(interimTranscript)
        onResult?.(interimTranscript, false)
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)

      let errorMessage = "Speech recognition error"

      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please try again."
          break
        case "audio-capture":
          errorMessage = "Microphone not accessible. Please check permissions."
          setIsMicrophoneAvailable(false)
          break
        case "not-allowed":
          errorMessage = "Microphone permission denied. Please allow microphone access."
          setIsMicrophoneAvailable(false)
          break
        case "network":
          errorMessage = "Network error. Please check your connection."
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      setError(errorMessage)
      setIsListening(false)
      onError?.(errorMessage)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript("")

      if (finalTranscriptRef.current) {
        onEnd?.(finalTranscriptRef.current, detectedLanguage)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [
    browserSupportsSpeechRecognition,
    continuous,
    interimResults,
    detectedLanguage,
    autoDetectLanguage,
    onResult,
    onEnd,
    onError,
  ])

  const startListening = useCallback(async () => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition not supported in this browser")
      return
    }

    if (!recognitionRef.current) return

    try {
      // Check microphone permissions
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsMicrophoneAvailable(true)
      setError(null)

      finalTranscriptRef.current = ""
      setTranscript("")
      setInterimTranscript("")

      recognitionRef.current.start()
    } catch (err) {
      console.error("Error starting speech recognition:", err)
      setError("Could not access microphone. Please check permissions.")
      setIsMicrophoneAvailable(false)
    }
  }, [browserSupportsSpeechRecognition])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
    finalTranscriptRef.current = ""
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    detectedLanguage,
    error,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    resetTranscript,
  }
}
