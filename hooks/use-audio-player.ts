"use client"

import { useState, useRef, useCallback } from "react"

interface AudioState {
  isPlaying: boolean
  isPaused: boolean
  duration: number
  currentTime: number
  volume: number
}

interface AudioPlayerHook {
  audioState: AudioState
  playAudio: (audioUrl: string) => Promise<void>
  pauseAudio: () => void
  stopAudio: () => void
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
}

export function useAudioPlayer(): AudioPlayerHook {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = useCallback(async (audioUrl: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onloadedmetadata = () => {
        setAudioState((prev) => ({
          ...prev,
          duration: audio.duration,
        }))
      }

      audio.ontimeupdate = () => {
        setAudioState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
        }))
      }

      audio.onplay = () => {
        setAudioState((prev) => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
        }))
      }

      audio.onpause = () => {
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: true,
        }))
      }

      audio.onended = () => {
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
        }))
      }

      await audio.play()
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }, [])

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
      }))
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
      setAudioState((prev) => ({
        ...prev,
        volume,
      }))
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setAudioState((prev) => ({
        ...prev,
        currentTime: time,
      }))
    }
  }, [])

  return {
    audioState,
    playAudio,
    pauseAudio,
    stopAudio,
    setVolume,
    seekTo,
  }
}
