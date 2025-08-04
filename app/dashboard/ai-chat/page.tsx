"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Paperclip, X, Square, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
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
  ChatMessage,
  ChatLoadingIndicator,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse } from "@/components/prompt-kit/reasoning"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string // Para el proceso de pensamiento real del AI
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! I'm your AI assistant from Suitpax. How can I help you plan your next business trip?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = ""
    }
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
    setLoading(true)
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          context: "travel_booking",
          includeReasoning: showReasoning,
        }),
        signal,
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
        reasoning: data.reasoning,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setTypingMessageId(assistantMessage.id)
      setInput("")
    } catch (error) {
      if ((error as any).name === "AbortError") {
        // Petición cancelada, restaurar input para editar
        setInput(userMessage.content)
      } else {
        console.error("Error enviando mensaje:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date(),
          reasoning: showReasoning
            ? "An error occurred while processing the request. The system attempted to maintain connection and provide a helpful response despite technical difficulties."
            : undefined,
        }
        setMessages((prev) => [...prev, errorMessage])
        setTypingMessageId(errorMessage.id)
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setLoading(false)
      setTypingMessageId(null)
    }
  }

  const handleTypingComplete = () => {
    setTypingMessageId(null)
  }

  const generateAndDownloadPDF = async () => {
    if (pdfLoading || messages.length === 0) return

    setPdfLoading(true)
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          title: "Suitpax AI Chat Export",
          userInfo: {
            email: user?.email,
            name: user?.user_metadata?.full_name,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `suitpax-ai-chat-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/50 backdrop-blur-sm border-b border-gray-200 flex-shrink-0"
        style={{ height: "auto", minHeight: "4rem" }}
      >
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                <Image
                  src="/agents/agent-2.png"
                  alt="Suitpax AI"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tighter truncate">
                  <em className="font-serif italic">Suitpax AI</em>
                </h1>
                <p className="text-xs md:text-sm text-gray-600 font-light hidden sm:block">Try the superpowers</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <label className="text-xs text-gray-600 hidden sm:inline">AI Reasoning</label>
                <button
                  onClick={() => setShowReasoning(!showReasoning)}
                  className={`relative inline-flex h-4 w-7 sm:h-5 sm:w-9 items-center rounded-full transition-colors ${
                    showReasoning ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${
                      showReasoning ? "translate-x-3.5 sm:translate-x-5" : "translate-x-0.5 sm:translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <span className="inline-flex items-center rounded-xl bg-emerald-950/10 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-emerald-950">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-950 animate-pulse mr-1"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 min-h-0">
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {message.role === "assistant" && message.reasoning && (
                  <div className="mb-3 max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <Reasoning>
                      <ReasoningTrigger className="text-xs text-gray-500 hover:text-gray-700">
                        <span>View AI logic</span>
                      </ReasoningTrigger>
                      <ReasoningContent>
                        <ReasoningResponse text={message.reasoning} className="text-xs text-gray-700" />
                      </ReasoningContent>
                    </Reasoning>
                  </div>
                )}

                <ChatMessage
                  message={message}
                  isTyping={typingMessageId === message.id}
                  onTypingComplete={handleTypingComplete}
                />
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ChatLoadingIndicator showReasoning={showReasoning} />
              </motion.div>
            )}
          </ChatContainerContent>

          <ChatContainerScrollAnchor />

          <ScrollButton className="bottom-20 sm:bottom-24 right-4 sm:right-6" />
        </ChatContainerRoot>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/50 backdrop-blur-sm border-t border-gray-200 flex-shrink-0"
        style={{ minHeight: "4rem" }}
      >
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <PromptInput
              value={input}
              onValueChange={setInput}
              isLoading={loading}
              onSubmit={handleSend}
              className="w-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Paperclip className="size-3 sm:size-4 text-gray-600" />
                      <span className="max-w-[80px] sm:max-w-[120px] truncate text-gray-700">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="hover:bg-gray-200 rounded-full p-1 transition-colors"
                      >
                        <X className="size-3 sm:size-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <PromptInputTextarea
                placeholder="Ask me about flights, hotels, or travel planning..."
                className="text-gray-900 placeholder-gray-500 font-light text-sm sm:text-base"
                disabled={loading}
              />

              <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <PromptInputAction tooltip="Attach files">
                    <label
                      htmlFor="file-upload"
                      className="hover:bg-gray-100 flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-2xl transition-colors"
                    >
                      <input
                        ref={uploadInputRef}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Paperclip className="text-gray-600 size-4 sm:size-5" />
                    </label>
                  </PromptInputAction>

                  <PromptInputAction tooltip="Download chat as PDF">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAndDownloadPDF}
                      disabled={pdfLoading || messages.length === 0}
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm bg-white hover:bg-gray-50 border-gray-200"
                    >
                      {pdfLoading ? (
                        <Loader2 className="size-3 sm:size-4 animate-spin mr-1" />
                      ) : (
                        <Download className="size-3 sm:size-4 mr-1" />
                      )}
                      PDF
                    </Button>
                  </PromptInputAction>
                </div>

                <PromptInputAction tooltip={loading ? "Stop generation" : "Send message"}>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black hover:bg-gray-800 text-white"
                    onClick={loading ? handleStop : handleSend}
                    disabled={!input.trim() && !loading}
                  >
                    {loading ? (
                      <Square className="size-3 sm:size-4 fill-current" />
                    ) : (
                      <ArrowUp className="size-3 sm:size-4" />
                    )}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
