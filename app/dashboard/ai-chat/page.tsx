"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
  SparklesIcon,
  DocumentTextIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

const quickPrompts = [
  {
    icon: CalendarIcon,
    title: "Plan a trip",
    prompt: "Help me plan a business trip to New York next week",
  },
  {
    icon: CreditCardIcon,
    title: "Track expenses",
    prompt: "Show me my recent travel expenses and help me categorize them",
  },
  {
    icon: MapPinIcon,
    title: "Find hotels",
    prompt: "Find the best business hotels in San Francisco under $300/night",
  },
  {
    icon: DocumentTextIcon,
    title: "Travel policy",
    prompt: "What are the company travel policies I should know about?",
  },
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Zia, your AI travel assistant. I can help you plan trips, manage expenses, find the best deals, and answer any questions about business travel. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [user, setUser] = useState<User | null>(null)
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const typeMessage = (messageId: string, content: string) => {
    let index = 0
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: content.slice(0, index + 1), isTyping: index < content.length - 1 }
            : msg,
        ),
      )
      index++
      if (index >= content.length) {
        clearInterval(interval)
      }
    }, 30)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10),
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiMessage])

      setTimeout(() => {
        typeMessage(aiMessageId, data.response)
      }, 500)
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team if the issue persists.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
    inputRef.current?.focus()
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Image
                src="/agents/agent-aria.jpeg"
                alt="Zia AI Assistant"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-medium tracking-tighter">Zia AI Assistant</h1>
              <div className="flex items-center space-x-1">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={60}
                  height={16}
                  className="h-4 w-auto opacity-60"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-light">
              <em className="font-serif italic">Your intelligent business travel companion</em>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center rounded-xl bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-medium tracking-tighter mb-2">Welcome to Zia AI</h2>
              <p className="text-gray-600 font-light max-w-md mx-auto">
                <em className="font-serif italic">
                  Your intelligent assistant for all business travel needs. Try one of these quick actions:
                </em>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={prompt.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-200 rounded-xl group-hover:bg-gray-300 transition-colors">
                      <prompt.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium tracking-tight text-gray-900">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 font-light mt-1 line-clamp-2">
                        <em className="font-serif italic">{prompt.prompt}</em>
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start space-x-4 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div className="flex-shrink-0">
              {message.role === "assistant" ? (
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Image
                    src="/agents/agent-aria.jpeg"
                    alt="Zia AI Assistant"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm text-gray-900"
              }`}
            >
              <p className="text-sm font-light leading-relaxed">
                {message.content}
                {message.isTyping && (
                  <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse opacity-60"></span>
                )}
              </p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Image
                src="/agents/agent-aria.jpeg"
                alt="Zia AI Assistant"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm p-4 rounded-2xl max-w-[70%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about flights, hotels, expenses, or any travel needs..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light resize-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                isRecording ? "bg-red-500 text-white" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isRecording ? <StopIcon className="h-4 w-4" /> : <MicrophoneIcon className="h-4 w-4" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200 flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-5 w-5 text-white" />
          </button>
        </form>

        <div className="mt-3 flex items-center justify-center">
          <p className="text-xs text-gray-500 font-light">
            <em className="font-serif italic">Powered by Suitpax AI • Your conversations are private and secure</em>
          </p>
        </div>
      </div>
    </div>
  )
}
