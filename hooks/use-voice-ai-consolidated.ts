"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useSpeechToText } from "./use-speech-recognition"
import { useAudioPlayer } from "./use-audio-player"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  audioUrl?: string
  language?: string
}

interface VoiceAIOptions {
  agentId: string
  onMessage?: (message: Message) => void
  onError?: (error: string) => void
  onStatusChange?: (status: "idle" | "listening" | "processing" | "speaking") => void
}

export function useVoiceAIConsolidated({ agentId, onMessage, onError, onStatusChange }: VoiceAIOptions) {
  // Estados
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle")

  // Referencias
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  // Hooks
  const { audioState, playAudio, pauseAudio, stopAudio } = useAudioPlayer()
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
    browserSupportsSpeechRecognition,
    detectedLanguage,
  } = useSpeechToText({
    continuous: false,
    autoDetectLanguage: true,
    onEnd: handleSpeechEnd,
  })

  // Efectos
  useEffect(() => {
    audioPlayerRef.current = new Audio()
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const newStatus = isListening
      ? "listening"
      : isProcessing
        ? "processing"
        : audioState.isPlaying
          ? "speaking"
          : "idle"

    setStatus(newStatus)
    onStatusChange?.(newStatus)
  }, [isListening, isProcessing, audioState.isPlaying, onStatusChange])

  // Manejadores
  async function handleSpeechEnd(finalTranscript: string, detectedLang?: string) {
    if (finalTranscript.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: finalTranscript,
        timestamp: new Date(),
        language: detectedLang,
      }

      addMessage(userMessage)
      await processUserMessage(finalTranscript, userMessage.id, detectedLang)
      resetTranscript()
    }
  }

  const addMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message])
      onMessage?.(message)
    },
    [onMessage],
  )

  async function processUserMessage(userText: string, messageId: string, detectedLang?: string) {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/voice-ai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          agentId,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response")
      }

      const { response: aiResponse } = await response.json()

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        language: detectedLang || "en-US",
      }

      addMessage(assistantMessage)
      await generateAndPlaySpeech(aiResponse, assistantMessage.id)
    } catch (error) {
      console.error("Error processing message:", error)
      onError?.(error instanceof Error ? error.message : "Unknown error")

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      }

      addMessage(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  async function generateAndPlaySpeech(text: string, messageId: string) {
    try {
      const response = await fetch("/api/elevenlabs/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId: getVoiceIdForAgent(agentId),
          language: detectedLanguage || "en-US",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Actualizar mensaje con URL de audio
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, audioUrl } : msg)))

      // Reproducir automáticamente
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl
        await audioPlayerRef.current.play()
      }
    } catch (error) {
      console.error("Error generating speech:", error)
      onError?.("Failed to generate speech")
    }
  }

  function getVoiceIdForAgent(agentId: string): string {
    const voiceMap: Record<string, string> = {
      emma: "EXAVITQu4vr4xnSDxMaL", // Sarah
      marcus: "VR6AewLTigWG4xSOukaG", // Josh
      sophia: "21m00Tcm4TlvDq8ikWAM", // Rachel
      alex: "29vD33N1CtxCmqQRPOHJ", // Drew
    }
    return voiceMap[agentId] || voiceMap.emma
  }

  const startConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/voice-ai/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          isWelcome: true,
        }),
      })

      if (response.ok) {
        const { response: welcomeText } = await response.json()

        const welcomeMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: welcomeText,
          timestamp: new Date(),
        }

        addMessage(welcomeMessage)
        await generateAndPlaySpeech(welcomeText, welcomeMessage.id)
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
      onError?.("Failed to start conversation")
    }
  }, [agentId, addMessage])

  const clearConversation = useCallback(() => {
    setMessages([])
    stopAudio()
    stopListening()
    resetTranscript()
  }, [stopAudio, stopListening, resetTranscript])

  const playMessage = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (message?.audioUrl && audioPlayerRef.current) {
        audioPlayerRef.current.src = message.audioUrl
        audioPlayerRef.current.play()
      }
    },
    [messages],
  )

  return {
    // Estado
    messages,
    status,
    isProcessing,
    transcript,
    detectedLanguage,
    audioState,
    error: speechError,
    browserSupportsSpeechRecognition,

    // Acciones
    startListening,
    stopListening,
    startConversation,
    clearConversation,
    playMessage,
    pauseAudio,
    stopAudio,

    // Referencias
    audioPlayerRef,
  }
}
