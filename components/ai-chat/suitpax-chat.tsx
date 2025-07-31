"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PaperAirplaneIcon, UserIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface SuitpaxChatProps {
  className?: string
}

export default function SuitpaxChat({ className = "" }: SuitpaxChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hi! I'm your Suitpax AI assistant. I can help you with flight bookings, expense management, travel planning, and more. What can I help you with today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: "general",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I apologize, but I'm having trouble responding right now. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Log the chat if user is authenticated
      if (user) {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: userMessage.content,
          response: assistantMessage.content,
          context_type: "general",
          tokens_used: data.tokens_used || 0,
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax AI"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium tracking-tighter text-gray-900">Suitpax AI</h2>
            <p className="text-xs text-gray-500">Your travel assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-black" : "bg-white border border-gray-200"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserIcon className="h-4 w-4 text-white" />
                  ) : (
                    <Image
                      src="/logo/suitpax-bl-logo.webp"
                      alt="Suitpax AI"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user" ? "bg-black text-white" : "bg-gray-50 text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <SparklesIcon className="h-4 w-4 text-gray-600 animate-pulse" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your travel..."
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Suitpax AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  )
}
