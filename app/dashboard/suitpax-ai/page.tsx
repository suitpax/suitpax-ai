"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Loader2,
  ArrowUp,
  Paperclip,
  X,
  FileIcon,
  ImageIcon,
  FileText,
  FileCode,
  FileSpreadsheet,
  Music,
  Video,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Markdown from "@/components/prompt-kit/markdown"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse } from "@/components/prompt-kit/reasoning"
import { Switch } from "@/components/ui/switch"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import DocumentScanner from "@/components/prompt-kit/document-scanner"
import PromptSuggestions from "@/components/prompt-kit/prompt-suggestions"
import SourceList from "@/components/prompt-kit/source-list"
import { useChatStream } from "@/hooks/use-chat-stream"
import ChatFlightOffers from "@/components/prompt-kit/chat-flight-offers"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

const defaultSuggestions = [
  {
    id: "s1",
    title: "Plan a 2-day NYC business trip",
    prompt:
      "Plan a 2-day business trip itinerary in NYC with meetings near Midtown and a budget of $400 per night for hotel.",
  },
  {
    id: "s2",
    title: "Find flights MAD→SFO",
    prompt: "Find the 3 best flights from MAD to SFO on 2025-09-10, 1 adult, business class, direct preferred.",
  },
  {
    id: "s3",
    title: "Summarize attached PDF",
    prompt: "Summarize the attached PDF in 5 bullets and list key action items.",
  },
]

