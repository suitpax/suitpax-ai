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

interface SpeechRecognitionError {
  type: "permission" | "network" | "not-supported" | "no-speech" | "aborted" | "audio-capture" | "unknown"
  message: string
}

export function useSpeechToText({
  onTranscriptChange,
  onEnd,
  continuous = true,
  language = "en-US",
  autoDetectLanguage = true,
}: UseSpeechToTextProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<SpeechRecognitionError | null>(null)
  const [detectedLanguage, setDetectedLanguage] = useState<string>(language)
  const [interimTranscript, setInterimTranscript] = useState<string>("")
  const [isSupported, setIsSupported] = useState<boolean>(false)
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown")

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable } =
    useSpeechRecognition({
      transcribing: true,
      clearTranscriptOnListen: true,
      commands: [],
    })

  // Verificar soporte del navegador al montar
  useEffect(() => {
    const checkSupport = () => {
      if (typeof window === "undefined") {
        setIsSupported(false)
        setError({
          type: "not-supported",
          message: "Speech recognition no está disponible en el servidor",
        })
        return
      }

      if (!browserSupportsSpeechRecognition) {
        setIsSupported(false)
        setError({
          type: "not-supported",
          message: "Tu navegador no soporta reconocimiento de voz. Intenta con Chrome, Edge o Safari.",
        })
        return
      }

      setIsSupported(true)
      setError(null)
    }

    checkSupport()
  }, [browserSupportsSpeechRecognition])

  // Verificar permisos de micrófono
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      if (typeof navigator === "undefined" || !navigator.permissions) {
        setPermissionStatus("unknown")
        return
      }

      try {
        const permission = await navigator.permissions.query({ name: "microphone" as PermissionName })
        setPermissionStatus(permission.state as any)

        permission.onchange = () => {
          setPermissionStatus(permission.state as any)
        }
      } catch (err) {
        console.warn("No se pudo verificar permisos de micrófono:", err)
        setPermissionStatus("unknown")
      }
    }

    if (isSupported) {
      checkMicrophonePermission()
    }
  }, [isSupported])

  // Efecto para detectar el idioma en tiempo real
  useEffect(() => {
    if (autoDetectLanguage && transcript && transcript.length > 10) {
      try {
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
      } catch (err) {
        console.warn("Error detectando idioma:", err)
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

  const handleSpeechRecognitionError = useCallback((event: any) => {
    console.error("Speech recognition error:", event)

    let errorInfo: SpeechRecognitionError

    switch (event.error) {
      case "not-allowed":
      case "service-not-allowed":
        errorInfo = {
          type: "permission",
          message:
            "Acceso al micrófono denegado. Por favor, permite el acceso al micrófono en la configuración del navegador.",
        }
        break
      case "network":
        errorInfo = {
          type: "network",
          message: "Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.",
        }
        break
      case "no-speech":
        errorInfo = {
          type: "no-speech",
          message: "No se detectó voz. Asegúrate de hablar claramente cerca del micrófono.",
        }
        break
      case "aborted":
        errorInfo = {
          type: "aborted",
          message: "Reconocimiento de voz cancelado.",
        }
        break
      case "audio-capture":
        errorInfo = {
          type: "audio-capture",
          message: "No se pudo capturar audio. Verifica que tu micrófono esté funcionando correctamente.",
        }
        break
      default:
        errorInfo = {
          type: "unknown",
          message: `Error desconocido: ${event.error}. Inténtalo de nuevo.`,
        }
    }

    setError(errorInfo)
    setIsListening(false)
  }, [])

  const startListening = useCallback(
    async (customLanguage?: string) => {
      // Verificar soporte
      if (!isSupported) {
        setError({
          type: "not-supported",
          message: "El reconocimiento de voz no está soportado en este navegador.",
        })
        return
      }

      // Verificar disponibilidad del micrófono
      if (!isMicrophoneAvailable) {
        setError({
          type: "permission",
          message: "Micrófono no disponible. Verifica los permisos y que no esté siendo usado por otra aplicación.",
        })
        return
      }

      // Verificar permisos
      if (permissionStatus === "denied") {
        setError({
          type: "permission",
          message: "Permisos de micrófono denegados. Habilita el micrófono en la configuración del navegador.",
        })
        return
      }

      try {
        // Limpiar errores previos
        setError(null)
        resetTranscript()

        const langToUse = customLanguage || detectedLanguage || language

        // Configurar manejo de errores
        if (SpeechRecognition.getRecognition()) {
          SpeechRecognition.getRecognition().onerror = handleSpeechRecognitionError
        }

        await SpeechRecognition.startListening({
          continuous,
          language: langToUse,
          interimResults: true,
        })
      } catch (err) {
        console.error("Error starting speech recognition:", err)
        setError({
          type: "unknown",
          message: "Error al iniciar el reconocimiento de voz. Inténtalo de nuevo.",
        })
      }
    },
    [
      isSupported,
      isMicrophoneAvailable,
      permissionStatus,
      continuous,
      language,
      resetTranscript,
      detectedLanguage,
      handleSpeechRecognitionError,
    ],
  )

  const stopListening = useCallback(() => {
    try {
      if (SpeechRecognition.getRecognition() && isListening) {
        SpeechRecognition.stopListening()

        if (onEnd && transcript) {
          onEnd(transcript, detectedLanguage)
        }
      }
    } catch (err) {
      console.error("Error stopping speech recognition:", err)
      setError({
        type: "unknown",
        message: "Error al detener el reconocimiento de voz.",
      })
    }
  }, [isListening, onEnd, transcript, detectedLanguage])

  const abortListening = useCallback(() => {
    try {
      if (SpeechRecognition.getRecognition()) {
        SpeechRecognition.abortListening()
        resetTranscript()
        setError(null)
      }
    } catch (err) {
      console.error("Error aborting speech recognition:", err)
    }
  }, [resetTranscript])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Liberar el stream inmediatamente
      stream.getTracks().forEach((track) => track.stop())
      setPermissionStatus("granted")
      setError(null)
      return true
    } catch (err) {
      console.error("Error requesting microphone permission:", err)
      setPermissionStatus("denied")
      setError({
        type: "permission",
        message: "No se pudo obtener acceso al micrófono. Verifica los permisos del navegador.",
      })
      return false
    }
  }, [])

  return {
    // Estado
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    permissionStatus,
    detectedLanguage,

    // Métodos
    startListening,
    stopListening,
    abortListening,
    resetTranscript,
    clearError,
    requestMicrophonePermission,

    // Información del navegador
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  }
}
