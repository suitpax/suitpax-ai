"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Sparkles, Wand2 } from 'lucide-react'
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
} from "@/components/prompt-kit/chat-container"
import { ChatLoadingIndicator, ChatMessage } from "@/components/prompt-kit/chat-message"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const PromptStarters = ({ onSelect }: { onSelect: (prompt: string) => void }) => (
  <div className="space-y-2">
    <p className="font-medium text-sm text-gray-800">Prompt Starters</p>
    <button onClick={() => onSelect("Find flights from New York (JFK) to London (LHR) for next Monday, returning in 2 weeks for 1 adult.")} className="text-left text-sm text-gray-600 hover:text-gray-900 w-full p-2 rounded-md hover:bg-gray-100">
      ✈️ Find flights from New York to London...
    </button>
    <button onClick={() => onSelect("Book a 5-star hotel in Paris near the Eiffel Tower for 3 nights starting next Friday.")} className="text-left text-sm text-gray-600 hover:text-gray-900 w-full p-2 rounded-md hover:bg-gray-100">
      🏨 Book a 5-star hotel in Paris...
    </button>
    <button onClick={() => onSelect("Create a travel policy for our engineering team. Max flight budget is $1500 for international trips.")} className="text-left text-sm text-gray-600 hover:text-gray-900 w-full p-2 rounded-md hover:bg-gray-100">
      📄 Create a travel policy for the engineering team...
    </button>
  </div>
)

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
      <div className="flex-1 min-h-0">
        <ChatContainerRoot>
          <ChatContainerContent messages={messages} isLoading={loading} />
          <ChatContainerScrollAnchor />
          <ScrollButton />
        </ChatContainerRoot>
      </div>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <PromptInput value={input} onValueChange={setInput} onSubmit={handleSend} isLoading={loading}>
            <PromptInputActions>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <PromptStarters onSelect={(prompt) => {
                    setInput(prompt)
                    // find a way to close popover
                  }} />
                </PopoverContent>
              </Popover>
            </PromptInputActions>
            <PromptInputTextarea
              placeholder="Ask to find flights, book hotels, or create a travel policy..."
              disabled={loading}
            />
            <PromptInputActions>
              <Button type="submit" size="icon" disabled={loading || !input.trim()} onClick={handleSend}>
                <ArrowUp className="h-4 w-4" />
              </Button>
            </PromptInputActions>
          </PromptInput>
          <div className="flex items-center justify-center mt-3 gap-3">
             <Switch id="reasoning-mode" checked={showReasoning} onCheckedChange={setShowReasoning} />
             <Label htmlFor="reasoning-mode" className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                <Wand2 className="h-3 w-3" />
                Enable Advanced Reasoning
             </Label>
          </div>
        </div>
      </footer>
    </div>
  )
}
