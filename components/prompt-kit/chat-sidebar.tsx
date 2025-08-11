"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export type ChatSidebarProps = {
  open: boolean
  onClose: () => void
  user?: { name?: string | null; email?: string | null; image?: string | null }
}

type ChatSession = { id: string; title: string; updatedAt: number }

export default function ChatSidebar({ open, onClose, user }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("suitpax_ai_sessions")
      if (raw) setSessions(JSON.parse(raw))
    } catch {}
  }, [])

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
          {sessions.length === 0 ? (
            <div className="p-3 text-xs text-gray-500">No conversations yet.</div>
          ) : (
            <ul className="px-2 space-y-1">
              {sessions.map((s) => (
                <li key={s.id} className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50 p-2">
                  <div className="text-xs font-medium truncate">{s.title}</div>
                  <div className="text-[10px] text-gray-500">{new Date(s.updatedAt).toLocaleString()}</div>
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