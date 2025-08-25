"use client"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowUp, Square } from "lucide-react"
import ChatHeader from "@/components/prompt-kit/chat-header"
import { useChatStream } from "@/hooks/use-chat-stream"
import PromptSuggestions from "@/components/prompt-kit/prompt-suggestions"
import SourceList from "@/components/prompt-kit/source-list"
import ChatFlightOffers from "@/components/prompt-kit/chat-flight-offers"
import DocumentScanner from "@/components/prompt-kit/document-scanner"
import { Switch } from "@/components/ui/switch"
import { Markdown } from "@/components/prompt-kit/markdown"
import { ChatContainerRoot, ChatContainerContent } from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"

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

export default function SuitpaxAIPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [includeReasoningInline, setIncludeReasoningInline] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const { isStreaming, start, cancel } = useChatStream()

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    run()
  }, [supabase])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    const id = window.requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current!.scrollHeight }))
    return () => window.cancelAnimationFrame(id)
  }, [messages])

  const handleFilesAdded = (newFiles: File[]) => setFiles(prev => [...prev, ...newFiles])
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    if (uploadInputRef?.current) uploadInputRef.current.value = ""
  }

  const isFlightIntent = (text: string) => /\b([A-Z]{3})\b.*\b(to|→|-)\b.*\b([A-Z]{3})\b/i.test(text) || /\bflight|vuelo|vuelos\b/i.test(text)

  const sendNonStreaming = async (userMessage: Message) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage.content,
        history: messages,
        includeReasoningInline,
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
  }

  const handleSend = async () => {
    if (!value.trim() || isLoading || isStreaming) return
    // Allow anonymous as well; if required, enforce userId
    const userMessage: Message = { id: Date.now().toString(), content: value.trim(), role: "user", timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setValue("")
    setFiles([])
    setIsLoading(true)

    try {
      if (isFlightIntent(userMessage.content)) {
        await sendNonStreaming(userMessage)
      } else {
        let streamed = ""
        await start({ message: userMessage.content, history: messages }, async (token) => {
          streamed += token
          setMessages((prev) => {
            const others = prev.filter((m) => m.id !== "stream-temp")
            return [...others, { id: "stream-temp", content: streamed, role: "assistant", timestamp: new Date() }]
          })
        })
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== "stream-temp")
          return [...withoutTemp, { id: (Date.now() + 1).toString(), content: streamed, role: "assistant", timestamp: new Date() }]
        })
      }
    } catch {
      try { await sendNonStreaming(userMessage) } catch {}
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (prompt: string) => setValue(prompt)

  const MessageBubble = ({
    isUser,
    children,
    timestamp
  }: { isUser: boolean, children: React.ReactNode, timestamp?: string }) => (
    <div className={`flex mb-1 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "rounded-[20px] bg-gradient-to-tr from-blue-900 via-blue-600 to-blue-400 text-white font-semibold px-6 py-3 shadow-lg max-w-[74%] md:max-w-xl text-base leading-relaxed"
            : "rounded-[20px] bg-gradient-to-tr from-gray-100 via-gray-50 to-white text-gray-900 px-6 py-3 shadow-sm max-w-[80%] md:max-w-xl text-base leading-relaxed border border-gray-200 font-medium"
        }
      >
        <div>{children}</div>
        {timestamp && (
          <span className={`text-xs mt-2 block ${isUser ? "text-blue-100 opacity-80" : "text-gray-400 opacity-70"}`}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      <div className="fixed inset-0 flex flex-col">
        <ChatHeader title="Suitpax AI" loading={isLoading || isStreaming} />
        <ChatContainerRoot className="flex-1">
          <ChatContainerContent
            ref={listRef}
            className="mx-auto w-full max-w-3xl px-4 py-6 space-y-4"
            role="feed" aria-label="Chat messages" aria-live="polite"
          >
            {messages.length === 0 && !isLoading && (
              <div className="space-y-4">
                <div className="text-center py-10">
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-blue-900">Ask. Plan. Book.</h2>
                </div>
                <PromptSuggestions suggestions={defaultSuggestions} onSelect={handleSuggestion} />
              </div>
            )}

            {messages.map((m) => {
              const isAssistant = m.role === "assistant"
              const match = isAssistant && m.content.match(/:::flight_offers_json\n([\s\S]*?)\n:::/)
              let chatFlightOffers = null as any
              if (match) {
                try {
                  const parsed = JSON.parse(match[1])
                  chatFlightOffers = <ChatFlightOffers offers={parsed.offers || []} onSelect={(id) => { if (id) window.location.href = `/dashboard/flights/book/${id}` }} />
                } catch { }
              }
              return (
                <div key={m.id}>
                  <MessageBubble
                    isUser={!isAssistant}
                    timestamp={new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  >
                    {chatFlightOffers ? chatFlightOffers : <Markdown>{m.content}</Markdown>}
                    {isAssistant && m.sources && m.sources.length > 0 && <SourceList items={m.sources} />}
                  </MessageBubble>
                </div>
              )
            })}

            {isLoading && (
              <MessageBubble isUser={false} timestamp="">
                <span className="animate-pulse text-gray-500">Thinking…</span>
              </MessageBubble>
            )}
            <div className="fixed right-6 bottom-24">
              <ScrollButton />
            </div>
          </ChatContainerContent>
        </ChatContainerRoot>

        {/* Prompt input */}
        <div className="border-t border-gray-200 bg-white/70 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-4xl px-4 py-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-[13px] text-blue-900 font-medium">
                <span>High-level reasoning</span>
                <Switch checked={includeReasoningInline} onCheckedChange={setIncludeReasoningInline} />
              </div>
              <DocumentScanner onScanned={(r) => { if (r?.raw_text) setValue((prev) => prev ? `${prev}\n\n${r.raw_text}` : r.raw_text || "") }} />
            </div>
            <PromptInput
              value={value}
              onValueChange={setValue}
              isLoading={isLoading || isStreaming}
              onSubmit={handleSend}
              aria-label="AI prompt input"
              className="w-full border border-gray-200 rounded-3xl bg-white p-0 pt-1 shadow-sm"
            >
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-blue-900 shadow-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Paperclip className="size-4 text-blue-700" />
                      <span className="max-w-[160px] truncate">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="hover:bg-blue-100 rounded-full p-1">
                        <Square className="size-4 text-blue-900" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <PromptInputTextarea
                placeholder="Ask about flights, policies, finance or code…"
                className="min-h-[46px] pt-3 pl-4 text-base leading-[1.4] text-blue-900 font-medium"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
              <PromptInputActions className="mt-2 flex w-full items-center justify-between gap-2 px-3 pb-3">
                <PromptInputAction tooltip="Attach files">
                  <>
                    <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) handleFilesAdded(f) }} />
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-blue-200" onClick={(e) => { e.preventDefault(); uploadInputRef.current?.click() }}>
                      <Paperclip className="size-4 text-blue-700" />
                    </Button>
                  </>
                </PromptInputAction>
                <PromptInputAction tooltip={isLoading || isStreaming ? "Stop" : "Send"}>
                  <Button
                    size="icon"
                    aria-label={isLoading || isStreaming ? "Stop generation" : "Send message"}
                    disabled={!value.trim() && !(isLoading || isStreaming)}
                    onClick={(e) => { e.preventDefault(); if (isStreaming) cancel(); else handleSend() }}
                    className="h-8 w-8 rounded-full bg-blue-900 hover:bg-blue-700 text-white"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  )
}

