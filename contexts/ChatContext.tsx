import { createContext, useContext, useMemo, useState } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  reasoning?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatContextType {
  sessions: ChatSession[]
  activeSessionId: string | null
  createSession: (title?: string) => string
  switchSession: (id: string) => void
  deleteSession: (id: string) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const createSession = (title: string = 'New Chat') => {
    const id = crypto.randomUUID()
    const now = new Date()
    const session: ChatSession = { id, title, messages: [], createdAt: now, updatedAt: now }
    setSessions(prev => [session, ...prev])
    setActiveSessionId(id)
    return id
  }

  const switchSession = (id: string) => {
    setActiveSessionId(id)
  }

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    setActiveSessionId(prev => (prev === id ? null : prev))
  }

  const value = useMemo<ChatContextType>(() => ({
    sessions,
    activeSessionId,
    createSession,
    switchSession,
    deleteSession,
  }), [sessions, activeSessionId])

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}