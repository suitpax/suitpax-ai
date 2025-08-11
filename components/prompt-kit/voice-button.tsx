"use client"

import { useEffect } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVoiceAI } from "@/contexts/voice-ai-context"

export type VoiceButtonProps = {
  onTranscript?: (text: string) => void
  className?: string
}

export default function VoiceButton({ onTranscript, className }: VoiceButtonProps) {
  const { state, startListening, stopListening } = useVoiceAI()

  useEffect(() => {
    if (state.transcript && onTranscript) {
      onTranscript(state.transcript)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.transcript])

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (state.isListening) {
      stopListening()
    } else {
      await startListening()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={state.isListening ? "Stop voice input" : "Start voice input"}
      className={cn(
        "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-2xl transition-colors",
        state.isListening ? "bg-red-600 text-white" : "hover:bg-gray-100 text-gray-700",
        className
      )}
    >
      {state.isListening ? (
        <MicOff className="size-3.5 sm:size-4" />
      ) : state.isProcessing ? (
        <Loader2 className="size-3.5 sm:size-4 animate-spin" />
      ) : (
        <Mic className="size-3.5 sm:size-4" />
      )}
    </button>
  )
}
