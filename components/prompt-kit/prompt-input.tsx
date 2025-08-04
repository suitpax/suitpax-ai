"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, MicOff } from "lucide-react"
import { toast } from "sonner"

interface PromptInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function PromptInput({ onSend, disabled = false, placeholder = "Type your message..." }: PromptInputProps) {
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
      toast.info("Voice input stopped")
    } else {
      setIsListening(true)
      toast.info("Voice input started (demo mode)")
      // In a real implementation, you would start speech recognition here
      setTimeout(() => {
        setIsListening(false)
        toast.info("Voice input stopped")
      }, 3000)
    }
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-32 resize-none pr-12 py-3"
          rows={1}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleVoiceInput}
          disabled={disabled}
          className={`absolute right-2 top-2 h-8 w-8 p-0 ${
            isListening ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        size="sm"
        className="h-11 px-4 bg-emerald-950 hover:bg-emerald-900"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
