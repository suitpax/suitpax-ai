"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Paperclip, X, Sparkles, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
  ChatMessage,
  ChatLoadingIndicator,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse } from "@/components/prompt-kit/reasoning"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showReasoning, setShowReasoning] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          includeReasoning: showReasoning,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response from AI")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
        reasoning: data.reasoning,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Sorry, I encountered an error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
              <Image src="/logo/suitpax-symbol-2.png" alt="Suitpax AI" width={40} height={40} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Suitpax AI</h1>
              <p className="text-sm text-gray-500">Your intelligent travel assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="reasoning-toggle" className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <Sparkles className="h-4 w-4" />
              <span>AI Reasoning</span>
            </label>
            <input
              id="reasoning-toggle"
              type="checkbox"
              checked={showReasoning}
              onChange={() => setShowReasoning(!showReasoning)}
              className="toggle-switch"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center py-16">
                <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Welcome to Suitpax AI</h3>
                <p className="mt-1 text-sm text-gray-500">How can I help you with your business travel today?</p>
              </div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.role === "assistant" && message.reasoning && (
                  <div className="mb-2 ml-12">
                    <Reasoning>
                      <ReasoningTrigger className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>View reasoning</span>
                      </ReasoningTrigger>
                      <ReasoningContent>
                        <ReasoningResponse text={message.reasoning} />
                      </ReasoningContent>
                    </Reasoning>
                  </div>
                )}
                <ChatMessage message={message} />
              </motion.div>
            ))}
            {loading && <ChatLoadingIndicator />}
          </ChatContainerContent>
          <ChatContainerScrollAnchor />
          <ScrollButton />
        </ChatContainerRoot>
      </div>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <PromptInput value={input} onValueChange={setInput} onSubmit={handleSend} isLoading={loading}>
            <PromptInputTextarea
              placeholder="Ask about flights, hotels, or create a travel policy..."
              disabled={loading}
            />
            <PromptInputActions>
              <Button type="submit" size="icon" disabled={loading || !input.trim()} onClick={handleSend}>
                <ArrowUp className="h-4 w-4" />
              </Button>
            </PromptInputActions>
          </PromptInput>
        </div>
      </footer>
      <style jsx>{`
        .toggle-switch {
          position: relative;
          width: 40px;
          height: 22px;
          -webkit-appearance: none;
          appearance: none;
          background: #e5e7eb;
          border-radius: 9999px;
          transition: background-color 0.2s;
          cursor: pointer;
        }
        .toggle-switch::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          top: 3px;
          left: 3px;
          transition: transform 0.2s;
        }
        .toggle-switch:checked {
          background-color: #10b981;
        }
        .toggle-switch:checked::before {
          transform: translateX(18px);
        }
      `}</style>
    </div>
  )
}
