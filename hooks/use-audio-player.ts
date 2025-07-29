"use client"

import { useState, useRef, useCallback } from "react"

interface AudioState {
  isPlaying: boolean
  isPaused: boolean
  duration: number
  currentTime: number
  volume: number
}

export function useAudioPlayer() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sourceRef = useRef<string | null>(null)

  const playAudio = useCallback(async (audioBuffer: ArrayBuffer) => {
    try {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      // Create blob URL from buffer
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" })
      const audioUrl = URL.createObjectURL(blob)

      // Clean up previous URL
      if (sourceRef.current) {
        URL.revokeObjectURL(sourceRef.current)
      }
      sourceRef.current = audioUrl

      // Create and configure audio element
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onloadedmetadata = () => {
        setAudioState((prev) => ({ ...prev, duration: audio.duration }))
      }

      audio.ontimeupdate = () => {
        setAudioState((prev) => ({ ...prev, currentTime: audio.currentTime }))
      }

      audio.onplay = () => {
        setAudioState((prev) => ({ ...prev, isPlaying: true, isPaused: false }))
      }

      audio.onpause = () => {
        setAudioState((prev) => ({ ...prev, isPlaying: false, isPaused: true }))
      }

      audio.onended = () => {
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
        }))
        URL.revokeObjectURL(audioUrl)
        sourceRef.current = null
      }

      audio.onerror = () => {
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
        }))
        URL.revokeObjectURL(audioUrl)
        sourceRef.current = null
      }

      await audio.play()
    } catch (error) {
      console.error("Error playing audio:", error)
      setAudioState((prev) => ({ ...prev, isPlaying: false, isPaused: false }))
    }
  }, [])

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const resumeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (sourceRef.current) {
      URL.revokeObjectURL(sourceRef.current)
      sourceRef.current = null
    }
    setAudioState({
      isPlaying: false,
      isPaused: false,
      duration: 0,
      currentTime: 0,
      volume: 1,
    })
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
      setAudioState((prev) => ({ ...prev, volume }))
    }
  }, [])

  return {
    audioState,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    setVolume,
  }
}
