"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  Sparkles,
  Send,
  Paperclip,
  X,
  MoreHorizontal,
  Plane,
  Building2,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  ChevronRight,
  Star,
  Globe,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { EnhancedPromptInput } from "@/components/prompt-kit/prompt-input"
import { ChatMessage } from "@/components/prompt-kit/chat-message"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url: string }>
}

const aiCapabilities = [
  { icon: Plane, title: "Flight Search", desc: "Find and book flights worldwide", color: "bg-blue-500" },
  { icon: Building2, title: "Hotel Booking", desc: "Discover perfect accommodations", color: "bg-emerald-500" },
  { icon: MapPin, title: "Travel Planning", desc: "Create detailed itineraries", color: "bg-purple-500" },
  { icon: Calendar, title: "Schedule Management", desc: "Organize meetings and events", color: "bg-orange-500" },
  { icon: CreditCard, title: "Expense Tracking", desc: "Monitor business expenses", color: "bg-red-500" },
  { icon: Users, title: "Team Coordination", desc: "Manage team travel needs", color: "bg-indigo-500" },
]

const quickActions = [
  { icon: Plane, text: "Find flights from Madrid to San Francisco", category: "Travel" },
  { icon: Building2, text: "Book a hotel in downtown Tokyo for 3 nights", category: "Accommodation" },
  { icon: Calendar, text: "Plan a 5-day business trip to London", category: "Planning" },
  { icon: CreditCard, text: "Create an expense report for last month", category: "Finance" },
  { icon: Users, text: "Schedule team meeting in New York office", category: "Team" },
  { icon: Globe, text: "What are the visa requirements for Brazil?", category: "Information" },
]

export default function SuitpaxAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsUserLoading(false)
    }
    getUser()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if ((!input.trim() && files.length === 0) || isLoading) return

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
      const response = await fetch("/api/suitpax-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userId: user?.id,
          sessionId: currentSessionId,
          conversationHistory: messages.slice(-10),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        reasoning: data.reasoning,
        sources: data.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
      if (data.sessionId) setCurrentSessionId(data.sessionId)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium tracking-tight">Initializing Suitpax AI...</p>
        </motion.div>
      </div>
    )
  }

  const EmptyState = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-medium tracking-tighter text-gray-900">Suitpax AI</h1>
                <p className="text-sm text-gray-500">Your intelligent business travel assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
              <Button variant="ghost" size="sm" className="rounded-xl">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-5xl md:text-7xl font-light text-gray-800 mb-6 leading-tight tracking-tighter">
              Ask anything.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travel. Business. Code.
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 font-light">
              Powered by advanced AI with memory and business travel expertise
            </p>
          </motion.div>

          {/* AI Capabilities Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {aiCapabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`w-12 h-12 ${capability.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <capability.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{capability.title}</h3>
                <p className="text-sm text-gray-600">{capability.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-medium text-gray-900 mb-8 tracking-tight">Try these examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.text}
                  onClick={() => setInput(action.text)}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-left hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <action.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-3 text-xs">
                        {action.category}
                      </Badge>
                      <p className="text-gray-900 font-medium leading-relaxed">{action.text}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Features Note */}
          <motion.div
            className="mt-16 p-6 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <h4 className="font-medium text-gray-900">Advanced Features</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Supports markdown, code blocks, file attachments, and remembers your preferences across conversations. Use
              triple backticks with language for syntax highlighting.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                className="mb-4 flex flex-wrap gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

                      <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="hidden sm:block">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-2 text-xs text-gray-500 font-medium">Ask Suitpax AI</div>
                    <EnhancedPromptInput
                      value={input}
                      onChange={setInput}
                      onSubmit={handleSend}
                      isLoading={isLoading}
                      placeholder="Ask me about flights, hotels, travel planning, or anything else..."
                      enableAttachments
                      enableVoice
                    />
                  </div>
                </div>
                <div className="sm:hidden">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about flights, hotels, travel planning, or anything else..."
                    disabled={isLoading}
                    className="bg-white border-gray-300 rounded-2xl resize-none min-h-[56px] pr-20 focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                    rows={1}
                  />
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && files.length === 0)}
                className="bg-black hover:bg-gray-800 text-white rounded-2xl px-6 py-3 shadow-sm transition-all"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
              <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-medium text-gray-900">Suitpax AI</h1>
                      <p className="text-xs text-gray-500">Conversation started</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showReasoning}
                        onCheckedChange={setShowReasoning}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <span className="text-sm text-gray-600">Show reasoning</span>
                    </div>
                    <Button
                      onClick={() => {
                        setMessages([])
                        setCurrentSessionId(null)
                      }}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                {messages.map((message, index) => (
                  <ChatMessage message={message as any} showReasoning={showReasoning} />
                ))}

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="mr-12 max-w-3xl">
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-blue-600"></div>
                            <span className="text-sm text-gray-700">Suitpax AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 p-6">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence>
                  {files.length > 0 && (
                    <motion.div
                      className="mb-4 flex flex-wrap gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-end gap-4">
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Continue the conversation..."
                      disabled={isLoading}
                      className="bg-white border-gray-300 rounded-2xl resize-none min-h-[60px] pr-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      rows={1}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <input
                        ref={uploadInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setFiles([...files, ...Array.from(e.target.files)])
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                        onClick={() => uploadInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || (!input.trim() && files.length === 0)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
