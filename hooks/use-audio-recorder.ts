"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseAudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void
}

interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlob: Blob | null
  audioUrl: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
}

export function useAudioRecorder({ onRecordingComplete }: UseAudioRecorderProps = {}): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Limpiar recursos cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [isRecording, audioUrl])

  const startRecording = useCallback(async () => {
    try {
      // Reiniciar estado
      setError(null)
      audioChunksRef.current = []

      // Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Crear el MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      })

      mediaRecorderRef.current = mediaRecorder

      // Configurar eventos
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Crear blob de audio
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(audioBlob)

        // Crear URL para reproducción
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        // Detener todas las pistas de audio
        stream.getTracks().forEach((track) => track.stop())

        // Llamar al callback si existe
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }
      }

      // Iniciar grabación
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error al iniciar la grabación:", err)
      setError("No se pudo acceder al micrófono. Verifica los permisos.")
    }
  }, [onRecordingComplete])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  return {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    error,
  }
}
