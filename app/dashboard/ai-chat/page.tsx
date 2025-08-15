"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { useVoiceAI } from "@/contexts/voice-ai-context"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url: string }>
}

function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { speak, state: voiceState, startListening, stopListening } = useVoiceAI()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsUserLoading(false)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return
    if (isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setFiles([])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          showReasoning,
          sessionId: currentSessionId,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        reasoning: showReasoning ? data.reasoning : undefined,
        sources: data.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Sorry, there was an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ])
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

  const promptSuggestions = [
    {
      category: "Flight & Travel",
      prompts: [
        "Find business class flights from NYC to London next week",
        "Search for the cheapest flights to Tokyo in March",
        "Plan a 3-day business trip to Berlin with hotel recommendations",
      ],
    },
    {
      category: "Expense Management",
      prompts: [
        "Analyze my travel expenses from last month",
        "Check if my hotel booking complies with company policy",
        "Generate an expense report for my recent trip",
      ],
    },
    {
      category: "Document Processing",
      prompts: [
        "Extract data from my uploaded receipt",
        "Summarize this contract document",
        "Generate a travel itinerary from my email confirmations",
      ],
    },
  ]

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-medium text-white/90 tracking-tight">Suitpax AI</h1>
                <p className="text-sm text-white/60">Your intelligent business travel assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showReasoning}
                  onCheckedChange={setShowReasoning}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className="text-sm text-white/70">Show Reasoning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white/90 mb-2">Welcome to Suitpax AI</h2>
                <p className="text-white/60 mb-6">
                  Your intelligent assistant for business travel, expenses, and more.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                  {promptSuggestions.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <h3 className="text-sm font-medium text-white/80">{category.category}</h3>
                      {category.prompts.slice(0, 2).map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setInput(prompt)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70 border border-white/10"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-3xl rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-invert max-w-none"
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      if (inline) {
                        return (
                          <code className="bg-white/20 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        )
                      }
                      return (
                        <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto">
                          <code className="text-sm" {...props}>
                            {children}
                          </code>
                        </pre>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                {message.reasoning && showReasoning && (
                  <details className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <summary className="cursor-pointer text-sm font-medium text-white/80 mb-2">
                      🧠 AI Reasoning Process
                    </summary>
                    <div className="text-sm text-white/70 whitespace-pre-wrap">{message.reasoning}</div>
                  </details>
                )}

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-white/60">Sources:</p>
                    {message.sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-300 hover:text-blue-200 underline"
                      >
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}

                <div className="text-xs text-white/50 mt-2">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm text-white/70">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            {files.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1">
                    <span className="text-sm text-white/80">{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="text-white/60 hover:text-white/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about flights, hotels, expenses, or anything else..."
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl backdrop-blur-sm resize-none min-h-[50px] pr-20"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-white/70">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-4 bg-gray-900/95 border-white/20 backdrop-blur-sm rounded-2xl">
                      <div className="space-y-4">
                        {promptSuggestions.map((category) => (
                          <div key={category.category} className="space-y-2">
                            <h4 className="text-sm font-medium text-white/90">{category.category}</h4>
                            <div className="space-y-1">
                              {category.prompts.map((prompt) => (
                                <button
                                  key={prompt}
                                  onClick={() => setInput(prompt)}
                                  className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/80"
                                >
                                  {prompt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
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
                    className="h-8 w-8 p-0 hover:bg-white/10 text-white/70"
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && files.length === 0)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AIChatPage() {
  return (
    <div className="relative h-screen overflow-hidden">
      <VantaHaloBackground />
      <div className="relative z-10 flex h-full">
        <AIChatView />
      </div>
    </div>
  )
}
