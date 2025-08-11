"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Paperclip, X, Square, ArrowLeft, File as FileIcon, Image as ImageIcon, FileText, FileCode, FileSpreadsheet, Music, Video, Archive, Mic, Volume2, Menu } from "lucide-react"
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
import ChatFlightOffers from "@/components/prompt-kit/chat-flight-offers"
import ChatSidebar from "@/components/prompt-kit/chat-sidebar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

const defaultSuggestions = [
  { id: "s1", title: "Planifica 2 días en NYC (negocios)", prompt: "Planifica un itinerario de 2 días en NYC para reuniones cerca de Midtown con hotel máx. $400/noche y tiempo de traslados optimizado." },
  { id: "s2", title: "Vuelos MAD→SFO (directos)", prompt: "Busca los 3 mejores vuelos de MAD a SFO el 2025-09-10, 1 adulto, business, directos preferidos, con políticas de empresa." },
  { id: "s3", title: "Resumen de PDF adjunto", prompt: "Resume el PDF adjunto en 5 bullets y lista acciones clave con fechas." },
  { id: "s4", title: "Genera PDF informe viaje", prompt: "Genera un PDF con el plan de viaje, horarios, presupuestos y contactos de proveedores." },
  { id: "s5", title: "Política viajes Q3", prompt: "Crea una política de viajes corporativa concisa para Q3 con límites por ruta y cargos extra permitidos." },
  { id: "s6", title: "Gastos a Excel", prompt: "Convierte estos gastos en una tabla con categorías, subtotal por categoría y total. Luego genera un PDF resumen." },
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
      const { data: { user } } = await supabase.auth.getUser()
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

  const ensureSession = async (titleSeed: string) => {
    if (currentSessionId) return currentSessionId
    if (!user?.id) return null
    const title = (titleSeed || "New session").slice(0, 80)
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id, title })
      .select()
      .single()
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

  const isPdfIntent = (text: string) => /\b(pdf|genera(r|)\s+un\s+pdf|genera(r|)\s+pdf|crear?\s+pdf|export(ar|a)\s+pdf|save\s+as\s+pdf)\b/i.test(text)

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
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
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: aiText, reasoning }),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      downloadBlob(blob, `suitpax-ai-${Date.now()}.pdf`)
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 3).toString(), role: 'assistant', content: 'He generado y descargado el PDF automáticamente ✅', timestamp: new Date() },
      ])
    } catch (e1: any) {
      try {
        // Fallback a /api/pdf con markdown
        const res2 = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: aiText, filename: `suitpax-ai-${Date.now()}.pdf` }),
        })
        if (!res2.ok) throw new Error('PDF generation fallback failed')
        const blob2 = await res2.blob()
        downloadBlob(blob2, `suitpax-ai-${Date.now()}.pdf`)
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 5).toString(), role: 'assistant', content: 'He generado y descargado el PDF (modo fallback) ✅', timestamp: new Date() },
        ])
      } catch (e2: any) {
        try {
          // Último fallback: guardar en Supabase y dar enlace
          const res3 = await fetch('/api/pdf/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: aiText, reasoning, filename: `suitpax-ai` }),
          })
          const data3 = await res3.json()
          if (data3?.success && data3.url) {
            setMessages((prev) => [
              ...prev,
              { id: (Date.now() + 6).toString(), role: 'assistant', content: `He generado el PDF y lo he subido. Descárgalo aquí: ${data3.url}`, timestamp: new Date() },
            ])
            return
          }
          throw new Error('Upload failed')
        } catch (e3: any) {
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 7).toString(), role: 'assistant', content: 'No he podido generar el PDF. Inténtalo de nuevo.', timestamp: new Date() },
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
      try { await speak(data.response) } catch {}
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

    const isFlightIntent = /\b([A-Z]{3})\b.*\b(to|→|-)\b.*\b([A-Z]{3})\b/i.test(userMessage.content) || /\bflight|vuelo|vuelos\b/i.test(userMessage.content)

    try {
      const sessionId = await ensureSession(userMessage.content)
      if (isFlightIntent) {
        await sendNonStreaming(userMessage, sessionId)
        return
      }
      // Prefer streaming for better UX
      let streamed = ""
      await start({ message: userMessage.content, history: messages }, async (token) => {
        streamed += token
        setTypingMessageId("streaming")
        setMessages((prev) => {
          const others = prev.filter((m) => m.id !== "streaming-temp")
          return [
            ...others,
            { id: "streaming-temp", content: streamed, role: "assistant", timestamp: new Date() },
          ]
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
        try { await speak(streamed) } catch {}
      }
      await logChat(sessionId, userMessage.content, streamed)
      // Auto PDF if requested
      await maybeGeneratePdf(userMessage.content, streamed)
    } catch (err) {
      try {
        const sessionId = await ensureSession(userMessage.content)
        await sendNonStreaming(userMessage, sessionId)
      } catch (e2: any) {
        const errorText = typeof e2?.message === "string" ? e2.message : "There was an issue generating the response. Please try again."
        setMessages((prev) => [...prev, { id: (Date.now() + 2).toString(), role: "assistant", content: errorText, timestamp: new Date() }])
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
          reconstructed.push({ id: `${row.created_at}-u`, role: "user", content: row.message, timestamp: new Date(row.created_at) })
          reconstructed.push({ id: `${row.created_at}-a`, role: "assistant", content: row.response, timestamp: new Date(row.created_at) })
        }
        setMessages(reconstructed)
      }
      setIsSessionLoading(false)
    }
    loadSessionMessages()
  }, [currentSessionId, user?.id, supabase])

  return (
    <VantaHaloBackground className="fixed inset-0">
      <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onSelectSession={(id) => { setCurrentSessionId(id); setSidebarOpen(false) }} />
      <div className="absolute inset-0 flex flex-col bg-white/70">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/60 backdrop-blur-sm border-b border-gray-200 flex-shrink-0" style={{ height: 'auto', minHeight: '4rem' }}>
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(true)} aria-label="Open chat sidebar">
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                  <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={40} height={40} className="w-full h-full object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tighter truncate"><em className="font-serif italic">Suitpax AI</em></h1>
                  <p className="text-xs md:text-sm text-gray-600 font-light hidden sm:block">Try the superpowers ✨</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {/* Removed header ToolSelector; toggles moved into input */}
                <div className="flex items-center gap-2">
                  <Switch checked={showReasoning} onCheckedChange={setShowReasoning} />
                  <span className="text-[11px] text-gray-600">Reasoning</span>
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
                <Link href="/dashboard" className="text-xs text-gray-600 hover:text-black inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2 py-1 hover:bg-gray-50" aria-label="Volver al dashboard">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Volver al dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 min-h-0 relative">
          <ChatContainerRoot className="h-full">
            <ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 relative min-h-[50vh] md:min-h-[60vh]">
              {isUserLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading Suitpax AI…</span>
                  </div>
                </div>
              )}
              {messages.length === 0 && !loading && !isUserLoading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <div className="text-center">
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter bg-clip-text text-transparent bg-[linear-gradient(90deg,#111,#7a7a7a,#111)] bg-[length:200%_100%] animate-pulse"
                      >
                        Ask anything. Travel. Business. Code.
                      </motion.h2>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">Powered by Suitpax AI</p>
                    </div>
                  </div>
                  <PromptSuggestions suggestions={defaultSuggestions} onSelect={handleSuggestion} />
                  <div className="text-[11px] text-gray-600">Markdown and code blocks supported. Use triple backticks with language for syntax highlighting and copying.</div>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`${message.role === "user" ? "max-w-[85%] sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white" : "max-w-[95%] sm:max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-2xl px-3 sm:px-5 py-3 sm:py-4 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900"}`}>
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={32} height={32} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {message.sources && message.sources.length > 0 && (
                            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-700">Sources</span>
                          )}
                          {showReasoning && message.reasoning && (
                            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-700">Reasoning</span>
                          )}
                        </div>
                      </div>
                    )}
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <Markdown content={message.content} />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-xs sm:text-sm">{message.content}</div>
                    )}

                    {message.role === "assistant" && (
                      <div className="mt-2">
                        {message.reasoning && showReasoning && (
                          <Reasoning>
                            <ReasoningTrigger>Show reasoning</ReasoningTrigger>
                            <ReasoningContent>
                              <ReasoningResponse>{message.reasoning}</ReasoningResponse>
                            </ReasoningContent>
                          </Reasoning>
                        )}
                        {message.sources && message.sources.length > 0 && (
                          <SourceList items={message.sources} />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {(loading || isStreaming || isSessionLoading) && (
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isSessionLoading ? "Loading conversation…" : "Generating answer…"}</span>
                </div>
              )}

              <ChatContainerScrollAnchor />
            </ChatContainerContent>
          </ChatContainerRoot>

          <ScrollButton />

          {/* Prompt input */}
          <div className="sticky bottom-0 inset-x-0 p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-white/80 to-transparent">
            <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <PromptInput>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2">
                    {files.map((file, i) => {
                      const meta = getFileMeta(file)
                      const Icon = meta.Icon
                      return (
                        <div key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1 text-[10px]">
                          <Icon className="h-3.5 w-3.5 text-gray-600" />
                          <span className="truncate max-w-[140px]">{file.name}</span>
                          <span className="text-gray-500">{meta.sizeText}</span>
                          <button onClick={() => handleRemoveFile(i)} className="ml-1 text-gray-500 hover:text-black">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <PromptInputTextarea placeholder="Ask Suitpax AI…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }} />
                <PromptInputActions>
                  <PromptInputAction className="gap-2">
                    <DocumentScanner onScanned={(r) => {
                      if (r?.raw_text) setInput((prev) => (prev ? `${prev}\n\n${r.raw_text}` : r.raw_text!))
                    }} />
                    <button
                      type="button"
                      onClick={() => setWebSearch(!webSearch)}
                      aria-pressed={webSearch}
                      className={`rounded-md border px-2 py-1 text-[10px] ${webSearch ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
                    >
                      Web
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeepSearch(!deepSearch)}
                      aria-pressed={deepSearch}
                      className={`rounded-md border px-2 py-1 text-[10px] ${deepSearch ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
                    >
                      Deep
                    </button>
                    <VoiceButton onTranscript={(t) => setInput((prev) => (prev ? prev + ' ' + t : t))} />
                  </PromptInputAction>
                  <PromptInputAction asChild>
                    <label htmlFor="file-upload" className="cursor-pointer" aria-label="Attach files">
                      <input id="file-upload" ref={uploadInputRef} type="file" onChange={handleFileChange} className="hidden" multiple />
                      <Paperclip className="h-4 w-4" />
                    </label>
                  </PromptInputAction>
                  <PromptInputAction asChild>
                    <button onClick={handleSend} aria-label="Send message" disabled={loading || isStreaming}>
                      {loading || isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                    </button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </VantaHaloBackground>
  )
}

export default function Page() {
  return (
    <VoiceAIProvider>
      <AIChatView />
    </VoiceAIProvider>
  )
}