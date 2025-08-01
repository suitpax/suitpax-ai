"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Send, Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { useSpeechToText } from "@/hooks/use-speech-to-text"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Componente para el efecto typing
const TypingText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ 
  text, 
  speed = 50, 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    // Reset cuando cambia el texto
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return <span>{displayedText}</span>
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI travel assistant. How can I help you plan your next business trip?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
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
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      }

      // Agregar el mensaje y activar el efecto typing
      setMessages((prev) => [...prev, assistantMessage])
      setTypingMessageId(assistantMessage.id)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setTypingMessageId(errorMessage.id)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setInput("")
      startListening()
    }
  }

  const handleTypingComplete = () => {
    setTypingMessageId(null)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/50 backdrop-blur-sm border-b border-gray-200 p-4 lg:p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 bg-white">
              <Image
                src="/agents/agent-2.png"
                alt="Suitpax AI"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-medium tracking-tighter">
                <em className="font-serif italic">Suitpax AI</em>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 font-light">Your intelligent travel assistant</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-xl bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-950">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse mr-1"></span>
            Online
          </span>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-md overflow-hidden border border-gray-200 bg-white">
                    <Image
                      src="/agents/agent-2.png"
                      alt="AI"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
                </div>
              )}
              <p className="text-sm font-light leading-relaxed">
                {message.role === "assistant" && typingMessageId === message.id ? (
                  <TypingText 
                    text={message.content} 
                    speed={30} 
                    onComplete={handleTypingComplete}
                  />
                ) : (
                  message.content
                )}
              </p>
              <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 max-w-xs">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 rounded-md overflow-hidden border border-gray-200 bg-white">
                  <Image
                    src="/agents/agent-2.png"
                    alt="AI"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600 font-light">Thinking...</span>
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
        className="bg-white/50 backdrop-blur-sm border-t border-gray-200 p-4 lg:p-6"
      >
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about flights, hotels, or travel planning..."
              className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
              disabled={loading}
            />
            {browserSupportsSpeechRecognition && (
              <button
                onClick={toggleListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isListening
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-black text-white hover:bg-gray-800 px-4 py-3 rounded-xl"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {isListening && (
          <div className="text-center mt-2">
            <span className="text-xs text-blue-600 font-medium animate-pulse"> Listening... speak now</span>
          </div>
        )}
      </div>
    </div>
  )
}