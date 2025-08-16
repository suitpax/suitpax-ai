"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EnhancedPromptInput } from "@/components/prompt-kit/enhanced-prompt-input"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
}

export default function SuitpaxCodePage() {
  const supabase = createClient()
  const router = useRouter()
  const [plan, setPlan] = useState<string>("free")
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      const { data } = await supabase.rpc("get_user_plan_limits", { user_uuid: user.id })
      const p = data?.[0]?.plan_name?.toLowerCase?.() || "free"
      setPlan(p)
      setLoading(false)
      if (p === "free") {
        router.push("/dashboard/billing?upgrade=code")
      }
    }
    load()
  }, [router, supabase])

  const send = async () => {
    if (!input.trim()) return
    setIsSending(true)
    const userMsg: Message = { id: crypto.randomUUID(), content: input, role: "user", timestamp: new Date() }
    setMessages((m) => [...m, userMsg])

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages, includeReasoning: false }),
      })
      const data = await res.json()
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        content: data.response || "",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((m) => [...m, aiMsg])
      setInput("")
    } finally {
      setIsSending(false)
    }
  }

  if (loading) return null

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-3 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Suitpax Code X</h1>
        <p className="text-sm text-gray-600">Advanced coding assistant powered by Claude 3.7 Sonnet</p>
      </div>

      <div className="flex-1 grid grid-rows-[1fr_auto] bg-white">
        <div className="overflow-hidden">
          <ChatContainer messages={messages} className="h-[calc(100vh-220px)]" />
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <EnhancedPromptInput
            value={input}
            onChange={setInput}
            onSubmit={send}
            isLoading={isSending}
            placeholder="Ask Suitpax Code X to build or refactor your feature..."
          />
        </div>
      </div>
    </div>
  )
}