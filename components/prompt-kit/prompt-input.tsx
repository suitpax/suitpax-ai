"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, MicOff } from "lucide-react"

interface PromptInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function PromptInput({
  onSubmit,
  disabled = false,
  placeholder = "Type your message...",
  className,
}: PromptInputProps) {
  const [message, setMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSubmit(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const toggleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsListening(!isListening)
      // Voice recognition logic would go here
      // For now, just toggle the state
    } else {
      console.log("Speech recognition not supported")
    }
  }

  return (
    <div className={`flex gap-2 items-end ${className}`}>
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none pr-12 py-3"
          rows={1}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleVoiceInput}
          className="absolute right-2 top-2 h-8 w-8 p-0"
          disabled={disabled}
        >
          {isListening ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4 text-gray-500" />}
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={disabled || !message.trim()}
        className="h-11 px-4 bg-emerald-950 hover:bg-emerald-900"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
