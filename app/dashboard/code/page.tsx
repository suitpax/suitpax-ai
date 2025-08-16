"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EnhancedPromptInput } from "@/components/prompt-kit/enhanced-prompt-input"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { createClient } from "@/lib/supabase/client"
import { MCPRemoteServerList } from "@/components/dashboard/code/server-list"

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
  const [previewHtml, setPreviewHtml] = useState<string>("")

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

  const tryMcpCommand = async (text: string) => {
    const match = text.match(/^\/(mcp)\s+(\S+)\s+(\{[\s\S]*\})$/i)
    if (!match) return false
    const toolName = match[2]
    let args: any = {}
    try { args = JSON.parse(match[3]) } catch {}
    const serverUrl = typeof window !== "undefined" ? localStorage.getItem("suitpax.mcp.serverUrl") : null
    if (!serverUrl) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), content: "No MCP server active. Set one above.", role: "assistant", timestamp: new Date() }])
      return true
    }
    const res = await fetch("/api/mcp/remote/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serverUrl, toolName, args }) })
    const data = await res.json()
    setMessages((m) => [...m, { id: crypto.randomUUID(), content: "```json\n" + JSON.stringify(data.result || data, null, 2) + "\n```", role: "assistant", timestamp: new Date() }])
    return true
  }

  const extractHtmlFromResponse = (text: string) => {
    const codeBlock = text.match(/```(html|jsx|tsx)?\n([\s\S]*?)```/i)
    if (codeBlock) return codeBlock[2]
    return ""
  }

  const send = async () => {
    if (!input.trim()) return
    // slash /mcp
    if (await tryMcpCommand(input.trim())) { setInput(""); return }

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
      const html = extractHtmlFromResponse(aiMsg.content)
      if (html) setPreviewHtml(html)
      setInput("")
    } finally {
      setIsSending(false)
    }
  }

  const copyCode = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    if (!last) return
    const codeMatch = last.content.match(/```[\s\S]*?\n([\s\S]*?)```/)
    const code = codeMatch ? codeMatch[1] : last.content
    await navigator.clipboard.writeText(code)
  }

  const saveSnippet = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    if (!last) return
    await fetch("/api/snippets/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: last.content }) })
  }

  if (loading) return null

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-3 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">Suitpax Code X</h1>
        <p className="text-sm text-gray-600">Advanced coding assistant powered by Claude 3.7 Sonnet</p>
      </div>

      <div className="flex-1 grid grid-rows-[auto_1fr_auto] bg-white">
        <div className="p-4 border-b border-gray-200 bg-white">
          <MCPRemoteServerList />
        </div>
        <div className="overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <ChatContainer messages={messages} className="h-[calc(100vh-360px)]" />
          <div className="border-l border-gray-200 hidden lg:block">
            <div className="flex items-center justify-between p-3">
              <div className="text-sm font-medium">Preview</div>
              <div className="flex gap-2">
                <button onClick={copyCode} className="px-2 py-1 text-xs border rounded">Copy code</button>
                <button onClick={saveSnippet} className="px-2 py-1 text-xs border rounded">Save</button>
              </div>
            </div>
            <iframe sandbox="allow-scripts allow-same-origin" className="w-full h-[calc(100vh-420px)]" srcDoc={previewHtml || "<div style='padding:12px;font-family:sans-serif;color:#555'>No preview</div>"} />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <EnhancedPromptInput
            value={input}
            onChange={setInput}
            onSubmit={send}
            isLoading={isSending}
            placeholder="/mcp <tool> {json} or ask Suitpax Code X to build a UI..."
          />
        </div>
      </div>
    </div>
  )
}