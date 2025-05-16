"use client"

import { useState, useEffect, useCallback } from "react"
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { detectLanguage } from "@/lib/language-detection"

interface UseSpeechToTextProps {
  onTranscriptChange?: (transcript: string) => void
  onEnd?: (transcript: string, detectedLanguage?: string) => void
  continuous?: boolean
  language?: string
  autoDetectLanguage?: boolean
}

export function useSpeechToText({
  onTranscriptChange,
  onEnd,
  continuous = true,
  language = "en-US",
  autoDetectLanguage = true,
}: UseSpeechToTextProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectedLanguage, setDetectedLanguage] = useState<string>(language)
  const [interimTranscript, setInterimTranscript] = useState<string>("")

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable } =
    useSpeechRecognition({
      transcribing: true,
      clearTranscriptOnListen: true,
      commands: [],
    })

  // Efecto para detectar el idioma en tiempo real
  useEffect(() => {
    if (autoDetectLanguage && transcript && transcript.length > 10) {
      const detected = detectLanguage(transcript)
      if (detected.confidence > 0.6 && detected.speechCode !== detectedLanguage) {
        console.log(
          `Detected language: ${detected.name} (${detected.speechCode}) with confidence ${detected.confidence}`,
        )
        setDetectedLanguage(detected.speechCode)

        // Reiniciar reconocimiento con el nuevo idioma
        if (isListening) {
          SpeechRecognition.stopListening()
          setTimeout(() => {
            SpeechRecognition.startListening({ continuous, language: detected.speechCode })
          }, 300)
        }
      }
    }
  }, [transcript, autoDetectLanguage, detectedLanguage, continuous, isListening])

  useEffect(() => {
    if (onTranscriptChange && transcript) {
      onTranscriptChange(transcript)
    }
    setInterimTranscript(transcript)
  }, [transcript, onTranscriptChange])

  useEffect(() => {
    setIsListening(listening)
  }, [listening])

  const startListening = useCallback(
    async (customLanguage?: string) => {
      if (!browserSupportsSpeechRecognition) {
        setError("Your browser does not support speech recognition.")
        return
      }

      if (!isMicrophoneAvailable) {
        setError("Microphone access is not available. Please allow microphone access.")
        return
      }

      try {
        resetTranscript()
        const langToUse = customLanguage || detectedLanguage || language
        await SpeechRecognition.startListening({ continuous, language: langToUse })
        setError(null)
      } catch (err) {
        setError("Error starting speech recognition")
        console.error("Speech recognition error:", err)
      }
    },
    [browserSupportsSpeechRecognition, continuous, isMicrophoneAvailable, language, resetTranscript, detectedLanguage],
  )

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening()
    if (onEnd && transcript) {
      onEnd(transcript, detectedLanguage)
    }
  }, [onEnd, transcript, detectedLanguage])

  const abortListening = useCallback(() => {
    SpeechRecognition.abortListening()
    resetTranscript()
  }, [resetTranscript])

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
    error,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    detectedLanguage,
  }
}
