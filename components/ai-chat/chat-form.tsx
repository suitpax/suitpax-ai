"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Sparkles } from "lucide-react"
import type { FormValues } from "@/lib/form-schema"

interface ChatFormProps {
  isLoading: boolean
  onSubmit: (values: FormValues) => void
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

const quickPrompts = [
  "Book a business trip to London next week",
  "Find the best hotel deals in San Francisco",
  "Track my travel expenses from last month",
  "Schedule a team meeting for next Tuesday",
  "What's my travel budget status?",
  "Find flights with lounge access to Tokyo",
]

export default function ChatForm({ isLoading, onSubmit }: ChatFormProps) {
  const [prompt, setPrompt] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setPrompt((prev) => prev + transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const handleVoiceInput = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop()
        setIsListening(false)
      } else {
        recognition.start()
        setIsListening(true)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    onSubmit({ prompt })
    setPrompt("")
    setShowQuickPrompts(false)
  }

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt)
    setShowQuickPrompts(false)
    onSubmit({ prompt: quickPrompt })
  }

  return (
    <div className="relative">
      {/* Quick Prompts */}
      {showQuickPrompts && !prompt && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-medium text-white">Quick prompts</span>
          </div>
          <div className="grid gap-1">
            {quickPrompts.map((quickPrompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(quickPrompt)}
                className="text-left text-xs text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-2">
          <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <img src="/agents/agent-15.png" alt="Zia AI Assistant" className="h-8 w-8 object-cover rounded-full" />
          </div>
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setShowQuickPrompts(true)}
              onBlur={() => setTimeout(() => setShowQuickPrompts(false), 200)}
              placeholder="Ask Zia about your business travel needs..."
              disabled={isLoading}
              className="w-full pl-3 pr-16 py-3 text-sm bg-transparent text-white placeholder-white/40 focus:outline-none min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {recognition && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-1.5 rounded-md transition-colors ${
                    isListening
                      ? "bg-red-500/20 text-red-400 animate-pulse"
                      : "hover:bg-white/10 text-white/50 hover:text-white/80"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white/70 hover:text-white"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
