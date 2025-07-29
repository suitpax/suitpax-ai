"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface SpeechToTextOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

interface SpeechToTextResult {
  transcript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  detectedLanguage: { language: string; speechCode: string; confidence: number }
}

export function useSpeechToText(options: SpeechToTextOptions = {}): SpeechToTextResult {
  const { language = "es-ES", continuous = false, interimResults = true } = options

  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [detectedLanguage, setDetectedLanguage] = useState({ language: "English", speechCode: "en-US", confidence: 0 })

  // Check if speech recognition is supported
  const isSupported =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    const recognition = recognitionRef.current
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
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

      const newTranscript = finalTranscript || interimTranscript
      setTranscript(newTranscript)
      setDetectedLanguage(detectLanguage(newTranscript))
    }

    recognition.onerror = (event) => {
      setError(`Error de reconocimiento de voz: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [language, continuous, interimResults, isSupported])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("El reconocimiento de voz no está soportado en este navegador")
      return
    }

    if (recognitionRef.current && !isListening) {
      setError(null)
      recognitionRef.current.start()
    }
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setError(null)
    setDetectedLanguage({ language: "English", speechCode: "en-US", confidence: 0 })
  }, [])

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    detectedLanguage,
  }
}

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

// Simple language detection utility
function detectLanguage(text: string): { language: string; speechCode: string; confidence: number } {
  const spanishWords = [
    "el",
    "la",
    "de",
    "que",
    "y",
    "a",
    "en",
    "un",
    "es",
    "se",
    "no",
    "te",
    "lo",
    "le",
    "da",
    "su",
    "por",
    "son",
    "con",
    "para",
    "al",
    "una",
    "su",
    "del",
    "las",
    "los",
  ]
  const englishWords = [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "i",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let spanishCount = 0
  let englishCount = 0

  words.forEach((word) => {
    if (spanishWords.includes(word)) spanishCount++
    if (englishWords.includes(word)) englishCount++
  })

  const total = spanishCount + englishCount
  if (total === 0) {
    return { language: "English", speechCode: "en-US", confidence: 0 }
  }

  if (spanishCount > englishCount) {
    return {
      language: "Spanish",
      speechCode: "es-ES",
      confidence: spanishCount / total,
    }
  } else {
    return {
      language: "English",
      speechCode: "en-US",
      confidence: englishCount / total,
    }
  }
}
