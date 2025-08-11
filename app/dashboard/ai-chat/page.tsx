"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Loader2,
  ArrowUp,
  Paperclip,
  FileIcon,
  ImageIcon,
  FileText,
  FileCode,
  FileSpreadsheet,
  Music,
  Video,
  Archive,
  Menu,
  Sparkles,
  X,
  Plane,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { PromptInput, PromptInputAction, PromptInputActions } from "@/components/prompt-kit/prompt-input"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Switch } from "@/components/ui/switch"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { useVoiceAI } from "@/contexts/voice-ai-context"
import VoiceButton from "@/components/prompt-kit/voice-button"
import { useChatStream } from "@/hooks/use-chat-stream"
import ChatSidebar from "@/components/prompt-kit/chat-sidebar"
import { ChatMessage } from "@/components/prompt-kit/chat-message"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

const PROMPT_STARTERS = [
  {
    category: "✈️ Flight Search",
    prompts: [
      "Find flights from Madrid to New York next week",
      "Show me business class options from London to Tokyo",
      "Search for round-trip flights Barcelona to Dubai in December",
      "Find the cheapest flights from Paris to Los Angeles",
    ],
  },
  {
    category: "🏨 Travel Planning",
    prompts: [
      "Plan a 5-day business trip to Berlin",
      "Recommend hotels near Frankfurt airport",
      "What's the best time to visit Singapore for business?",
      "Create an itinerary for a conference in Amsterdam",
    ],
  },
  {
    category: "💼 Business Travel",
    prompts: [
      "Calculate travel expenses for my last trip",
      "What are the visa requirements for business travel to India?",
      "Find meeting rooms near Heathrow airport",
      "Compare airline loyalty programs for frequent travelers",
    ],
  },
  {
    category: "🤖 AI Assistance",
    prompts: [
      "Analyze my travel patterns and suggest optimizations",
      "Generate a travel policy document for our company",
      "Create a presentation about our Q4 travel budget",
      "Help me write an email to reschedule a business meeting",
    ],
  },
]

