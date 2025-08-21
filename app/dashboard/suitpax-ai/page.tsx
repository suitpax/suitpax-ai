"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import MiniCountdownBadge from "@/components/ui/mini-countdown"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { FileUpload, FileUploadContent, FileUploadTrigger } from "@/components/prompt-kit/file-upload"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { Message, MessageAvatar, MessageContent } from "@/components/prompt-kit/message"
import { Markdown } from "@/components/prompt-kit/markdown"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/prompt-kit/reasoning"
import { Tool } from "@/components/prompt-kit/tools/tool"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { Source, SourceContent, SourceTrigger } from "@/components/prompt-kit/source"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowUp, Square } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  reasoning?: string
  toolUsed?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

export default function SuitpaxAIPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    run()
  }, [supabase])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleFilesAdded = (newFiles: File[]) => setFiles(prev => [...prev, ...newFiles])
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const sendMessage = async () => {
    const input = value.trim()
    if (!input || !userId || isLoading) return
    const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setValue("")
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages.slice(-10), includeReasoning: true }),
      })
      const json = await res.json()
      const assistantMsg: ChatMessage = {
        id: `${Date.now()}-a`,
        role: "assistant",
        content: json.response || "",
        reasoning: json.reasoning,
        toolUsed: json.toolUsed,
        sources: json.sources || [],
      }
      setMessages(prev => [...prev, assistantMsg])
      setFiles([])
    } catch (e) {
      setMessages(prev => [...prev, { id: `${Date.now()}-e`, role: "assistant", content: "Sorry, something went wrong." }])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestions = useMemo(() => [
    "Find flights MAD → LHR tomorrow",
    "Summarize this email thread",
    "Create travel policy outline",
    "Generate an expense report template",
    "Explain React Server Components",
  ], [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tighter">Suitpax AI</h1>
          <p className="text-sm text-gray-600 mt-2">Ask about business travel, expenses, analytics, or code.</p>
          <div className="mt-3 flex justify-center"><MiniCountdownBadge target={new Date("2025-10-21T00:00:00Z")} title="Suitpax Launch" /></div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map(s => (
            <PromptSuggestion key={s} onClick={() => setValue(s)}>{s}</PromptSuggestion>
          ))}
        </div>

        {/* Messages */}
        <div ref={listRef} className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-4 max-h-[55vh] overflow-y-auto space-y-6">
          {messages.map((m) => {
            const isAssistant = m.role === "assistant"
            return (
              <Message key={m.id} className={isAssistant ? "justify-start" : "justify-end"}>
                {isAssistant && <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" />}
                <div className="max-w-[85%] sm:max-w-[75%]">
                  {isAssistant ? (
                    <div className="space-y-2">
                      <Markdown className="prose prose-sm dark:prose-invert">{m.content}</Markdown>
                      {m.reasoning && (
                        <Reasoning open={false}>
                          <ReasoningTrigger>Show reasoning</ReasoningTrigger>
                          <ReasoningContent markdown className="ml-2 border-l-2 border-l-slate-200 px-2 pb-1 dark:border-l-slate-700">{m.reasoning}</ReasoningContent>
                        </Reasoning>
                      )}
                      {m.toolUsed && (
                        <Tool className="mt-2" toolPart={{ type: m.toolUsed, state: "output-available" }} />
                      )}
                      {Array.isArray(m.sources) && m.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {m.sources.slice(0,4).map((s, i) => (
                            <Source key={s.url || s.title + i} href={s.url || "#"}>
                              <SourceTrigger showFavicon />
                              <SourceContent title={s.title || "Source"} description={s.snippet || s.url || ""} />
                            </Source>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <MessageContent>{m.content}</MessageContent>
                  )}
                </div>
              </Message>
            )
          })}
          <div className="sticky bottom-4 self-end ml-auto"><ScrollButton /></div>
        </div>

        {/* Input */}
        <FileUpload onFilesAdded={handleFilesAdded} accept=".jpg,.jpeg,.png,.pdf,.docx">
          <PromptInput value={value} onValueChange={setValue} isLoading={isLoading} onSubmit={sendMessage} className="w-full max-w-3xl mx-auto">
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2">
                {files.map((file, index) => (
                  <div key={index} className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm" onClick={(e) => e.stopPropagation()}>
                    <Paperclip className="size-4" />
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="hover:bg-secondary/50 rounded-full p-1"><Square className="size-4" /></button>
                  </div>
                ))}
              </div>
            )}
            <PromptInputTextarea placeholder="Ask Suitpax AI..." />
            <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
              <PromptInputAction tooltip="Attach files">
                <FileUploadTrigger asChild>
                  <div className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl">
                    <Paperclip className="text-primary size-5" />
                  </div>
                </FileUploadTrigger>
              </PromptInputAction>
              <PromptInputAction tooltip={isLoading ? "Stop" : "Send"}>
                <Button variant="default" size="icon" className="h-8 w-8 rounded-full" onClick={sendMessage} disabled={isLoading || !value.trim()}>
                  {isLoading ? <Square className="size-5 fill-current" /> : <ArrowUp className="size-5" />}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
          <FileUploadContent>
            <div className="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
              <div className="bg-background/90 m-4 w-full max-w-md rounded-lg border p-8 shadow-lg">
                <h3 className="mb-2 text-center text-base font-medium">Drop files to upload</h3>
                <p className="text-muted-foreground text-center text-sm">Release to add files to your message</p>
              </div>
            </div>
          </FileUploadContent>
        </FileUpload>
      </div>
    </div>
  )
}
