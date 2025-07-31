"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  SparklesIcon,
  MicrophoneIcon,
  StopIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSpeechToText } from "@/hooks/use-speech-to-text"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const quickPrompts = [
  {
    icon: MapPinIcon,
    title: "Book a flight to New York",
    category: "Travel",
  },
  {
    icon: CreditCardIcon,
    title: "Track my expenses from last month",
    category: "Expenses",
  },
  {
    icon: ChartBarIcon,
    title: "Show my travel analytics",
    category: "Analytics",
  },
  {
    icon: ClockIcon,
    title: "What's my upcoming schedule?",
    category: "Schedule",
  },
]

export default function SuitpaxChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hi! I'm Zia, your Suitpax AI assistant. I can help you with flight bookings, expense management, travel planning, and more. What can I help you with today?",
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

  const { isListening, transcript, startListening, stopListening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechToText({
      onTranscriptChange: (text) => {
        setInput(text)
      },
      continuous: true,
    })

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

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setInput("")
      startListening()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b border-gray-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-gray-900">
                <em className="font-serif italic">Suitpax AI</em>
              </h1>
              <p className="text-sm text-gray-600">Your intelligent travel assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
            <Button variant="outline" size="sm">
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    onClick={() => handleQuickPrompt(prompt.title)}
                    className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <prompt.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{prompt.title}</p>
                        <p className="text-xs text-gray-500">{prompt.category}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <LightBulbIcon className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Pro Tip</h4>
              </div>
              <p className="text-sm text-blue-800">
                Try asking me complex questions like "Find me a flight to London under $800 with good reviews"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-2xl ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gray-900"
                          : "bg-gradient-to-r from-blue-600 to-purple-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <UserIcon className="h-5 w-5 text-white" />
                      ) : (
                        <SparklesIcon className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-6 py-4 ${
                        message.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-3 ${
                          message.role === "user" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border-t border-gray-200 p-6"
          >
            <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your travel..."
                  disabled={isLoading}
                  className="w-full pl-6 pr-24 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                />
                
                <div className="absolute right-3 flex items-center space-x-2">
                  {browserSupportsSpeechRecognition && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleVoiceInput}
                      className={`p-2 rounded-lg transition-colors ${
                        isListening
                          ? "text-red-600 bg-red-50 hover:bg-red-100"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {isListening ? (
                        <StopIcon className="h-4 w-4" />
                      ) : (
                        <MicrophoneIcon className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-lg"
                  >
                    {isLoading ? (
                      <SparklesIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-3"
                >
                  <span className="text-sm text-blue-600 font-medium animate-pulse">
                    🎤 Listening... speak now
                  </span>
                </motion.div>
              )}
            </form>
            
            <p className="text-xs text-gray-500 mt-4 text-center max-w-4xl mx-auto">
              Suitpax AI can make mistakes. Please verify important travel information.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}