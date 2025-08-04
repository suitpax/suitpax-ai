"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, User, Bot } from "lucide-react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ReasoningResponse } from "./reasoning"
import { PromptInput } from "./prompt-input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  reasoning?: string
  timestamp: Date
}

interface ChatContainerProps {
  className?: string
}

// Typing animation component
const TypingText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 20)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayedText}</span>
}

// Loading indicator component
const ChatLoadingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
    <span className="text-sm">Suitpax AI is thinking...</span>
  </div>
)

// Chat message component
const ChatMessage = ({ message, isTyping = false }: { message: Message; isTyping?: boolean }) => {
  const isUser = message.role === "user"

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadAsPDF = async (content: string, reasoning?: string) => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, reasoning }),
      })

      if (!response.ok) throw new Error("Failed to generate PDF")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `suitpax-ai-response-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download PDF")
    }
  }

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      {!isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src="/agents/agent-kai-new.png" alt="Suitpax AI" />
          <AvatarFallback>
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser ? "bg-emerald-950 text-white ml-auto" : "bg-white border border-gray-200"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:pl-4 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700">
              {isTyping ? (
                <TypingText text={message.content} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              )}
            </div>
          )}
        </div>

        {/* Reasoning section for AI messages */}
        {!isUser && message.reasoning && (
          <div className="mt-3">
            <ReasoningResponse reasoning={message.reasoning} />
          </div>
        )}

        {/* Action buttons for AI messages */}
        {!isUser && !isTyping && (
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadAsPDF(message.content, message.reasoning)}
              className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <Download className="w-3 h-3 mr-1" />
              PDF
            </Button>
            <Badge variant="secondary" className="text-xs">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hey! I'm Suitpax AI, your intelligent business travel assistant. I'm here to help you with flight bookings, expense management, travel policies, and any other business travel needs you might have. What can I help you with today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, isTyping])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()

      setIsLoading(false)
      setIsTyping(true)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        reasoning: data.reasoning,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Stop typing animation after content is fully displayed
      setTimeout(
        () => {
          setIsTyping(false)
        },
        data.content.length * 20 + 500,
      )
    } catch (error) {
      setIsLoading(false)
      toast.error("Failed to send message. Please try again.")
      console.error("Chat error:", error)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="py-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isTyping={isTyping && index === messages.length - 1 && message.role === "assistant"}
            />
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start mb-6">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarImage src="/agents/agent-kai-new.png" alt="Suitpax AI" />
                <AvatarFallback>
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <ChatLoadingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <PromptInput
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Ask me anything about business travel..."
        />
      </div>
    </div>
  )
}
