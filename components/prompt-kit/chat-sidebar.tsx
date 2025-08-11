"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Pencil, Trash2 } from "lucide-react"

export type ChatSidebarProps = {
  open: boolean
  onClose: () => void
  user?: { id?: string | null; name?: string | null; email?: string | null; image?: string | null }
  onSelectSession?: (sessionId: string) => void
}

type ChatSession = { id: string; title: string; updated_at: string }

export default function ChatSidebar({ open, onClose, user, onSelectSession }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchSessions = async () => {
    if (!user?.id) {
      setSessions([])
      return
    }
    setIsLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("id,title,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
    if (error) setError("Failed to load sessions")
    setSessions((data as any) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, open])

  const handleRename = async (sessionId: string, currentTitle: string) => {
    const next = window.prompt("Rename session", currentTitle || "Untitled")
    if (next == null) return
    if (!next.trim()) return
    const previous = sessions
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title: next } : s)))
    const { error } = await supabase.from("chat_sessions").update({ title: next }).eq("id", sessionId)
    if (error) {
      setSessions(previous)
      alert("Error renaming session")
    }
  }

  const handleDelete = async (sessionId: string) => {
    if (!window.confirm("Delete this session? This cannot be undone.")) return
    const previous = sessions
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId)
    if (error) {
      setSessions(previous)
      alert("Error deleting session")
    }
  }

  return (
    <div className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "-translate-x-full")}
      role="dialog" aria-modal="true" aria-label="Chat history sidebar">
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200 flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
            <Image src={user?.image || "/logo/suitpax-symbol.webp"} alt="User" width={20} height={20} className="object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">{user?.name || user?.email || "Guest"}</div>
            {user?.email && <div className="text-[10px] text-gray-600 truncate">{user.email}</div>}
          </div>
          <button onClick={onClose} className="ml-auto text-xs text-gray-600 hover:text-black">Close</button>
        </div>
        <div className="p-3 text-[11px] text-gray-600">Chat history</div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[46px] rounded-lg border border-gray-200 bg-gray-50 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-3 text-xs text-red-600">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="p-3 text-xs text-gray-500">No conversations yet.</div>
          ) : (
            <ul className="px-2 space-y-1">
              {sessions.map((s) => (
                <li key={s.id} className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50 p-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectSession?.(s.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="text-xs font-medium truncate">{s.title || "Untitled"}</div>
                      <div className="text-[10px] text-gray-500">{new Date(s.updated_at).toLocaleString()}</div>
                    </button>
                    <button aria-label="Rename" className="p-1 text-gray-500 hover:text-black" onClick={() => handleRename(s.id, s.title)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button aria-label="Delete" className="p-1 text-gray-500 hover:text-red-600" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-3 border-t border-gray-200 text-[10px] text-gray-600">
          <div className="inline-flex items-center gap-1">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={14} height={14} />
            <span>Suitpax AI</span>
          </div>
        </div>
      </div>
    </div>
  )
}