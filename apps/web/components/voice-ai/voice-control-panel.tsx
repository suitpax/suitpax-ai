"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useVoiceAI } from "@/contexts/voice-ai-context"
import { MdMic, MdMicOff, MdVolumeUp, MdVolumeOff, MdSettings, MdError, MdWarning } from "react-icons/md"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceControlPanelProps {
  className?: string
}

const ELEVENLABS_VOICES = {
  EMMA: "pNInz6obpgDQGcFmaJgB",
  SOPHIA: "TxGEqnHWrfWFTfGW9XjX",
  MICHAEL: "VR6AewLTigWG4xSOukaG",
}

export default function VoiceControlPanel({ className = "" }: VoiceControlPanelProps) {
  const {
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
  } = useVoiceAI()

  const [showSettings, setShowSettings] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<{ id: string; name: string }[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [warningMessage, setWarningMessage] = useState<string | null>(null)

  // Cargar voces disponibles con manejo de errores
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const response = await fetch("/api/elevenlabs/voices")
        if (response.ok) {
          const data = await response.json()
          setAvailableVoices(data.voices || [])
        } else {
          console.warn("No se pudieron cargar las voces de ElevenLabs")
          // Usar voces por defecto
          setAvailableVoices([
            { id: ELEVENLABS_VOICES.EMMA, name: "Emma" },
            { id: ELEVENLABS_VOICES.SOPHIA, name: "Sophia" },
            { id: ELEVENLABS_VOICES.MICHAEL, name: "Michael" },
          ])
        }
      } catch (error) {
        console.error("Error loading voices:", error)
        setErrorMessage("No se pudieron cargar las voces disponibles")
        // Usar voces por defecto
        setAvailableVoices([
          { id: ELEVENLABS_VOICES.EMMA, name: "Emma" },
          { id: ELEVENLABS_VOICES.SOPHIA, name: "Sophia" },
          { id: ELEVENLABS_VOICES.MICHAEL, name: "Michael" },
        ])
      }
    }

    loadVoices()
  }, [])

  // Manejar errores del estado de voz
  useEffect(() => {
    if (state.error) {
      setErrorMessage(state.error)
      // Limpiar error después de 5 segundos
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.error])

  // Verificar permisos y mostrar advertencias
  useEffect(() => {
    if (!state.permissionGranted && typeof navigator !== "undefined") {
      setWarningMessage("Se requieren permisos de micrófono para usar el reconocimiento de voz")
    } else {
      setWarningMessage(null)
    }
  }, [state.permissionGranted])

  // Manejar cambio de idioma
  const handleLanguageChange = (language: string) => {
    try {
      setLanguage(language as any)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage("Error al cambiar idioma")
    }
  }

  // Manejar cambio de voz
  const handleVoiceChange = (voiceId: string) => {
    try {
      setVoice(voiceId)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage("Error al cambiar voz")
    }
  }

  // Manejar cambio de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const volume = Number.parseFloat(e.target.value)
      if (volume >= 0 && volume <= 1) {
        updateSettings({ volume })
        setErrorMessage(null)
      }
    } catch (error) {
      setErrorMessage("Error al ajustar volumen")
    }
  }

  // Manejar cambio de estabilidad
  const handleStabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const stability = Number.parseFloat(e.target.value)
      if (stability >= 0 && stability <= 1) {
        updateSettings({ stability })
        setErrorMessage(null)
      }
    } catch (error) {
      setErrorMessage("Error al ajustar estabilidad")
    }
  }

  // Manejar cambio de similitud
  const handleSimilarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const similarityBoost = Number.parseFloat(e.target.value)
      if (similarityBoost >= 0 && similarityBoost <= 1) {
        updateSettings({ similarityBoost })
        setErrorMessage(null)
      }
    } catch (error) {
      setErrorMessage("Error al ajustar similitud")
    }
  }

  // Manejar cambio de detección automática de idioma
  const handleAutoDetectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      updateSettings({ autoDetectLanguage: e.target.checked })
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage("Error al cambiar configuración de detección automática")
    }
  }

  // Manejar clic en el botón de micrófono
  const handleMicrophoneClick = async () => {
    try {
      if (state.isListening) {
        stopListening()
      } else {
        await startListening()
      }
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage("Error al controlar el micrófono")
    }
  }

  // Manejar clic en el botón de hablar
  const handleSpeakClick = async () => {
    try {
      if (state.isSpeaking) {
        cancelSpeech()
      } else {
        // Ejemplo de texto para hablar
        await speak("Hola, soy tu asistente de viaje. ¿En qué puedo ayudarte hoy?")
      }
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage("Error al controlar la síntesis de voz")
    }
  }

  // Limpiar transcripción con manejo de errores
  const handleClearTranscript = () => {
    try {
      clearTranscript()
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage("Error al limpiar transcripción")
    }
  }

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Control de Voz AI</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <MdSettings className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Mensajes de error y advertencia */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
          >
            <MdError className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-700">Error</p>
              <p className="text-xs text-red-600">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-600">
              ×
            </button>
          </motion.div>
        )}

        {warningMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2"
          >
            <MdWarning className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-700">Advertencia</p>
              <p className="text-xs text-yellow-600">{warningMessage}</p>
            </div>
            <button onClick={() => setWarningMessage(null)} className="ml-auto text-yellow-400 hover:text-yellow-600">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estado actual */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Estado:</span>
          <div className="flex items-center space-x-1">
            {state.isListening && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Escuchando
              </span>
            )}
            {state.isSpeaking && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Hablando
              </span>
            )}
            {state.isProcessing && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                Procesando
              </span>
            )}
            {!state.isListening && !state.isSpeaking && !state.isProcessing && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                Inactivo
              </span>
            )}
          </div>
        </div>

        <div className="mb-2">
          <span className="text-xs font-medium">Idioma detectado:</span>
          <span className="ml-2 text-xs">
            {state.detectedLanguage === "en-US"
              ? "Inglés"
              : state.detectedLanguage === "es-ES"
                ? "Español"
                : state.detectedLanguage === "fr-FR"
                  ? "Francés"
                  : state.detectedLanguage === "de-DE"
                    ? "Alemán"
                    : "Desconocido"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Permisos:</span>
          <span className={`text-xs ${state.permissionGranted ? "text-green-600" : "text-red-600"}`}>
            {state.permissionGranted ? "Concedidos" : "Denegados"}
          </span>
        </div>
      </div>

      {/* Transcripción */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium">Transcripción:</span>
          <button
            onClick={handleClearTranscript}
            className="text-[10px] text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={!state.transcript}
          >
            Limpiar
          </button>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg min-h-[60px] text-xs">
          {state.transcript || <span className="text-gray-400">No hay transcripción</span>}
        </div>
      </div>

      {/* Controles principales */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleMicrophoneClick}
          className={`p-3 rounded-full ${
            state.isListening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!state.permissionGranted || state.isProcessing}
          title={
            !state.permissionGranted
              ? "Permisos de micrófono requeridos"
              : state.isListening
                ? "Detener escucha"
                : "Iniciar escucha"
          }
        >
          {state.isListening ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
        </button>

        <button
          onClick={handleSpeakClick}
          className={`p-3 rounded-full ${
            state.isSpeaking ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={state.isProcessing}
          title={state.isSpeaking ? "Detener voz" : "Hablar"}
        >
          {state.isSpeaking ? <MdVolumeOff className="h-5 w-5" /> : <MdVolumeUp className="h-5 w-5" />}
        </button>
      </div>

      {/* Panel de configuración */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-medium mb-3">Configuración</h4>

              {/* Selección de idioma */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Idioma:</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={settings.autoDetectLanguage}
                  className="w-full text-xs p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="en-US">Inglés</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Francés</option>
                  <option value="de-DE">Alemán</option>
                </select>
              </div>

              {/* Detección automática de idioma */}
              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="autoDetect"
                  checked={settings.autoDetectLanguage}
                  onChange={handleAutoDetectChange}
                  className="mr-2"
                />
                <label htmlFor="autoDetect" className="text-xs">
                  Detección automática de idioma
                </label>
              </div>

              {/* Selección de voz */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Voz:</label>
                <select
                  value={settings.voiceId}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded-md bg-white"
                >
                  {availableVoices.length > 0 ? (
                    availableVoices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value={ELEVENLABS_VOICES.EMMA}>Emma</option>
                      <option value={ELEVENLABS_VOICES.SOPHIA}>Sophia</option>
                      <option value={ELEVENLABS_VOICES.MICHAEL}>Michael</option>
                    </>
                  )}
                </select>
              </div>

              {/* Control de volumen */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Volumen: {Math.round(settings.volume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={handleVolumeChange}
                  className="w-full"
                />
              </div>

              {/* Control de estabilidad */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">
                  Estabilidad: {Math.round(settings.stability * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.stability}
                  onChange={handleStabilityChange}
                  className="w-full"
                />
              </div>

              {/* Control de similitud */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">
                  Similitud: {Math.round(settings.similarityBoost * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.similarityBoost}
                  onChange={handleSimilarityChange}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
