"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface SuitpaxChatProps {
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

export default function SuitpaxChat({ isOpen = false, onToggle, className = "" }: SuitpaxChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Zia, your AI travel assistant from Suitpax. How can I help you with your business travel needs today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Typing effect function
  const typeMessage = (text: string, messageId: string) => {
    let index = 0
    const typingSpeed = 30 // milliseconds per character

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content: text.substring(0, index + 1), isTyping: true } : msg,
          ),
        )
        index++
      } else {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isTyping: false } : msg)))
        clearInterval(typeInterval)
      }
    }, typingSpeed)

    return typeInterval
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Create assistant message with empty content initially
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Start typing effect
      typeMessage(data.response, assistantMessageId)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or contact our support team at hello@suitpax.com",
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

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      } transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Zia - Travel Assistant</h3>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button onClick={onToggle} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {message.content}
                      {message.isTyping && <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />}
                    </p>
                    <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                    <span className="text-sm text-gray-600">Zia is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about business travel..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