function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { isStreaming, start, cancel } = useChatStream()
  const searchParams = useSearchParams()

  useEffect(() => {
    const preset = searchParams.get("prompt")
    if (preset) setInput(preset)
  }, [searchParams])

  const sendWithReasoning = async (userMessage: Message) => {
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.content,
        history: messages,
        userId: user?.id,
        includeReasoning: showReasoning,
      }),
    })
    if (res.ok) {
      const data = await res.json()
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
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
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

  const sendNonStreaming = async (userMessage: Message) => {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.content,
        history: messages,
        context: "travel_booking",
        includeReasoning: showReasoning,
      }),
    })
    if (!response.ok) throw new Error("Failed to get response")
    const data = await response.json()
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
      /\b([A-Z]{3})\b.*\b(to|→|-)\b.*\b([A-Z]{3})\b/i.test(userMessage.content) ||
      /\bflight|vuelo|vuelos\b/i.test(userMessage.content)

    // Always connect userId for Mem0 association
    if (!user) {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    try {
      if (isFlightIntent || showReasoning) {
        await sendWithReasoning(userMessage)
        return
      }
      let streamed = ""
      await start({ message: userMessage.content, history: messages, userId: user?.id }, async (token) => {
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
    } catch (err) {
      await sendNonStreaming(userMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (prompt: string) => {
    setInput(prompt)
  }

  const handleTypingComplete = () => setTypingMessageId(null)

  return (
    <VantaHaloBackground className="fixed inset-0">
      <div className="absolute inset-0 flex flex-col">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-gray-200 bg-white flex-shrink-0 shadow-sm">
                  <img
                    src="/suitpax-bl-logo.webp"
                    alt="Suitpax"
                    className="w-full h-full object-contain p-1"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tighter text-gray-900">
                    Suitpax AI
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 font-light">Ask anything. Travel. Business. Code.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Reasoning</div>
                <Switch checked={showReasoning} onCheckedChange={setShowReasoning} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
          <ChatContainerRoot className="h-full max-w-6xl mx-auto w-full">
            <ChatContainerContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 relative">
              {messages.length === 0 && !loading && (
                <div className="space-y-6 sm:space-y-8 py-8 sm:py-12">
                  <div className="flex items-center justify-center">
                    <div className="text-center px-4">
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#7a7a7a,#111)] bg-[length:200%_100%] animate-pulse leading-tight"
                      >
                        Ask anything
                      </motion.h2>
                      <p className="text-base sm:text-lg text-gray-600 mt-2 font-light">
                        Your AI assistant for business travel, planning, and productivity
                      </p>
                    </div>
                  </div>
                  <PromptSuggestions suggestions={defaultSuggestions} onSelect={handleSuggestion} />
                  <div className="text-xs sm:text-sm text-gray-600 px-2 text-center">
                    Markdown and code blocks supported. Use triple backticks with language for syntax highlighting.
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} px-1 sm:px-0`}
                >
                  <div
                    className={`${
                      message.role === "user"
                        ? "max-w-[85%] sm:max-w-[80%] md:max-w-2xl lg:max-w-3xl rounded-2xl px-4 sm:px-6 py-3 sm:py-4 bg-black text-white"
                        : "max-w-[90%] sm:max-w-[85%] md:max-w-2xl lg:max-w-3xl rounded-2xl px-4 sm:px-6 py-4 sm:py-5 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                          <img
                            src="/suitpax-bl-logo.webp"
                            alt="Suitpax AI"
                            className="w-full h-full object-contain p-0.5"
                            loading="eager"
                            fetchPriority="high"
                          />
                        </div>
                        <span className="text-sm sm:text-base font-medium text-gray-700">Suitpax AI</span>
                      </div>
                    )}

                    {message.role === "assistant" && message.reasoning && (
                      <div className="mb-3 sm:mb-4">
                        <Reasoning>
                          <ReasoningTrigger className="text-xs sm:text-sm text-gray-400 hover:text-gray-600">
                            <span>View AI logic</span>
                          </ReasoningTrigger>
                          <ReasoningContent>
                            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                              <ReasoningResponse
                                text={message.reasoning}
                                className="text-xs sm:text-sm text-gray-700"
                              />
                            </div>
                          </ReasoningContent>
                        </Reasoning>
                      </div>
                    )}

                    <div className="prose prose-sm sm:prose-base max-w-none prose-p:mb-2 sm:prose-p:mb-3 prose-pre:mb-0">
                      {message.role === "assistant" && typingMessageId === message.id ? (
                        <p className="text-sm sm:text-base font-light leading-relaxed text-gray-900">Typing…</p>
                      ) : (
                        <>
                          <Markdown content={message.content} />
                          {(() => {
                            const match = message.content.match(/:::flight_offers_json\n([\s\S]*?)\n:::/)
                            if (!match) return null
                            try {
                              const parsed = JSON.parse(match[1])
                              return (
                                <div className="mt-3 sm:mt-4">
                                  <ChatFlightOffers
                                    offers={parsed.offers || []}
                                    onSelect={(id) => {
                                      window.location.href = `/dashboard/flights/book/${id}`
                                    }}
                                  />
                                </div>
                              )
                            } catch {
                              return null
                            }
                          })()}
                        </>
                      )}
                    </div>
                    {message.sources && message.sources.length > 0 && <SourceList items={message.sources} />}
                    <p
                      className={`text-xs sm:text-sm mt-2 sm:mt-3 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start px-1 sm:px-0"
                >
                  <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 max-w-[90%] sm:max-w-md">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                        <img
                          src="/suitpax-bl-logo.webp"
                          alt="Suitpax AI"
                          className="w-full h-full object-contain p-0.5"
                          loading="eager"
                          fetchPriority="high"
                        />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-gray-700">Suitpax AI</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-gray-600" />
                      <span className="text-sm sm:text-base text-gray-600 font-light">
                        {showReasoning ? "Analyzing and thinking..." : "Thinking..."}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </ChatContainerContent>

            <ChatContainerScrollAnchor />
            <ScrollButton className="bottom-24 sm:bottom-28 md:bottom-32 right-4 sm:right-6 md:right-8" />
          </ChatContainerRoot>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md border-t border-gray-200 flex-shrink-0 safe-area-inset-bottom"
        >
          <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-5xl mx-auto w-full">
              <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={loading || isStreaming}
                onSubmit={handleSend}
                className="w-full bg-white/95 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl"
              >
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 pb-3">
                    {files.map((file, index) => {
                      const { Icon, sizeText } = getFileMeta(file)
                      return (
                        <div
                          key={index}
                          className="bg-gray-100 flex items-center gap-2 sm:gap-3 rounded-xl px-3 py-2 text-xs sm:text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon className="size-4 sm:size-5 text-gray-700" />
                          <span className="max-w-[100px] sm:max-w-[150px] truncate text-gray-800">{file.name}</span>
                          <span className="text-xs text-gray-600">{sizeText}</span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="hover:bg-gray-200 rounded-full p-1 transition-colors"
                          >
                            <X className="size-3 sm:size-4 text-gray-600" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <PromptInputTextarea
                  placeholder="Ask me about flights, hotels, travel planning, or code/design…"
                  className="text-gray-900 placeholder-gray-500 font-light text-base sm:text-lg resize-none min-h-[50px] sm:min-h-[60px]"
                  disabled={loading || isStreaming}
                />

                <PromptInputActions className="flex items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <PromptInputAction tooltip="Attach files">
                      <label
                        htmlFor="file-upload"
                        className="hover:bg-gray-100 flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-2xl transition-colors"
                      >
                        <input
                          ref={uploadInputRef}
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <Paperclip className="size-4 sm:size-5 text-gray-700" />
                      </label>
                    </PromptInputAction>

                    <PromptInputAction tooltip="Scan document">
                      <DocumentScanner
                        onScanned={(r) => {
                          if (r?.raw_text) setInput((prev) => (prev ? `${prev}\n\n${r.raw_text}` : r.raw_text || ""))
                        }}
                      />
                    </PromptInputAction>
                  </div>

                  <PromptInputAction tooltip="Send message">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!input.trim() || loading || isStreaming}
                      className="bg-black text-white hover:bg-gray-800 rounded-2xl h-8 w-8 sm:h-9 sm:w-9 p-0 disabled:opacity-50"
                    >
                      <ArrowUp className="size-4 sm:size-5" />
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        </motion.div>
      </div>
    </VantaHaloBackground>
  )
}

export default function SuitpaxAIPage() {
  return <AIChatView />
}
