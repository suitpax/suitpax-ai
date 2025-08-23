"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Pencil, Trash2, Camera } from "lucide-react"
import { useVoiceAI } from "@/contexts/voice-ai-context"
import { Switch } from "@/components/ui/switch"
import TokenIndicator from "@/components/prompt-kit/token-indicator"

export type ChatSidebarProps = {
  open: boolean
  onClose: () => void
  user?: { id?: string | null; name?: string | null; email?: string | null; image?: string | null }
  onSelectSession?: (sessionId: string) => void
}

type ChatSession = { id: string; title: string; updated_at: string }

export default function ChatSidebar({ open, onClose, user, onSelectSession }: ChatSidebarProps) {
  const { setVoice, updateSettings, settings } = useVoiceAI()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<{ id: string; name: string; preview?: string }[]>([])
  const [isVoicesLoading, setIsVoicesLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>(() => typeof window !== 'undefined' ? (localStorage.getItem('suitpax.selectedAgent') || 'emma') : 'emma')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image || null)

  const supabase = createClient()

  const AGENTS: { id: string; name: string; desc: string; voiceId: string; emoji: string }[] = [
    { id: 'emma', name: 'Emma', desc: 'Business travel expert', voiceId: 'EXAVITQu4vr4xnSDxMaL', emoji: '💼' },
    { id: 'marcus', name: 'Marcus', desc: 'Operations & bookings', voiceId: 'VR6AewLTigWG4xSOukaG', emoji: '🧭' },
    { id: 'sophia', name: 'Sophia', desc: 'Luxury services & VIP', voiceId: '21m00Tcm4TlvDq8ikWAM', emoji: '✨' },
  ]

  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsVoicesLoading(true)
        const res = await fetch('/api/elevenlabs/voices')
        if (res.ok) {
          const data = await res.json()
          setVoices(data.voices || [])
        }
      } finally {
        setIsVoicesLoading(false)
      }
    }
    loadVoices()
  }, [])

  useEffect(() => {
    const onProfileUpdated = (e: any) => {
      const next = e?.detail?.avatar_url
      if (next) setAvatarUrl(next)
    }
    window.addEventListener('profile:updated', onProfileUpdated as any)
    return () => window.removeEventListener('profile:updated', onProfileUpdated as any)
  }, [])

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

  const selectAgent = (agentId: string, voiceId: string) => {
    setSelectedAgent(agentId)
    try {
      localStorage.setItem('suitpax.selectedAgent', agentId)
    } catch {}
    setVoice(voiceId)
  }

  const selectVoice = (voiceId: string) => {
    setVoice(voiceId)
    try { localStorage.setItem('suitpax.selectedVoiceId', voiceId) } catch {}
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${user.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) return
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
      // Propagate to rest of app
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { avatar_url: data.publicUrl } }))
      // Optionally update auth metadata
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    } catch {}
  }

  return (
    <div className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "-translate-x-full")}
      role="dialog" aria-modal="true" aria-label="Chat history sidebar">
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-md bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="User" width={20} height={20} className="object-cover w-full h-full" />
              ) : (
                <Image src={user?.image || "/logo/suitpax-symbol.webp"} alt="User" width={20} height={20} className="object-contain" />
              )}
              <label htmlFor="sidebar-avatar-upload" className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-0.5 cursor-pointer hover:bg-gray-50">
                <Camera className="h-3 w-3 text-gray-600" />
              </label>
              <input id="sidebar-avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate">{user?.name || user?.email || "Guest"}</div>
              {user?.email && <div className="text-[10px] text-gray-600 truncate">{user.email}</div>}
            </div>
            <button onClick={onClose} className="ml-auto text-xs text-gray-600 hover:text-black">Close</button>
          </div>
          <div className="mt-2">
            <TokenIndicator />
          </div>
        </div>
        {/* Agents */}
        <div className="p-3">
          <div className="text-[11px] text-gray-600 mb-1">AI Agents</div>
          <div className="space-y-2">
            {AGENTS.map(a => (
              <button key={a.id} onClick={() => selectAgent(a.id, a.voiceId)} className={cn("w-full text-left rounded-lg border p-2", selectedAgent === a.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{a.emoji}</span>
                    <div>
                      <div className="text-xs font-medium">{a.name}</div>
                      <div className="text-[10px] text-gray-600">{a.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600">Voice</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Voices */}
        <div className="px-3">
          <div className="text-[11px] text-gray-600 mb-1">Voices</div>
          <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-100 rounded-md p-1">
            {isVoicesLoading ? (
              <div className="text-[11px] text-gray-500 p-2">Loading voices…</div>
            ) : voices.length === 0 ? (
              <div className="text-[11px] text-gray-500 p-2">No voices available</div>
            ) : (
              voices.slice(0, 12).map(v => (
                <div key={v.id} className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50">
                  <button onClick={() => selectVoice(v.id)} className="text-left text-[11px] font-medium truncate">{v.name}</button>
                  {v.preview && (
                    <button onClick={() => { const a = new Audio(v.preview!); a.play().catch(()=>{}) }} className="text-[10px] text-gray-600 hover:text-black">Preview</button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        {/* Settings */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-700">Auto hablar (TTS)</span>
            <Switch checked={settings?.autoSpeak !== false} onCheckedChange={(v) => updateSettings({ autoSpeak: v })} />
          </div>
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
