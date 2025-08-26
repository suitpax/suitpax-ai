"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { FileUpload, FileUploadContent, FileUploadTrigger } from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowUp, Square } from "lucide-react"
import ChatHeader from "@/components/prompt-kit/chat-header"
import { useChatStream } from "@/hooks/use-chat-stream"
import PromptSuggestions from "@/components/prompt-kit/prompt-suggestions"
import SourceList from "@/components/prompt-kit/source-list"
import { Message as PKMessage, MessageAvatar, MessageContent as PKMessageContent, MessageActions as PKMessageActions, MessageAction as PKMessageAction } from "@/components/prompt-kit/message"
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import ChatFlightOffers from "@/components/prompt-kit/chat-flight-offers"
import DocumentScanner from "@/components/prompt-kit/document-scanner"
import { Switch } from "@/components/ui/switch"
import { ChatContainerRoot, ChatContainerContent } from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { DashboardLoadingScreen } from "@/components/ui/loaders"
import { useChatPreview } from "@/hooks/use-chat-preview"
import { useBreakpoint } from "@/hooks/use-breakpoint"

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
  const [includeReasoningInline, setIncludeReasoningInline] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const { isStreaming, start, cancel } = useChatStream()

  const { down } = useBreakpoint()
  const isSmall = down("sm")

  const previewNode = useChatPreview(value, { className: "prose prose-sm text-gray-900" })

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    run()
  }, [supabase])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
    // Extra scroll tick to avoid freeze on rapid updates
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
    if (!userId) return

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
      // Fallback
      try { await sendNonStreaming(userMessage) } catch {}
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (prompt: string) => setValue(prompt)

  return (
    <div className="bg-white">
      <div className="fixed inset-0 flex flex-col">
        {/* Chat Header */}
        <ChatHeader title="Suitpax AI" subtitle={isSmall ? undefined : "Ask anything. Travel. Business. Code."} />
        {/* Content area */}
        <ChatContainerRoot className="flex-1">
          <ChatContainerContent className={`mx-auto w-full max-w-3xl ${isSmall ? "px-2 py-3" : "px-4 py-6"} space-y-4`} role="feed" aria-label="Chat messages" aria-live="polite">
            {messages.length === 0 && !isLoading && (
              <div className="space-y-4">
                <div className="text-center py-10">
                  <h2 className={`${isSmall ? "text-2xl" : "text-3xl md:text-4xl"} font-medium tracking-tighter`}>Ask anything. Travel. Business. Code.</h2>
                  {!isSmall && <p className="mt-2 text-sm text-gray-600">Powered by Suitpax AI</p>}
                </div>
                <PromptSuggestions suggestions={defaultSuggestions} onSelect={handleSuggestion} />
              </div>
            )}

            {/* Live preview of current input */}
            {value.trim() && (
              <div className="border border-gray-200 rounded-xl p-4 bg-white/80">
                <div className="text-[11px] text-gray-500 mb-2">Preview</div>
                {previewNode}
              </div>
            )}

            {/* Main loader when there are no messages but loading (initial ask) */}
            {messages.length === 0 && isLoading && (
              <div className="py-16">
                <DashboardLoadingScreen className="bg-transparent" />
              </div>
            )}

            {messages.map((m, idx) => {
              const isAssistant = m.role === "assistant"
              const isLast = idx === messages.length - 1
              return (
                <PKMessage
                  key={m.id}
                  className={`mx-auto flex w-full max-w-3xl flex-col gap-2 ${isSmall ? "px-0" : "px-0 md:px-6"} ${isAssistant ? "items-start" : "items-end"}`}
                >
                  {isAssistant ? (
                    <div className="group flex w-full flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <MessageAvatar src="/logo/suitpax-bl-logo.webp" alt="AI" fallback="AI" />
                        <div className="text-[10px] text-gray-500">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <PKMessageContent className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0" markdown>
                        {m.content}
                      </PKMessageContent>
                      {(() => {
                        const match = m.content.match(/:::flight_offers_json\n([\s\S]*?)\n:::/)
                        if (!match) return null
                        try {
                          const parsed = JSON.parse(match[1])
                          return (
                            <div className="mt-2">
                              <ChatFlightOffers offers={parsed.offers || []} onSelect={(id) => { if (id) window.location.href = `/dashboard/flights/book/${id}` }} />
                            </div>
                          )
                        } catch { return null }
                      })()}
                      {m.sources && m.sources.length > 0 && <SourceList items={m.sources} />}
                      <PKMessageActions className={`-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${isLast ? "opacity-100" : ""}`}>
                        <PKMessageAction tooltip="Copy">
                          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigator.clipboard.writeText(m.content)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </PKMessageAction>
                        <PKMessageAction tooltip="Upvote">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </PKMessageAction>
                        <PKMessageAction tooltip="Downvote">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </PKMessageAction>
                      </PKMessageActions>
                    </div>
                  ) : (
                    <div className="group flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-[10px] text-gray-600">U</div>
                        <div className="text-[10px] text-gray-500">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <PKMessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
                        {m.content}
                      </PKMessageContent>
                    </div>
                  )}
                </PKMessage>
              )
            })}

            {/* Inline small loader above the thinking text, using text color */}
            {isLoading && (
              <div className="flex flex-col items-start gap-2">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin text-gray-600" />
                <div className="text-sm text-gray-600">Thinking…</div>
              </div>
            )}
            <div className="fixed right-6 bottom-24">
              <ScrollButton />
            </div>
          </ChatContainerContent>
        </ChatContainerRoot>

        {/* Bottom docked prompt */}
        <div className="border-t border-gray-200 bg-white/70 backdrop-blur-sm">
          <div className={`mx-auto w-full max-w-4xl ${isSmall ? "px-2 py-2" : "px-4 py-3"}`}>
            <div className={`flex items-center justify-between gap-3 ${isSmall ? "mb-1" : "mb-2"}`}>
              <div className="flex items-center gap-2 text-[12px] text-gray-700">
                <span>High-level reasoning</span>
                <Switch checked={includeReasoningInline} onCheckedChange={setIncludeReasoningInline} />
              </div>
              <DocumentScanner onScanned={(r) => { if (r?.raw_text) setValue((prev) => prev ? `${prev}\n\n${r.raw_text}` : r.raw_text || "") }} />
            </div>

            <FileUpload onFilesAdded={handleFilesAdded} accept=".jpg,.jpeg,.png,.pdf,.docx">
              <PromptInput
                value={value}
                onValueChange={setValue}
                isLoading={isLoading || isStreaming}
                onSubmit={handleSend}
                aria-label="AI prompt input"
                className="w-full border border-gray-200 rounded-3xl p-0 pt-1 bg-white"
              >
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {files.map((file, index) => (
                      <div key={index} className="bg-gray-100 flex items-center gap-2 rounded-lg px-3 py-2 text-sm" onClick={(e) => e.stopPropagation()}>
                        <Paperclip className="size-4" />
                        <span className="max-w-[160px] truncate">{file.name}</span>
                        <button onClick={() => removeFile(index)} className="hover:bg-gray-200 rounded-full p-1">
                          <Square className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <PromptInputTextarea placeholder="Ask about flights, policies, finance or code…" className={`${isSmall ? "min-h-[40px] pt-2 pl-3 text-[15px]" : "min-h-[44px] pt-3 pl-4 text-base"} leading-[1.3]`} />
                <PromptInputActions className={`mt-2 flex w-full items-center justify-between gap-2 ${isSmall ? "px-2 pb-2" : "px-3 pb-3"}`}>
                  <PromptInputAction tooltip="Attach files">
                    <FileUploadTrigger asChild>
                      <Button variant="outline" size="icon" className={`${isSmall ? "h-7 w-7" : "h-8 w-8"} rounded-full`}>
                        <Paperclip className="size-4" />
                      </Button>
                    </FileUploadTrigger>
                  </PromptInputAction>
                  <PromptInputAction tooltip={isLoading || isStreaming ? "Stop" : "Send"}>
                    <Button size="icon" aria-label={isLoading || isStreaming ? "Stop generation" : "Send message"} disabled={!value.trim() || isLoading || isStreaming} onClick={handleSend} className={`${isSmall ? "h-7 w-7" : "h-8 w-8"} rounded-full`}>
                      {!isLoading && !isStreaming ? <ArrowUp className="size-4" /> : <span className="size-3 rounded-xs bg-gray-900" />}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
              <FileUploadContent>
                <div className="flex min-height-[200px] w-full items-center justify-center backdrop-blur-sm">
                  <div className="bg-background/90 m-4 w-full max-w-md rounded-lg border p-8 shadow-lg">
                    <h3 className="mb-2 text-center text-base font-medium">Drop files to upload</h3>
                    <p className="text-muted-foreground text-center text-sm">Release to add files to your message</p>
                  </div>
                </div>
              </FileUploadContent>
            </FileUpload>
          </div>
        </div>
      </div>
    </div>
  )
}