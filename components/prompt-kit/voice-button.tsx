"use client"

import { Mic, Square } from "lucide-react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSpeechToText } from "@/hooks/use-speech-recognition"

export type VoiceButtonProps = {
	className?: string
	onTranscript?: (text: string) => void
	autoDetectLanguage?: boolean
}

export function VoiceButton({ className, onTranscript, autoDetectLanguage = true }: VoiceButtonProps) {
	const {
		isListening,
		transcript,
		interimTranscript,
		error,
		startListening,
		stopListening,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	} = useSpeechToText({ continuous: false, interimResults: true, autoDetectLanguage, onEnd: (finalText) => { if (finalText) onTranscript?.(finalText) } })

	useEffect(() => {
		if (interimTranscript && !isListening) return
		// We only push final text in onEnd; keep UI lightweight here
	}, [interimTranscript, isListening])

	const disabled = !browserSupportsSpeechRecognition || !isMicrophoneAvailable

	return (
		<button
			type="button"
			onClick={() => (isListening ? stopListening() : startListening())}
			disabled={disabled}
			className={cn(
				"inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50",
				isListening && "bg-red-500 text-white hover:bg-red-600 border-red-500",
				className,
			)}
			aria-label={isListening ? "Stop listening" : "Start listening"}
			title={error || (isListening ? "Stop listening" : "Start voice input")}
		>
			{isListening ? <Square className="size-4" /> : <Mic className="size-4" />}
		</button>
	)
}

export default VoiceButton