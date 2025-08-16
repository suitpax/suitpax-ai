"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EnhancedPromptInput } from "@/components/prompt-kit/enhanced-prompt-input"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { createClient } from "@/lib/supabase/client"
import { MCPRemoteServerList } from "@/components/dashboard/code/server-list"
import { MCPToolRunner } from "@/components/dashboard/code/tool-runner"

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
  const [limits, setLimits] = useState<any>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      const { data } = await supabase.rpc("get_user_subscription_limits", { user_uuid: user.id })
      const l = data?.[0] || null
      setLimits(l)
      const p = (l?.plan_id || "free").toLowerCase?.() || "free"
      setPlan(p)
      if (l?.code_tokens_limit && l?.code_tokens_limit > 0) {
        const ratio = (l.code_tokens_used || 0) / l.code_tokens_limit
        if (ratio >= 0.8) setShowLimitModal(true)
      }
      setLoading(false)
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

  const getLastAssistantCode = () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    if (!last) return ""
    const codeMatch = last.content.match(/```[\s\S]*?\n([\s\S]*?)```/)
    return codeMatch ? codeMatch[1] : last.content
  }

  const copyCode = async () => {
    const code = getLastAssistantCode()
    if (!code) return
    await navigator.clipboard.writeText(code)
  }

  const downloadCode = () => {
    const code = getLastAssistantCode()
    if (!code) return
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = /<html/i.test(code) ? "suitpax-code.html" : "suitpax-code.tsx"
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const saveSnippet = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant")
    if (!last) return
    await fetch("/api/snippets/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: last.content }) })
  }

  if (loading) return null

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-medium tracking-tighter text-black">Suitpax Code</h1>
        <p className="text-[12px] text-gray-600">An AI coding agent to design and ship real UIs. Copy, download or preview your code.</p>
      </div>

      {/* Tools */}
      <div className="grid grid-rows-[auto_1fr_auto]">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="grid gap-3 md:grid-cols-2">
            <MCPRemoteServerList />
            <div className="hidden md:block" />
          </div>
          <div className="mt-3">
            <MCPToolRunner />
          </div>
        </div>

        {/* Chat + Preview */}
        <div className="overflow-hidden grid grid-cols-1 xl:grid-cols-2">
          <ChatContainer messages={messages} className="h-[calc(100vh-330px)] p-6" />
          <div className="border-t xl:border-t-0 xl:border-l border-gray-200 bg-white">
            <div className="flex items-center justify-between p-3">
              <div className="text-xs font-medium">Preview</div>
              <div className="flex gap-2">
                <button onClick={copyCode} className="px-2 py-1 text-[10px] border rounded">Copy</button>
                <button onClick={saveSnippet} className="px-2 py-1 text-[10px] border rounded">Save</button>
                <button onClick={downloadCode} className="px-2 py-1 text-[10px] border rounded">Download</button>
              </div>
            </div>
            <iframe sandbox="allow-scripts allow-same-origin" className="w-full h-[calc(100vh-390px)]" srcDoc={previewHtml || "<div style='padding:12px;font-family:sans-serif;color:#555'>No preview</div>"} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <EnhancedPromptInput
            value={input}
            onChange={setInput}
            onSubmit={send}
            isLoading={isSending}
            placeholder={"Design a responsive landing hero for a B2B SaaS in Tailwind (with CTA). Return ONLY a full HTML page or a full TSX component."}
          />
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-[520px] max-w-[92vw] p-5">
            <div className="text-lg font-semibold mb-2">You're nearing your Suitpax Code limit</div>
            <div className="text-sm text-gray-600 mb-4">
              Code tokens used: {limits?.code_tokens_used || 0} / {limits?.code_tokens_limit || 0}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowLimitModal(false)} className="px-3 py-1.5 text-sm border rounded-lg">Later</button>
              <a href="/dashboard/billing?upgrade=code" className="px-3 py-1.5 text-sm border rounded-lg bg-black text-white">Upgrade</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}