"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseSpeechToTextOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

interface SpeechToTextState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  isSupported: boolean
  error: string | null
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const { continuous = true, interimResults = true, language = "en-US", onResult, onError, onStart, onEnd } = options

  const [state, setState] = useState<SpeechToTextState>({
    isListening: false,
    transcript: "",
    interimTranscript: "",
    isSupported: false,
    error: null,
  })

  const recognitionRef = useRef<any | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setState((prev) => ({ ...prev, isSupported: true }))
      recognitionRef.current = new SpeechRecognition()
    } else {
      setState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Speech recognition not supported in this browser",
      }))
    }
  }, [])

  // Configure recognition
  useEffect(() => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setState((prev) => ({ ...prev, isListening: true, error: null }))
      onStart?.()
    }

    recognition.onresult = (event) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setState((prev) => ({
        ...prev,
        transcript: prev.transcript + finalTranscript,
        interimTranscript,
      }))

      if (finalTranscript) {
        onResult?.(finalTranscript, true)
      } else if (interimTranscript) {
        onResult?.(interimTranscript, false)
      }

      // Auto-stop after silence
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        if (recognition && state.isListening) {
          recognition.stop()
        }
      }, 3000)
    }

    recognition.onerror = (event) => {
      const errorMessage = `Speech recognition error: ${event.error}`
      setState((prev) => ({ ...prev, error: errorMessage, isListening: false }))
      onError?.(errorMessage)
    }

    recognition.onend = () => {
      setState((prev) => ({ ...prev, isListening: false, interimTranscript: "" }))
      onEnd?.()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [continuous, interimResults, language, onResult, onError, onStart, onEnd, state.isListening])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !state.isSupported) return

    try {
      setState((prev) => ({ ...prev, error: null, transcript: "", interimTranscript: "" }))
      recognitionRef.current.start()
    } catch (error) {
      const errorMessage = "Failed to start speech recognition"
      setState((prev) => ({ ...prev, error: errorMessage }))
      onError?.(errorMessage)
    }
  }, [state.isSupported, onError])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      recognitionRef.current.stop()
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setState((prev) => ({ ...prev, transcript: "", interimTranscript: "" }))
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  }
}
