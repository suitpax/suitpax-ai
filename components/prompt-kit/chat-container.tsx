"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { ChatMessage } from "./chat-message"

// Context para compartir el estado del scroll
type ChatContainerContextType = {
  isScrolledToBottom: boolean
  scrollToBottom: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

const ChatContainerContext = createContext<ChatContainerContextType | null>(null)

export function useChatContainer() {
  const context = useContext(ChatContainerContext)
  if (!context) {
    throw new Error("useChatContainer must be used within a ChatContainerRoot")
  }
  return context
}

export type ChatContainerRootProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function ChatContainerRoot({ children, className, ...props }: ChatContainerRootProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const threshold = 100 // px from bottom
      const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold
      setIsScrolledToBottom(isAtBottom)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const contextValue: ChatContainerContextType = {
    isScrolledToBottom,
    scrollToBottom,
    containerRef,
  }

  return (
    <ChatContainerContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative overflow-y-auto", "no-scrollbar", "pb-safe", className)}
        {...props}
      >
        {children}
      </div>
    </ChatContainerContext.Provider>
  )
}

export type ChatContainerContentProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function ChatContainerContent({ children, className, ...props }: ChatContainerContentProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}

export type ChatContainerScrollAnchorProps = {
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function ChatContainerScrollAnchor({ className, ...props }: ChatContainerScrollAnchorProps) {
  const { isScrolledToBottom, scrollToBottom } = useChatContainer()
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isScrolledToBottom && anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isScrolledToBottom])

  // Auto-scroll when new content is added and user is at bottom
  useEffect(() => {
    if (isScrolledToBottom) {
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isScrolledToBottom, scrollToBottom])

  return <div ref={anchorRef} className={cn("h-1 w-full", className)} {...props} />
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

interface ChatContainerProps {
  messages: Message[]
  isLoading?: boolean
  onRetry?: () => void
  className?: string
}

export function ChatContainer({ messages, isLoading, onRetry, className }: ChatContainerProps) {
  return (
    <ChatContainerRoot className={cn("flex-1 p-6", className)}>
      <ChatContainerContent>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/40 text-lg mb-4">Start a conversation</div>
              <div className="text-white/30 text-sm">Ask me about flights, travel planning, or anything else</div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={message.role === "assistant" ? onRetry : undefined}
              />
            ))
          )}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-pulse text-white/60">Thinking...</div>
            </div>
          )}
        </div>
      </ChatContainerContent>
      <ChatContainerScrollAnchor />
    </ChatContainerRoot>
  )
}
