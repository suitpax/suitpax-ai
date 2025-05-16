"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { detectLanguage } from "@/lib/language-detection"
import { ELEVENLABS_VOICES } from "@/lib/elevenlabs"

// Tipos para el contexto
export type VoiceId = string
export type SupportedLanguage = "en-US" | "es-ES" | "fr-FR" | "de-DE" | "auto"

export interface VoiceCommand {
  phrase: string
  action: () => void
  description?: string
}

export interface VoiceSettings {
  voiceId: VoiceId
  stability: number
  similarityBoost: number
  language: SupportedLanguage
  autoDetectLanguage: boolean
  volume: number
}

export interface VoiceState {
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  lastResponse: string
  detectedLanguage: SupportedLanguage
  error: string | null
  permissionGranted: boolean
  isProcessing: boolean
}

export interface VoiceAIContextType {
  // Estado
  state: VoiceState
  settings: VoiceSettings

  // Métodos para control de voz
  startListening: () => Promise<void>
  stopListening: () => void
  speak: (text: string, voiceId?: VoiceId) => Promise<void>
  cancelSpeech: () => void

  // Gestión de comandos
  registerCommand: (command: VoiceCommand) => void
  unregisterCommand: (phrase: string) => void
  executeCommand: (phrase: string) => boolean

  // Configuración
  updateSettings: (newSettings: Partial<VoiceSettings>) => void
  setVoice: (voiceId: VoiceId) => void
  setLanguage: (language: SupportedLanguage) => void

  // Utilidades
  clearTranscript: () => void
  checkPermission: () => Promise<boolean>
  getAvailableVoices: () => Promise<{ id: string; name: string; preview?: string }[]>
}

// Valores por defecto
const defaultSettings: VoiceSettings = {
  voiceId: ELEVENLABS_VOICES.EMMA,
  stability: 0.5,
  similarityBoost: 0.75,
  language: "en-US",
  autoDetectLanguage: true,
  volume: 1.0,
}

const defaultState: VoiceState = {
  isListening: false,
  isSpeaking: false,
  transcript: "",
  lastResponse: "",
  detectedLanguage: "en-US",
  error: null,
  permissionGranted: false,
  isProcessing: false,
}

// Crear el contexto
export const VoiceAIContext = createContext<VoiceAIContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useVoiceAI = (): VoiceAIContextType => {
  const context = useContext(VoiceAIContext)
  if (context === undefined) {
    throw new Error("useVoiceAI debe ser usado dentro de un VoiceAIProvider")
  }
  return context
}

// Props para el proveedor
interface VoiceAIProviderProps {
  children: ReactNode
  apiKey?: string
  initialVoiceId?: VoiceId
  initialLanguage?: SupportedLanguage
  enableLogging?: boolean
  commands?: VoiceCommand[]
}

