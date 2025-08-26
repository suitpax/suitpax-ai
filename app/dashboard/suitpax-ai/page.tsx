"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { FileUpload, FileUploadContent, FileUploadTrigger } from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowUp, Square } from "lucide-react"
import ChatHeader from "@/components/prompt-kit/chat-header"
import { useChatStream } from "@/hooks/use-chat-stream"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import SourceList from "@/components/prompt-kit/source-list"
import { Message as PKMessage, MessageAvatar, MessageContent as PKMessageContent, MessageActions as PKMessageActions, MessageAction as PKMessageAction } from "@/components/prompt-kit/message"
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react"
// import ChatFlightOffers from "@/components/prompt-kit/chat-flight-offers"
// import DocumentScanner from "@/components/prompt-kit/document-scanner"
import { Switch } from "@/components/ui/switch"
import { ChatContainerRoot, ChatContainerContent } from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { DashboardLoadingScreen } from "@/components/ui/loaders"
import { useChatPreview } from "@/hooks/use-chat-preview"
import { useBreakpoint } from "@/hooks/use-breakpoint"
import { useChatDraft } from "@/hooks/use-chat-draft"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse } from "@/components/prompt-kit/reasoning"

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
  const { draft: value, setDraft: setValue, clear: clearDraft } = useChatDraft("suitpax_ai_input_draft")
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
    clearDraft()
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
        <div className="border-b border-gray-200">
          <div className="mx-auto w-full max-w-4xl px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-medium tracking-tight">Suitpax AI</h1>
              {!isSmall && <p className="text-sm text-muted-foreground mt-1">Ask anything. Travel. Business. Code.</p>}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-gray-700">
              <span>High-level reasoning</span>
              <Switch checked={includeReasoningInline} onCheckedChange={setIncludeReasoningInline} />
            </div>
          </div>
        </div>
        {/* Content area */}
        <ChatContainerRoot className="flex-1">
          <ChatContainerContent className={`mx-auto w-full max-w-3xl ${isSmall ? "px-2 py-3" : "px-4 py-6"} space-y-4`} role="feed" aria-label="Chat messages" aria-live="polite">
            {messages.length === 0 && !isLoading && (
              <div className="space-y-4">
                <div className="text-center py-10">
                  <h2 className={`${isSmall ? "text-2xl" : "text-3xl md:text-4xl"} font-medium tracking-tighter`}>Ask anything. Travel. Business. Code.</h2>
                  {!isSmall && <p className="mt-2 text-sm text-gray-600">Powered by Suitpax AI</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {defaultSuggestions.map((s) => (
                    <PromptSuggestion key={s.id} onClick={() => handleSuggestion(s.prompt)}>{s.title}</PromptSuggestion>
                  ))}
                </div>
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
                      {includeReasoningInline && m.reasoning && (
                        <div className="mt-1">
                          <Reasoning>
                            <ReasoningTrigger />
                            <ReasoningContent>
                              <ReasoningResponse text={m.reasoning} />
                            </ReasoningContent>
                          </Reasoning>
                        </div>
                      )}
                      {/* Flight offers rendering disabled: component not present */}
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
        <div className="border-t border-transparent bg-transparent">
          <div className={`mx-auto w-full max-w-4xl ${isSmall ? "px-2 py-3" : "px-4 py-4"}`}>
            <div className="pointer-events-none relative">
              <FileUpload onFilesAdded={handleFilesAdded} accept=".jpg,.jpeg,.png,.pdf,.docx">
                <div className="pointer-events-auto">
                  <PromptInput
                    value={value}
                    onValueChange={setValue}
                    isLoading={isLoading || isStreaming}
                    onSubmit={handleSend}
                    aria-label="AI prompt input"
                    className="shadow-md border border-gray-200 bg-white/90 backdrop-blur-sm"
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
                    <PromptInputTextarea placeholder="Ask about flights, policies, finance or code…" className={`${isSmall ? "min-h-[52px] pt-3 pl-4 text-[15px]" : "min-h-[56px] pt-4 pl-5 text-base"} leading-[1.3]`} />
                    <PromptInputActions className={`mt-2 flex w-full items-center justify-between gap-2 ${isSmall ? "px-2 pb-2" : "px-3 pb-3"}`}>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button type="button" className="rounded-full border border-gray-300 px-2 py-0.5 text-[11px] text-gray-700 bg-white hover:bg-gray-100">+ Connect</button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect your Google apps</DialogTitle>
                              <DialogDescription>Power up Suitpax AI with your files, emails and calendar.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 gap-2">
                              <a href="/api/integrations/google/drive/auth" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2">
                                <img src="https://www.google.com/s2/favicons?sz=64&domain_url=https://drive.google.com" alt="Drive" className="size-4 grayscale" />
                                <span>Connect Google Drive</span>
                              </a>
                              <a href="/api/integrations/google/gmail/auth" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2">
                                <img src="https://www.google.com/s2/favicons?sz=64&domain_url=https://mail.google.com" alt="Gmail" className="size-4 grayscale" />
                                <span>Connect Gmail</span>
                              </a>
                              <a href="/api/integrations/google/calendar/auth" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2">
                                <img src="https://www.google.com/s2/favicons?sz=64&domain_url=https://calendar.google.com" alt="Calendar" className="size-4 grayscale" />
                                <span>Connect Calendar</span>
                              </a>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="ml-auto">
                        <PromptInputAction tooltip={isLoading || isStreaming ? "Stop" : "Send"}>
                          <Button size="icon" aria-label={isLoading || isStreaming ? "Stop generation" : "Send message"} disabled={!value.trim() || isLoading || isStreaming} onClick={handleSend} className={`${isSmall ? "h-9 w-9" : "h-10 w-10"} rounded-full`}>
                            {!isLoading && !isStreaming ? <ArrowUp className="size-4" /> : <span className="size-3 rounded-xs bg-gray-900" />}
                          </Button>
                        </PromptInputAction>
                      </div>
                    </PromptInputActions>
                  </PromptInput>
                </div>
              </FileUpload>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}