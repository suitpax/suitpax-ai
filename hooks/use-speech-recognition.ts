"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface SpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  autoDetectLanguage?: boolean
  onTranscriptChange?: (transcript: string) => void
  onEnd?: (finalTranscript: string, detectedLanguage?: string) => void
  onError?: (error: string) => void
}

interface SpeechRecognitionResult {
  transcript: string
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  browserSupportsSpeechRecognition: boolean
  isMicrophoneAvailable: boolean
  error: string | null
  detectedLanguage: string
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}): SpeechRecognitionResult {
  const {
    continuous = false,
    interimResults = true,
    language = "en-US",
    autoDetectLanguage = false,
    onTranscriptChange,
    onEnd,
    onError,
  } = options

  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectedLanguage, setDetectedLanguage] = useState(language)
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
        onTranscriptChange?.(finalTranscript)
      } else if (interimTranscript) {
        setTranscript(interimTranscript)
        onTranscriptChange?.(interimTranscript)
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
          errorMessage = "Microphone permission denied."
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
    onTranscriptChange,
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
      setError(null)
      setIsMicrophoneAvailable(true)
      finalTranscriptRef.current = ""
      setTranscript("")
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
    finalTranscriptRef.current = ""
  }, [])

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    error,
    detectedLanguage,
  }
}

// Export as useSpeechToText for backward compatibility
export const useSpeechToText = useSpeechRecognition
