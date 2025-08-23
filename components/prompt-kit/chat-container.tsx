"use client"

import { cn } from "@/lib/utils"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"

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

export function ChatContainerRoot({
  children,
  className,
  ...props
}: ChatContainerRootProps) {
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
        className={cn("relative overflow-y-auto", className)}
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

export function ChatContainerContent({
  children,
  className,
  ...props
}: ChatContainerContentProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}

export type ChatContainerScrollAnchorProps = {
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function ChatContainerScrollAnchor({
  className,
  ...props
}: ChatContainerScrollAnchorProps) {
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

  return (
    <div
      ref={anchorRef}
      className={cn("h-1 w-full", className)}
      {...props}
    />
  )
}

