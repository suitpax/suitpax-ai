"use client"

import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react"

// Types
export interface VoiceCommand {
  phrase: string
  action: () => void
  description?: string
}

export interface VoiceAISettings {
  voiceId: string
  language: "en-US" | "es-ES" | "fr-FR" | "de-DE"
  volume: number
  stability: number
  similarityBoost: number
  autoDetectLanguage: boolean
}

export interface VoiceAIState {
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  transcript: string
  detectedLanguage: string
  permissionGranted: boolean
  error: string | null
}

interface VoiceAIContextType {
  state: VoiceAIState
  settings: VoiceAISettings
  startListening: () => Promise<void>
  stopListening: () => void
  speak: (text: string) => Promise<void>
  cancelSpeech: () => void
  updateSettings: (newSettings: Partial<VoiceAISettings>) => void
  setVoice: (voiceId: string) => void
  setLanguage: (language: VoiceAISettings["language"]) => void
  clearTranscript: () => void
}

// Actions
type VoiceAIAction =
  | { type: "SET_LISTENING"; payload: boolean }
  | { type: "SET_SPEAKING"; payload: boolean }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_TRANSCRIPT"; payload: string }
  | { type: "SET_DETECTED_LANGUAGE"; payload: string }
  | { type: "SET_PERMISSION"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_TRANSCRIPT" }

// Initial state
const initialState: VoiceAIState = {
  isListening: false,
  isSpeaking: false,
  isProcessing: false,
  transcript: "",
  detectedLanguage: "es-ES",
  permissionGranted: false,
  error: null,
}

const initialSettings: VoiceAISettings = {
  voiceId: "pNInz6obpgDQGcFmaJgB", // Emma voice
  language: "es-ES",
  volume: 0.8,
  stability: 0.5,
  similarityBoost: 0.5,
  autoDetectLanguage: true,
}

// Reducer
function voiceAIReducer(state: VoiceAIState, action: VoiceAIAction): VoiceAIState {
  switch (action.type) {
    case "SET_LISTENING":
      return { ...state, isListening: action.payload }
    case "SET_SPEAKING":
      return { ...state, isSpeaking: action.payload }
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload }
    case "SET_TRANSCRIPT":
      return { ...state, transcript: action.payload }
    case "SET_DETECTED_LANGUAGE":
      return { ...state, detectedLanguage: action.payload }
    case "SET_PERMISSION":
      return { ...state, permissionGranted: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "CLEAR_TRANSCRIPT":
      return { ...state, transcript: "" }
    default:
      return state
  }
}

// Context
const VoiceAIContext = createContext<VoiceAIContextType | undefined>(undefined)

// Provider Props
interface VoiceAIProviderProps {
  children: React.ReactNode
  initialVoiceId?: string
  initialLanguage?: VoiceAISettings["language"]
  enableLogging?: boolean
  commands?: VoiceCommand[]
}

// Provider
export function VoiceAIProvider({
  children,
  initialVoiceId,
  initialLanguage,
  enableLogging = false,
  commands = [],
}: VoiceAIProviderProps) {
  const [state, dispatch] = useReducer(voiceAIReducer, initialState)
  const [settings, setSettings] = React.useState<VoiceAISettings>({
    ...initialSettings,
    voiceId: initialVoiceId || initialSettings.voiceId,
    language: initialLanguage || initialSettings.language,
  })

  // Speech Recognition
  const recognition = React.useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognition.current = new SpeechRecognition()

      if (recognition.current) {
        recognition.current.continuous = true
        recognition.current.interimResults = true
        recognition.current.lang = settings.language

        recognition.current.onstart = () => {
          dispatch({ type: "SET_LISTENING", payload: true })
          dispatch({ type: "SET_ERROR", payload: null })
          if (enableLogging) console.log("Speech recognition started")
        }

        recognition.current.onresult = (event: any) => {
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            }
          }

          if (finalTranscript) {
            dispatch({ type: "SET_TRANSCRIPT", payload: finalTranscript })

            // Check for commands
            const matchedCommand = commands.find((cmd) =>
              finalTranscript.toLowerCase().includes(cmd.phrase.toLowerCase()),
            )

            if (matchedCommand) {
              matchedCommand.action()
              if (enableLogging) console.log("Command executed:", matchedCommand.phrase)
            }
          }
        }

        recognition.current.onerror = (event: any) => {
          dispatch({ type: "SET_ERROR", payload: `Error de reconocimiento: ${event.error}` })
          dispatch({ type: "SET_LISTENING", payload: false })
          if (enableLogging) console.error("Speech recognition error:", event.error)
        }

        recognition.current.onend = () => {
          dispatch({ type: "SET_LISTENING", payload: false })
          if (enableLogging) console.log("Speech recognition ended")
        }
      }
    }

    // Check microphone permission
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          dispatch({ type: "SET_PERMISSION", payload: true })
        })
        .catch(() => {
          dispatch({ type: "SET_PERMISSION", payload: false })
          dispatch({ type: "SET_ERROR", payload: "Permisos de micrófono requeridos" })
        })
    }
  }, [settings.language, commands, enableLogging])

  // Start listening
  const startListening = useCallback(async () => {
    if (!recognition.current || !state.permissionGranted) {
      dispatch({ type: "SET_ERROR", payload: "Reconocimiento de voz no disponible" })
      return
    }

    try {
      dispatch({ type: "SET_PROCESSING", payload: true })
      recognition.current.start()
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error al iniciar reconocimiento" })
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false })
    }
  }, [state.permissionGranted])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition.current) {
      recognition.current.stop()
    }
  }, [])

  // Speak text
  const speak = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      try {
        dispatch({ type: "SET_PROCESSING", payload: true })
        dispatch({ type: "SET_SPEAKING", payload: true })

        // Use ElevenLabs API for better voice quality
        const response = await fetch("/api/elevenlabs/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voiceId: settings.voiceId,
            language: settings.language,
          }),
        })

        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audio.volume = settings.volume

          audio.onended = () => {
            dispatch({ type: "SET_SPEAKING", payload: false })
            URL.revokeObjectURL(audioUrl)
          }

          audio.onerror = () => {
            dispatch({ type: "SET_ERROR", payload: "Error al reproducir audio" })
            dispatch({ type: "SET_SPEAKING", payload: false })
          }

          await audio.play()
        } else {
          // Fallback to browser speech synthesis
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = settings.language
          utterance.volume = settings.volume

          utterance.onend = () => {
            dispatch({ type: "SET_SPEAKING", payload: false })
          }

          utterance.onerror = () => {
            dispatch({ type: "SET_ERROR", payload: "Error en síntesis de voz" })
            dispatch({ type: "SET_SPEAKING", payload: false })
          }

          if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.speak(utterance)
          }
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Error al generar voz" })
        dispatch({ type: "SET_SPEAKING", payload: false })
      } finally {
        dispatch({ type: "SET_PROCESSING", payload: false })
      }
    },
    [settings],
  )

  // Cancel speech
  const cancelSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    dispatch({ type: "SET_SPEAKING", payload: false })
  }, [])

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<VoiceAISettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  // Set voice
  const setVoice = useCallback((voiceId: string) => {
    setSettings((prev) => ({ ...prev, voiceId }))
  }, [])

  // Set language
  const setLanguage = useCallback((language: VoiceAISettings["language"]) => {
    setSettings((prev) => ({ ...prev, language }))
    if (recognition.current) {
      recognition.current.lang = language
    }
  }, [])

  // Clear transcript
  const clearTranscript = useCallback(() => {
    dispatch({ type: "CLEAR_TRANSCRIPT" })
  }, [])

  const contextValue: VoiceAIContextType = {
    state,
    settings,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    updateSettings,
    setVoice,
    setLanguage,
    clearTranscript,
  }

  return <VoiceAIContext.Provider value={contextValue}>{children}</VoiceAIContext.Provider>
}

// Hook
export function useVoiceAI() {
  const context = useContext(VoiceAIContext)
  if (context === undefined) {
    throw new Error("useVoiceAI must be used within a VoiceAIProvider")
  }
  return context
}
