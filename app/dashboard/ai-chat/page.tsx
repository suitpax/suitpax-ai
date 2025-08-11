"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Paperclip, X, Square, ArrowRight, File as FileIcon, Image as ImageIcon, FileText, FileCode, FileSpreadsheet, Music, Video, Archive, Mic, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import Markdown from "@/components/prompt-kit/markdown"
import CodeBlock from "@/components/prompt-kit/code-block"
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/prompt-kit/prompt-input"
import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse } from "@/components/prompt-kit/reasoning"
import { Switch } from "@/components/ui/switch"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import { VoiceAIProvider, useVoiceAI } from "@/contexts/voice-ai-context"
import VoiceButton from "@/components/prompt-kit/voice-button"
import DocumentScanner from "@/components/prompt-kit/document-scanner"
import PromptSuggestions from "@/components/prompt-kit/prompt-suggestions"
import SourceList from "@/components/prompt-kit/source-list"
import { useChatStream } from "@/hooks/use-chat-stream"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

const defaultSuggestions = [
  { id: "s1", title: "Plan a 2-day NYC business trip", prompt: "Plan a 2-day business trip itinerary in NYC with meetings near Midtown and a budget of $400 per night for hotel." },
  { id: "s2", title: "Find flights MAD→SFO", prompt: "Find the 3 best flights from MAD to SFO on 2025-09-10, 1 adult, business class, direct preferred." },
  { id: "s3", title: "Summarize attached PDF", prompt: "Summarize the attached PDF in 5 bullets and list key action items." },
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
  const { speak, state: voiceState, startListening, stopListening } = useVoiceAI()
  const { isStreaming, start, cancel } = useChatStream()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
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
    else if (type.includes("javascript") || type.includes("typescript") || type.includes("python") || type.includes("java") || type.includes("rust")) Icon = FileCode

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
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: e.message, timestamp: new Date() }])
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
    try { await speak(data.response) } catch {}
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

    try {
      // Prefer streaming for better UX
      let streamed = ""
      await start({ message: userMessage.content, history: messages }, async (token) => {
        streamed += token
        setTypingMessageId("streaming")
        // Optimistic rendering
        setMessages((prev) => {
          const others = prev.filter((m) => m.id !== "streaming-temp")
          return [
            ...others,
            { id: "streaming-temp", content: streamed, role: "assistant", timestamp: new Date() },
          ]
        })
      })
      // finalize
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== "streaming-temp")
        return [
          ...withoutTemp,
          { id: (Date.now() + 1).toString(), content: streamed, role: "assistant", timestamp: new Date() },
        ]
      })
      setTypingMessageId(null)
      try { await speak(streamed) } catch {}
    } catch (err) {
      // fallback to non-streaming
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
      <div className="absolute inset-0 flex flex-col bg-white/70">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/60 backdrop-blur-sm border-b border-gray-200 flex-shrink-0" style={{ height: 'auto', minHeight: '4rem' }}>
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                  <Image src="/agents/agent-2.png" alt="Suitpax AI" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tighter truncate"><em className="font-serif italic">Suitpax AI</em></h1>
                  <p className="text-xs md:text-sm text-gray-600 font-light hidden sm:block">Try the superpowers</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 sm:space-x-5 flex-shrink-0">
                <Link href="/dashboard" className="text-xs text-gray-600 hover:text-black inline-flex items-center gap-1">Back to dashboard <ArrowRight className="h-3 w-3" /></Link>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 hidden sm:inline">Reasoning…</span>
                  <Switch checked={showReasoning} onCheckedChange={setShowReasoning} />
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-xl px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium ${voiceState.isSpeaking ? 'bg-green-500/10 text-green-700' : 'bg-gray-900/5 text-gray-900'}`}>
                    <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${voiceState.isSpeaking ? 'bg-green-600 animate-pulse' : 'bg-gray-900'} mr-1`}></span>
                    {voiceState.isSpeaking ? 'Speaking' : 'Online'}
                  </span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={voiceState.isListening ? stopListening : startListening}>
                    {voiceState.isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 min-h-0 relative">
          <ChatContainerRoot className="h-full">
            <ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 relative min-h-[50vh] md:min-h-[60vh]">
              {messages.length === 0 && !loading && (
                <div className="space-y-3">
                  <PromptSuggestions suggestions={defaultSuggestions} onSelect={handleSuggestion} />
                  <div className="text-[11px] text-gray-600">Markdown and code blocks supported. Use triple backticks with language for syntax highlighting and copying.</div>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`${message.role === "user" ? "max-w-[85%] sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white" : "max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900"}`}>
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                          <Image src="/agents/agent-2.png" alt="Suitpax AI" width={24} height={24} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
                      </div>
                    )}

                    {message.role === "assistant" && message.reasoning && (
                      <div className="mb-3">
                        <Reasoning>
                          <ReasoningTrigger className="text-xs text-gray-400 hover:text-gray-600"><span>View AI logic</span></ReasoningTrigger>
                          <ReasoningContent>
                            <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-2 border border-gray-100">
                              <ReasoningResponse text={message.reasoning} className="text-xs text-gray-700" />
                            </div>
                          </ReasoningContent>
                        </Reasoning>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none prose-p:mb-2 prose-pre:mb-0">
                      {message.role === "assistant" && typingMessageId === message.id ? (
                        <p className="text-sm font-light leading-relaxed text-gray-900">Typing…</p>
                      ) : (
                        <Markdown content={message.content} />
                      )}
                    </div>
                    {message.sources && message.sources.length > 0 && <SourceList items={message.sources} />}
                    <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 max-w-[90%] sm:max-w-xs">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white"></div>
                      <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600 font-light">{showReasoning ? "Analyzing and thinking..." : "Thinking..."}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </ChatContainerContent>

            <ChatContainerScrollAnchor />
            <ScrollButton className="bottom-24 md:bottom-28 right-4 sm:right-6" />
          </ChatContainerRoot>
        </div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/60 backdrop-blur-sm border-t border-gray-200 flex-shrink-0" style={{ minHeight: '4rem' }}>
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <PromptInput value={input} onValueChange={setInput} isLoading={loading || isStreaming} onSubmit={handleSend} className="w-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-2">
                    {files.map((file, index) => {
                      const { Icon, sizeText } = getFileMeta(file)
                      return (
                        <div key={index} className="bg-gray-100 flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm" onClick={e => e.stopPropagation()}>
                          <Icon className="size-3.5 sm:size-4 text-gray-700" />
                          <span className="max-w-[120px] truncate text-gray-800">{file.name}</span>
                          <span className="text-[10px] text-gray-600">{sizeText}</span>
                          <button onClick={() => handleRemoveFile(index)} className="hover:bg-gray-200 rounded-full p-1 transition-colors"><X className="size-3 sm:size-4 text-gray-600" /></button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <PromptInputTextarea placeholder="Ask me about flights, hotels, travel planning, or code/design…" className="text-gray-900 placeholder-gray-500 font-light text-sm sm:text-base" disabled={loading || isStreaming} />

                <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                  <PromptInputAction tooltip="Attach files">
                    <label htmlFor="file-upload" className="hover:bg-gray-100 flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-2xl transition-colors">
                      <input ref={uploadInputRef} type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                      <Paperclip className="size-3.5 sm:size-4 text-gray-700" />
                    </label>
                  </PromptInputAction>

                  <PromptInputAction tooltip="Scan document">
                    <DocumentScanner onScanned={(r) => { if (r?.raw_text) setInput((prev) => prev ? `${prev}\n\n${r.raw_text}` : r.raw_text || "") }} />
                  </PromptInputAction>

                  <PromptInputAction tooltip="Speak to type">
                    <VoiceButton onTranscript={(t) => setInput((prev) => prev ? `${prev} ${t}` : t)} />
                  </PromptInputAction>

                  <div className="ml-auto" />

                  <PromptInputAction tooltip={loading || isStreaming ? "Stop generation" : "Send message"}>
                    <Button variant="default" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg:black hover:bg-gray-800 text-white" onClick={loading || isStreaming ? cancel : handleSend} disabled={!input.trim() && !(loading || isStreaming)}>
                      {loading || isStreaming ? <Square className="size-3 sm:size-4 fill-current" /> : <ArrowUp className="size-3 sm:size-4" />}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
              <p className="mt-2 text-[10px] text-gray-600">Streaming Markdown enabled. Code blocks have copy and language labels.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </VantaHaloBackground>
  )
}

export default function AIChatPage() {
  return (
    <VoiceAIProvider initialLanguage="es-ES">
      <AIChatView />
    </VoiceAIProvider>
  )
}