// Componente proveedor
export const VoiceAIProvider: React.FC<VoiceAIProviderProps> = ({
  children,
  apiKey,
  initialVoiceId,
  initialLanguage,
  enableLogging = false,
  commands = [],
}) => {
  // Estado
  const [settings, setSettings] = useState<VoiceSettings>({
    ...defaultSettings,
    voiceId: initialVoiceId || defaultSettings.voiceId,
    language: initialLanguage || defaultSettings.language,
  })

  const [state, setState] = useState<VoiceState>(defaultState)
  const [registeredCommands, setRegisteredCommands] = useState<VoiceCommand[]>(commands)

  // Referencias para SpeechRecognition y SpeechSynthesis
  const recognitionRef = React.useRef<any>(null)
  const synthRef = React.useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  // Inicializar reconocimiento de voz
  useEffect(() => {
    // Crear elemento de audio para reproducción
    audioRef.current = new Audio()

    // Verificar si el navegador soporta reconocimiento de voz
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        // Configurar eventos
        recognitionRef.current.onstart = () => {
          if (enableLogging) console.log("Voice recognition started")
          setState((prev) => ({ ...prev, isListening: true, error: null }))
        }

        recognitionRef.current.onend = () => {
          if (enableLogging) console.log("Voice recognition ended")
          setState((prev) => ({ ...prev, isListening: false }))
        }

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join("")

          setState((prev) => ({ ...prev, transcript }))

          // Detectar idioma si está habilitado
          if (settings.autoDetectLanguage && transcript.length > 10) {
            const detected = detectLanguage(transcript)
            if (detected.confidence > 0.6) {
              setState((prev) => ({ ...prev, detectedLanguage: detected.speechCode as SupportedLanguage }))

              // Actualizar idioma de reconocimiento si es diferente
              if (recognitionRef.current && detected.speechCode !== recognitionRef.current.lang) {
                const wasListening = state.isListening
                if (wasListening) {
                  stopListening()
                }

                recognitionRef.current.lang = detected.speechCode

                if (wasListening) {
                  setTimeout(() => startListening(), 300)
                }
              }
            }
          }

          // Verificar comandos
          const lastResult = event.results[event.results.length - 1]
          if (lastResult.isFinal) {
            const finalTranscript = lastResult[0].transcript.trim().toLowerCase()
            executeCommand(finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Voice recognition error:", event.error)
          setState((prev) => ({ ...prev, error: event.error }))
        }

        // Verificar permisos iniciales
        checkPermission()
      } else {
        setState((prev) => ({
          ...prev,
          error: "Tu navegador no soporta reconocimiento de voz. Intenta con Chrome o Edge.",
        }))
      }
    }

    return () => {
      // Limpiar recursos
      if (recognitionRef.current) {
        stopListening()
      }

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Actualizar idioma cuando cambie en la configuración
  useEffect(() => {
    if (recognitionRef.current && !settings.autoDetectLanguage) {
      recognitionRef.current.lang = settings.language
    }
  }, [settings.language, settings.autoDetectLanguage])

  // Método para verificar permisos de micrófono
  const checkPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Liberar recursos después de verificar
      stream.getTracks().forEach((track) => track.stop())

      setState((prev) => ({ ...prev, permissionGranted: true }))
      return true
    } catch (error) {
      console.error("Microphone permission error:", error)
      setState((prev) => ({
        ...prev,
        permissionGranted: false,
        error: "No se pudo acceder al micrófono. Verifica los permisos del navegador.",
      }))
      return false
    }
  }

  // Iniciar escucha
  const startListening = async (): Promise<void> => {
    if (!recognitionRef.current) return

    try {
      // Verificar permisos antes de iniciar
      const hasPermission = await checkPermission()
      if (!hasPermission) return

      // Configurar idioma
      recognitionRef.current.lang = settings.autoDetectLanguage ? state.detectedLanguage : settings.language

      // Iniciar reconocimiento
      recognitionRef.current.start()
    } catch (error) {
      console.error("Error starting voice recognition:", error)
      setState((prev) => ({
        ...prev,
        error: "Error al iniciar el reconocimiento de voz. Inténtalo de nuevo.",
      }))
    }
  }

  // Detener escucha
  const stopListening = (): void => {
    if (recognitionRef.current && state.isListening) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping voice recognition:", error)
      }
    }
  }

  // Hablar texto usando ElevenLabs
  const speak = async (text: string, voiceId?: VoiceId): Promise<void> => {
    if (!text) return

    try {
      setState((prev) => ({ ...prev, isSpeaking: true, isProcessing: true }))

      // Usar la API de ElevenLabs para convertir texto a voz
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId: voiceId || settings.voiceId,
          stability: settings.stability,
          similarityBoost: settings.similarityBoost,
          language: settings.autoDetectLanguage ? state.detectedLanguage : settings.language,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Reproducir audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.volume = settings.volume

        audioRef.current.onended = () => {
          setState((prev) => ({ ...prev, isSpeaking: false }))
          URL.revokeObjectURL(audioUrl)
        }

        audioRef.current.onerror = (error) => {
          console.error("Error playing audio:", error)
          setState((prev) => ({
            ...prev,
            isSpeaking: false,
            error: "Error al reproducir audio",
          }))
          URL.revokeObjectURL(audioUrl)
        }

        setState((prev) => ({ ...prev, isProcessing: false, lastResponse: text }))
        await audioRef.current.play()
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error)
      setState((prev) => ({
        ...prev,
        isSpeaking: false,
        isProcessing: false,
        error: "Error al convertir texto a voz",
      }))
    }
  }

  // Cancelar reproducción de voz
  const cancelSpeech = (): void => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState((prev) => ({ ...prev, isSpeaking: false }))
    }
  }

  // Registrar un nuevo comando
  const registerCommand = useCallback((command: VoiceCommand): void => {
    setRegisteredCommands((prev) => {
      // Evitar duplicados
      const exists = prev.some((cmd) => cmd.phrase === command.phrase)
      if (exists) {
        return prev.map((cmd) => (cmd.phrase === command.phrase ? command : cmd))
      }
      return [...prev, command]
    })
  }, [])

  // Eliminar un comando
  const unregisterCommand = useCallback((phrase: string): void => {
    setRegisteredCommands((prev) => prev.filter((cmd) => cmd.phrase !== phrase))
  }, [])

  // Ejecutar un comando si coincide con alguno registrado
  const executeCommand = useCallback(
    (phrase: string): boolean => {
      if (!phrase) return false

      const normalizedPhrase = phrase.toLowerCase().trim()

      // Buscar comando que coincida
      for (const command of registeredCommands) {
        if (normalizedPhrase.includes(command.phrase.toLowerCase())) {
          if (enableLogging) {
            console.log(`Executing command: ${command.phrase}`)
          }
          command.action()
          return true
        }
      }

      return false
    },
    [registeredCommands, enableLogging],
  )

  // Actualizar configuración
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>): void => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  // Cambiar voz
  const setVoice = useCallback((voiceId: VoiceId): void => {
    setSettings((prev) => ({ ...prev, voiceId }))
  }, [])

  // Cambiar idioma
  const setLanguage = useCallback(
    (language: SupportedLanguage): void => {
      setSettings((prev) => ({ ...prev, language }))

      if (!settings.autoDetectLanguage && recognitionRef.current) {
        recognitionRef.current.lang = language
      }
    },
    [settings.autoDetectLanguage],
  )

  // Limpiar transcripción
  const clearTranscript = useCallback((): void => {
    setState((prev) => ({ ...prev, transcript: "" }))
  }, [])

  // Obtener voces disponibles
  const getAvailableVoices = useCallback(async () => {
    try {
      const response = await fetch("/api/elevenlabs/voices", {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error("Error fetching voices:", error)
      return []
    }
  }, [])

  // Valor del contexto
  const contextValue: VoiceAIContextType = {
    state,
    settings,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    registerCommand,
    unregisterCommand,
    executeCommand,
    updateSettings,
    setVoice,
    setLanguage,
    clearTranscript,
    checkPermission,
    getAvailableVoices,
  }

  return <VoiceAIContext.Provider value={contextValue}>{children}</VoiceAIContext.Provider>
}