function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [deepSearch, setDeepSearch] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { speak, state: voiceState, startListening, stopListening, settings: voiceSettings } = useVoiceAI()
  const { isStreaming, start, cancel } = useChatStream()
  const [isSessionLoading, setIsSessionLoading] = useState(false)

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

  const getFileMeta = (file: File) => {
    const type = file.type
    const sizeKB = Math.max(1, Math.round(file.size / 1024))
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`

    let Icon = FileIcon
    if (type.startsWith("image/")) Icon = ImageIcon
    else if (type === "application/pdf") Icon = FileText
    else if (type.includes("spreadsheet") || type.includes("excel")) Icon = FileSpreadsheet
    else if (type.startsWith("text/") || type === "application/json") Icon = FileText
    else if (type.startsWith("audio/")) Icon = Music
    else if (type.startsWith("video/")) Icon = Video
    else if (type.includes("zip") || type.includes("compressed") || type.includes("rar")) Icon = Archive
    else if (
      type.includes("javascript") ||
      type.includes("typescript") ||
      type.includes("python") ||
      type.includes("java") ||
      type.includes("rust")
    )
      Icon = FileCode

    return { Icon, sizeText }
  }

  const validateFiles = (newFiles: File[]) => {
    const MAX_FILES = 5
    const MAX_SIZE_MB = 15
    const allowed = ["application/pdf", "text/plain", "application/json", "image/png", "image/jpeg"]

    if (files.length + newFiles.length > MAX_FILES) {
      throw new Error(`Maximum ${MAX_FILES} files allowed`)
    }

    for (const f of newFiles) {
      if (!allowed.some((t) => f.type === t || f.type.startsWith(t.split("/")[0] + "/"))) {
        throw new Error(`File type not allowed: ${f.type}`)
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`File too large: ${f.name} (> ${MAX_SIZE_MB} MB)`)
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      try {
        validateFiles(newFiles)
        setFiles((prev) => [...prev, ...newFiles])
      } catch (e: any) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", content: e.message, timestamp: new Date() },
        ])
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = ""
    }
  }

  const ensureSession = async (titleSeed: string) => {
    if (currentSessionId) return currentSessionId
    if (!user?.id) return null
    const title = (titleSeed || "New session").slice(0, 80)
    const { data, error } = await supabase.from("chat_sessions").insert({ user_id: user.id, title }).select().single()
    if (error) return null
    const newId = (data as any).id as string
    setCurrentSessionId(newId)
    return newId
  }

  const logChat = async (sessionId: string | null, userText: string, assistantText: string) => {
    try {
      if (!user?.id) return
      await supabase.from("ai_chat_logs").insert({
        user_id: user.id,
        session_id: sessionId,
        message: userText,
        response: assistantText,
        model_used: "claude-3-5-sonnet-20240620",
        tokens_used: 0,
        context_type: "general",
      })
      if (sessionId) {
        await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId)
      }
    } catch {}
  }

  const isPdfIntent = (text: string) =>
    /\b(pdf|genera(r|)\s+un\s+pdf|genera(r|)\s+pdf|crear?\s+pdf|export(ar|a)\s+pdf|save\s+as\s+pdf)\b/i.test(text)

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const maybeGeneratePdf = async (userText: string, aiText: string, reasoning?: string) => {
    if (!isPdfIntent(userText)) return
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: aiText, reasoning }),
      })
      if (!res.ok) throw new Error("PDF generation failed")
      const blob = await res.blob()
      downloadBlob(blob, `suitpax-ai-${Date.now()}.pdf`)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content: "He generado y descargado el PDF automáticamente ✅",
          timestamp: new Date(),
        },
      ])
    } catch (e1: any) {
      try {
        // Fallback a /api/pdf con markdown
        const res2 = await fetch("/api/pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown: aiText, filename: `suitpax-ai-${Date.now()}.pdf` }),
        })
        if (!res2.ok) throw new Error("PDF generation fallback failed")
        const blob2 = await res2.blob()
        downloadBlob(blob2, `suitpax-ai-${Date.now()}.pdf`)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 5).toString(),
            role: "assistant",
            content: "He generado y descargado el PDF (modo fallback) ✅",
            timestamp: new Date(),
          },
        ])
      } catch (e2: any) {
        try {
          // Último fallback: guardar en Supabase y dar enlace
          const res3 = await fetch("/api/pdf/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: aiText, reasoning, filename: `suitpax-ai` }),
          })
          const data3 = await res3.json()
          if (data3?.success && data3.url) {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 6).toString(),
                role: "assistant",
                content: `He generado el PDF y lo he subido. Descárgalo aquí: ${data3.url}`,
                timestamp: new Date(),
              },
            ])
            return
          }
          throw new Error("Upload failed")
        } catch (e3: any) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 7).toString(),
              role: "assistant",
              content: "No he podido generar el PDF. Inténtalo de nuevo.",
              timestamp: new Date(),
            },
          ])
        }
      }
    }
  }

  const sendNonStreaming = async (userMessage: Message, sessionId: string | null) => {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.content,
        history: messages,
        context: "travel_booking",
        includeReasoning: showReasoning,
        webSearch,
        deepSearch,
      }),
    })
    if (!response.ok) throw new Error("Failed to get response")
    const data = await response.json()
    // Persist sources for attribution
    try {
      if (Array.isArray(data.sources) && data.sources.length > 0) {
        await fetch("/api/web-sources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sources: data.sources }),
        })
      }
    } catch {}
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: data.response,
      role: "assistant",
      timestamp: new Date(),
      reasoning: data.reasoning,
      sources: data.sources || [],
    }
    setMessages((prev) => [...prev, assistantMessage])
    setTypingMessageId(assistantMessage.id)
    if (voiceSettings?.autoSpeak !== false) {
      try {
        await speak(data.response)
      } catch {}
    }
    await logChat(sessionId, userMessage.content, data.response)
    // Auto PDF if requested
    await maybeGeneratePdf(userMessage.content, data.response, data.reasoning)
  }

  const handleSend = async () => {
    if (!input.trim() || loading || isStreaming) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setFiles([])
    setLoading(true)

    const isFlightIntent =
      /\b([A-Z]{3})\b.*\b(to|→|-|from)\b.*\b([A-Z]{3})\b/i.test(userMessage.content) ||
      /\b(flight|flights|vuelo|vuelos|fly|flying|book|search)\b/i.test(userMessage.content)

    try {
      const sessionId = await ensureSession(userMessage.content)

      if (isFlightIntent) {
        await sendNonStreaming(userMessage, sessionId)
        return
      }

      // Use streaming for other queries
      let streamed = ""
      await start({ message: userMessage.content, history: messages }, async (token) => {
        streamed += token
        setTypingMessageId("streaming")
        setMessages((prev) => {
          const others = prev.filter((m) => m.id !== "streaming-temp")
          return [...others, { id: "streaming-temp", content: streamed, role: "assistant", timestamp: new Date() }]
        })
      })

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== "streaming-temp")
        return [
          ...withoutTemp,
          { id: (Date.now() + 1).toString(), content: streamed, role: "assistant", timestamp: new Date() },
        ]
      })
      setTypingMessageId(null)

      if (voiceSettings?.autoSpeak !== false) {
        try {
          await speak(streamed)
        } catch {}
      }
      await logChat(sessionId, userMessage.content, streamed)
      await maybeGeneratePdf(userMessage.content, streamed)
    } catch (err) {
      try {
        const sessionId = await ensureSession(userMessage.content)
        await sendNonStreaming(userMessage, sessionId)
      } catch (e2: any) {
        const errorText =
          typeof e2?.message === "string" ? e2.message : "There was an issue generating the response. Please try again."
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 2).toString(), role: "assistant", content: errorText, timestamp: new Date() },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (prompt: string) => {
    setInput(prompt)
  }

  const handleTypingComplete = () => setTypingMessageId(null)

  useEffect(() => {
    const loadSessionMessages = async () => {
      if (!currentSessionId || !user?.id) return
      setIsSessionLoading(true)
      const { data, error } = await supabase
        .from("ai_chat_logs")
        .select("message,response,created_at")
        .eq("user_id", user.id)
        .eq("session_id", currentSessionId)
        .order("created_at", { ascending: true })
      if (!error && Array.isArray(data)) {
        const reconstructed: Message[] = []
        for (const row of data as any[]) {
          reconstructed.push({
            id: `${row.created_at}-u`,
            role: "user",
            content: row.message,
            timestamp: new Date(row.created_at),
          })
          reconstructed.push({
            id: `${row.created_at}-a`,
            role: "assistant",
            content: row.response,
            timestamp: new Date(row.created_at),
          })
        }
        setMessages(reconstructed)
      }
      setIsSessionLoading(false)
    }
    loadSessionMessages()
  }, [currentSessionId, user?.id, supabase])

  return (
    <div className="flex-1 flex h-full">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-r border-white/10 bg-black/20 backdrop-blur-sm",
          sidebarOpen ? "w-80" : "w-0",
        )}
      >
        {sidebarOpen && (
          <div className="h-full">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white/90">Conversations</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/70"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ChatSidebar currentSessionId={currentSessionId} onSessionSelect={setCurrentSessionId} />
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/70"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-medium text-white/90 tracking-tight">Suitpax AI</h1>
                <p className="text-sm text-white/60">Your intelligent travel assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showReasoning}
                  onCheckedChange={setShowReasoning}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className="text-sm text-white/70">Advanced Reasoning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatContainerRoot className="flex-1">
            <ChatContainerContent className="px-6 py-8">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto text-center space-y-8"
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-medium text-white/90 tracking-tight">Welcome to Suitpax AI</h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                      Your intelligent travel assistant powered by real-time flight data and advanced AI reasoning
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {PROMPT_STARTERS.map((category, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-lg font-medium text-white/80">{category.category}</h3>
                        <div className="space-y-3">
                          {category.prompts.map((prompt, promptIdx) => (
                            <button
                              key={promptIdx}
                              onClick={() => setInput(prompt)}
                              className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all text-sm text-white/70 hover:text-white/90 backdrop-blur-sm"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <ChatMessage
                    message={message}
                    isTyping={typingMessageId === message.id}
                    showReasoning={showReasoning}
                  />
                </motion.div>
              ))}

              {(loading || isStreaming || isSessionLoading) && (
                <div className="flex items-center gap-3 text-white/60 text-sm p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isSessionLoading ? "Loading conversation…" : "Generating answer…"}</span>
                </div>
              )}

              <ChatContainerScrollAnchor />
            </ChatContainerContent>
          </ChatContainerRoot>

          <ScrollButton />

          {/* Input Area */}
          <div className="p-6 border-t border-white/10 bg-black/10 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <PromptInput
                value={input}
                onChange={setInput}
                onSubmit={handleSend}
                placeholder="Ask about flights, hotels, travel planning, or anything else..."
                disabled={loading || isStreaming}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl backdrop-blur-sm"
              >
                <PromptInputActions>
                  <PromptInputAction>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
                          aria-label="Prompt suggestions"
                        >
                          <Sparkles className="h-5 w-5 text-white/70" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-6 bg-gray-900/95 border-white/20 backdrop-blur-sm rounded-2xl">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <h4 className="font-medium text-white/90 text-lg">Quick Actions</h4>
                            <div className="grid grid-cols-1 gap-3">
                              <button
                                onClick={() => setInput("Find flights from Madrid to New York next week")}
                                className="text-left p-4 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white/70 hover:text-white/90 transition-colors border border-white/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Plane className="h-4 w-4 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Search Flights</p>
                                    <p className="text-xs text-white/50">Find and compare flight options</p>
                                  </div>
                                </div>
                              </button>
                              <button
                                onClick={() => setInput("Plan a business trip to Berlin")}
                                className="text-left p-4 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white/70 hover:text-white/90 transition-colors border border-white/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-green-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Plan Trip</p>
                                    <p className="text-xs text-white/50">Create comprehensive travel plans</p>
                                  </div>
                                </div>
                              </button>
                              <button
                                onClick={() => setInput("Calculate my travel expenses")}
                                className="text-left p-4 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white/70 hover:text-white/90 transition-colors border border-white/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <BarChart3 className="h-4 w-4 text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Expense Analysis</p>
                                    <p className="text-xs text-white/50">Track and analyze travel costs</p>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-white/50 p-4 rounded-xl bg-white/5 border border-white/10">
                            💡 Try asking about flights, hotels, travel planning, or business travel policies
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </PromptInputAction>
                  <PromptInputAction>
                    <VoiceButton onTranscript={(t) => setInput((prev) => (prev ? prev + " " + t : t))} />
                  </PromptInputAction>
                  <PromptInputAction>
                    <label htmlFor="file-upload" className="cursor-pointer" aria-label="Attach files">
                      <input
                        id="file-upload"
                        ref={uploadInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                      />
                      <Paperclip className="h-5 w-5" />
                    </label>
                  </PromptInputAction>
                  <PromptInputAction>
                    <button onClick={handleSend} aria-label="Send message" disabled={loading || isStreaming}>
                      {loading || isStreaming ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ArrowUp className="h-5 w-5" />
                      )}
                    </button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AIChatPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Vanta Background */}
      <div className="absolute inset-0 -z-10">
        <VantaHaloBackground />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex relative">
        <AIChatView />
      </div>
    </div>
  )
}
