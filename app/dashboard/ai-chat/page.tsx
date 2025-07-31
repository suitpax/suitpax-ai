"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpIcon, Bot, User, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function SuitpaxAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Suitpax AI, your intelligent business travel assistant. I can help you with flight bookings, expense management, travel policies, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
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
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I couldn't process your request at the moment. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <div className="relative mb-4 sm:mb-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm flex items-center justify-center p-2">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-800 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-1">
              Suitpax AI
            </h1>
            <p className="text-gray-600 font-light text-sm sm:text-base">Your intelligent business travel companion</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
            <Bot className="w-3 h-3 mr-1" />
            Claude AI
          </Badge>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">Business Travel Expert</Badge>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">Real-time Assistance</Badge>
        </div>
      </motion.div>

      {/* Messages */}
      <Card className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm mb-4 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4">
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
                    className={`flex space-x-3 max-w-[85%] sm:max-w-3xl ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user" ? "bg-black text-white" : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm font-light leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      <p className="text-sm font-light text-gray-500">Thinking...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about flights, expenses, travel policies, or anything else..."
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light resize-none min-h-[48px] max-h-32"
                rows={1}
                disabled={isLoading}
                style={{
                  height: "auto",
                  minHeight: "48px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = "auto"
                  target.style.height = Math.min(target.scrollHeight, 128) + "px"
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpIcon className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 text-xs text-gray-500 space-y-1 sm:space-y-0">
              <p>Press Enter to send, Shift+Enter for new line</p>
              <p>Powered by Claude AI</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
