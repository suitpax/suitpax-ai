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
  isTyping?: boolean
}

export default function SuitpaxAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your Suitpax AI assistant. I'm here to help you with all your business travel needs - from finding the best flights and hotels to managing expenses and travel policies. What would you like to explore today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  const typeMessage = (messageId: string, content: string) => {
    let index = 0
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: content.slice(0, index + 1),
                isTyping: index < content.length - 1,
              }
            : msg,
        ),
      )
      index++
      if (index >= content.length) {
        clearInterval(interval)
      }
    }, 20)
  }

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

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: "business_travel",
          history: messages.slice(-5),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Start typing effect after a brief delay
      setTimeout(() => {
        typeMessage(
          assistantMessageId,
          data.response || "I apologize, but I'm having trouble responding right now. Please try again.",
        )
      }, 500)

      // Log the chat if user is authenticated
      if (user) {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: userMessage.content,
          response: data.response,
          context_type: "business_travel",
          tokens_used: data.tokens_used || 0,
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessageId = (Date.now() + 1).toString()
      const errorMessage: Message = {
        id: errorMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
        isTyping: true,
      }
      setMessages((prev) => [...prev, errorMessage])

      setTimeout(() => {
        typeMessage(
          errorMessageId,
          "I'm sorry, I encountered an error while processing your request. Please try again in a moment.",
        )
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const suggestedQuestions = [
    "Find me flights to London for next week",
    "How do I submit an expense report?",
    "What's our company travel policy?",
    "Book a hotel in San Francisco",
    "Show me my travel analytics",
    "Help me plan a business trip to Tokyo",
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax AI"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tighter text-gray-900">Suitpax AI</h1>
              <p className="text-xs text-gray-500">Your intelligent travel assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200">
              <SparklesIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Suitpax AI</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
              I'm here to help you with all your business travel needs. Try asking me something!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="p-3 text-left bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 text-sm group hover:shadow-sm"
                >
                  <span className="font-medium text-gray-900 group-hover:text-black">{question}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.slice(1).map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-black" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserIcon className="h-4 w-4 text-white" />
                  ) : (
                    <Image
                      src="/logo/suitpax-bl-logo.webp"
                      alt="Suitpax AI"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user" ? "bg-black text-white" : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {message.isTyping && <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse"></span>}
                  </div>
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
            <div className="flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <SparklesIcon className="h-4 w-4 text-gray-600 animate-pulse" />
              </div>
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
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

      {/* Input Area - Fixed */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-4 sm:px-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your business travel..."
              disabled={isLoading}
              rows={1}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none overflow-hidden"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
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
