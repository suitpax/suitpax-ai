"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useVoiceAI } from "@/contexts/voice-ai-context"
import { MdMic, MdMicOff, MdVolumeUp, MdVolumeOff, MdSettings } from "react-icons/md"
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

  // Cargar voces disponibles
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const response = await fetch("/api/elevenlabs/voices")
        if (response.ok) {
          const data = await response.json()
          setAvailableVoices(data.voices || [])
        }
      } catch (error) {
        console.error("Error loading voices:", error)
      }
    }

    loadVoices()
  }, [])

  // Manejar cambio de idioma
  const handleLanguageChange = (language: string) => {
    setLanguage(language as any)
  }

  // Manejar cambio de voz
  const handleVoiceChange = (voiceId: string) => {
    setVoice(voiceId)
  }

  // Manejar cambio de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ volume: Number.parseFloat(e.target.value) })
  }

  // Manejar cambio de estabilidad
  const handleStabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ stability: Number.parseFloat(e.target.value) })
  }

  // Manejar cambio de similitud
  const handleSimilarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ similarityBoost: Number.parseFloat(e.target.value) })
  }

  // Manejar cambio de detección automática de idioma
  const handleAutoDetectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ autoDetectLanguage: e.target.checked })
  }

  // Manejar clic en el botón de micrófono
  const handleMicrophoneClick = async () => {
    if (state.isListening) {
      stopListening()
    } else {
      await startListening()
    }
  }

  // Manejar clic en el botón de hablar
  const handleSpeakClick = async () => {
    if (state.isSpeaking) {
      cancelSpeech()
    } else {
      // Ejemplo de texto para hablar
      await speak("Hola, soy tu asistente de viaje. ¿En qué puedo ayudarte hoy?")
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

        {state.error && <div className="mt-2 text-xs text-red-500">{state.error}</div>}
      </div>

      {/* Transcripción */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium">Transcripción:</span>
          <button onClick={clearTranscript} className="text-[10px] text-gray-500 hover:text-gray-700">
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
          } transition-colors`}
          disabled={!state.permissionGranted}
          title={state.isListening ? "Detener escucha" : "Iniciar escucha"}
        >
          {state.isListening ? <MdMicOff className="h-5 w-5" /> : <MdMic className="h-5 w-5" />}
        </button>

        <button
          onClick={handleSpeakClick}
          className={`p-3 rounded-full ${
            state.isSpeaking ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
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
                  className="w-full text-xs p-2 border border-gray-300 rounded-md bg-white"
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
