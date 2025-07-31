"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Suitpax AI assistant. I can help you with flight bookings, expense management, travel policies, and more. How can I assist you today?",
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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Suitpax AI</h1>
            <p className="text-gray-600 font-light">Your intelligent business travel companion</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">
            <Bot className="w-3 h-3 mr-1" />
            Claude AI
          </Badge>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">Business Travel Expert</Badge>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">Real-time Assistance</Badge>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">24/7 Available</Badge>
        </div>
      </motion.div>

      {/* Messages */}
      <Card className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm mb-4">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-6 space-y-6">
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
                    className={`flex space-x-4 max-w-4xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src="/agents/agent-aria.jpeg"
                            alt="Suitpax AI"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-6 py-4 ${
                        message.role === "user" ? "bg-black text-white" : "bg-white border border-gray-200 shadow-sm"
                      }`}
                    >
                      <p className="text-sm font-light leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-3 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex space-x-4 max-w-4xl">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="/agents/agent-aria.jpeg"
                        alt="Suitpax AI"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-6 py-4">
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
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about flights, expenses, travel policies, or anything else..."
                className="flex-1 border-gray-200 focus:ring-black focus:border-black bg-white/80 backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-black text-white hover:bg-gray-800 px-6"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
              <p>Press Enter to send, Shift+Enter for new line</p>
              <p>Powered by Claude AI</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
