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
  playAudio: (audioSource: string | ArrayBuffer) => Promise<void>
  pauseAudio: () => void
  resumeAudio: () => void
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
  const animationFrameRef = useRef<number>()

  const updateAudioState = useCallback(() => {
    if (audioRef.current) {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
        duration: audioRef.current?.duration || 0,
      }))
    }

    if (audioRef.current && !audioRef.current.paused) {
      animationFrameRef.current = requestAnimationFrame(updateAudioState)
    }
  }, [])

  const playAudio = useCallback(
    async (audioSource: string | ArrayBuffer): Promise<void> => {
      try {
        // Stop current audio if playing
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }

        // Create new audio element
        const audio = new Audio()
        audioRef.current = audio

        // Convert ArrayBuffer to blob URL if needed
        let audioUrl: string
        if (audioSource instanceof ArrayBuffer) {
          const blob = new Blob([audioSource], { type: "audio/mpeg" })
          audioUrl = URL.createObjectURL(blob)
        } else {
          audioUrl = audioSource
        }

        audio.src = audioUrl
        audio.volume = audioState.volume

        // Set up event listeners
        audio.onloadedmetadata = () => {
          setAudioState((prev) => ({
            ...prev,
            duration: audio.duration,
          }))
        }

        audio.onplay = () => {
          setAudioState((prev) => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
          }))
          updateAudioState()
        }

        audio.onpause = () => {
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: true,
          }))
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
        }

        audio.onended = () => {
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            currentTime: 0,
          }))
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }

          // Clean up blob URL if it was created
          if (audioSource instanceof ArrayBuffer) {
            URL.revokeObjectURL(audioUrl)
          }
        }

        audio.onerror = (error) => {
          console.error("Audio playback error:", error)
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
          }))
        }

        // Play the audio
        await audio.play()
      } catch (error) {
        console.error("Error playing audio:", error)
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
        }))
        throw error
      }
    },
    [audioState.volume, updateAudioState],
  )

  const pauseAudio = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }, [])

  const resumeAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error)
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

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))

    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }

    setAudioState((prev) => ({
      ...prev,
      volume: clampedVolume,
    }))
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration || 0))
    }
  }, [])

  return {
    audioState,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    setVolume,
    seekTo,
  }
}
