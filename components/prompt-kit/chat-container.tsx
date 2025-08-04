"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Context para compartir el estado del scroll
type ChatContainerContextType = {
  isScrolledToBottom: boolean
  scrollToBottom: () => void
  containerRef: React.RefObject<HTMLDivElement>
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
      <div ref={containerRef} className={cn("relative overflow-y-auto", className)} {...props}>
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

// Nuevo componente para mensajes de chat
export type ChatMessageProps = {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    reasoning?: string
  }
  isTyping?: boolean
  onTypingComplete?: () => void
  className?: string
}

export function ChatMessage({ message, isTyping = false, onTypingComplete, className }: ChatMessageProps) {
  return (
    <div className={cn(`flex ${message.role === "user" ? "justify-end" : "justify-start"}`, className)}>
      <div
        className={`${
          message.role === "user"
            ? "max-w-[85%] sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white"
            : "max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900"
        }`}
      >
        {message.role === "assistant" && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
              <Image
                src="/agents/agent-2.png"
                alt="Suitpax AI"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
          </div>
        )}

        <div className="prose prose-sm max-w-none prose-headings:font-medium prose-headings:tracking-tighter prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:text-sm prose-p:font-light prose-p:leading-relaxed prose-p:mb-2 prose-ul:text-sm prose-ul:mb-2 prose-ol:text-sm prose-ol:mb-2 prose-li:mb-0.5 prose-strong:font-medium prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded prose-pre:p-2 prose-pre:text-xs prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-2 prose-blockquote:italic prose-table:text-sm prose-th:font-medium prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1">
          {message.role === "assistant" ? (
            isTyping ? (
              <TypingText text={message.content} speed={30} onComplete={onTypingComplete} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            )
          ) : (
            <p className="text-sm whitespace-pre-wrap leading-relaxed font-light">{message.content}</p>
          )}
        </div>

        <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}

// Componente para efecto de typing
const TypingText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({
  text,
  speed = 50,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
}

// Componente para indicador de loading
export type ChatLoadingIndicatorProps = {
  showReasoning?: boolean
  className?: string
}

export function ChatLoadingIndicator({ showReasoning = false, className }: ChatLoadingIndicatorProps) {
  return (
    <div className={cn("flex justify-start", className)}>
      <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 max-w-[90%] sm:max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white">
            <Image
              src="/agents/agent-2.png"
              alt="Suitpax AI"
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <span className="text-sm text-gray-600 font-light">
            {showReasoning ? "Analyzing and thinking..." : "Thinking..."}
          </span>
        </div>
      </div>
    </div>
  )
}
