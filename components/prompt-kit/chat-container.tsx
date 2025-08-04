"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, User, Download, Copy, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { PromptInput } from "./prompt-input"
import { ReasoningResponse } from "./reasoning"

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

const ChatLoadingIndicator = () => {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-2 text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      <span>Suitpax AI is thinking{dots}</span>
    </div>
  )
}

const ChatMessage = ({ message, isTyping = false }: { message: Message; isTyping?: boolean }) => {
  const [copied, setCopied] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.content,
          reasoning: message.reasoning,
          timestamp: message.timestamp,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `suitpax-ai-response-${message.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
    }
  }

  return (
    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src="/logo/suitpax-symbol.webp" alt="Suitpax AI" />
          <AvatarFallback className="bg-emerald-950 text-white text-xs">AI</AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
        <Card
          className={`p-4 ${
            message.role === "user" ? "bg-emerald-950 text-white ml-auto" : "bg-white border border-gray-200"
          }`}
        >
          {message.role === "assistant" && (
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                Suitpax AI
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownloadPDF} className="h-6 w-6 p-0">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <div className={`prose prose-sm max-w-none ${message.role === "user" ? "prose-invert" : ""}`}>
            {isTyping ? (
              <TypingText text={message.content} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                    ) : (
                      <code className="block bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto">
                        {children}
                      </code>
                    )
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2">{children}</blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {message.reasoning && (
            <Collapsible open={showReasoning} onOpenChange={setShowReasoning}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs text-gray-500 hover:text-gray-700">
                  <span className="mr-1">View reasoning</span>
                  {showReasoning ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ReasoningResponse reasoning={message.reasoning} />
              </CollapsibleContent>
            </Collapsible>
          )}
        </Card>

        <div className="text-xs text-gray-500 mt-1 px-1">{message.timestamp.toLocaleTimeString()}</div>
      </div>

      {message.role === "user" && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className="bg-gray-200">
            <User className="h-4 w-4" />
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
      content: `Hey there! 👋 I'm **Suitpax AI**, your intelligent business travel assistant.

I'm here to help you with:
- ✈️ **Flight bookings** and travel planning
- 🏨 **Hotel reservations** and accommodations  
- 💼 **Expense management** and reporting
- 📊 **Travel analytics** and insights
- 🤖 **AI-powered recommendations**

What can I help you with today?`,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
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
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        reasoning: data.reasoning,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setTypingMessageId(assistantMessage.id)

      // Remove typing effect after message is complete
      setTimeout(
        () => {
          setTypingMessageId(null)
        },
        data.response.length * 20 + 1000,
      )
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} isTyping={typingMessageId === message.id} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src="/logo/suitpax-symbol.webp" alt="Suitpax AI" />
                  <AvatarFallback className="bg-emerald-950 text-white text-xs">AI</AvatarFallback>
                </Avatar>
                <Card className="p-4 bg-white border border-gray-200">
                  <ChatLoadingIndicator />
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <PromptInput
            onSubmit={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask me anything about business travel..."
          />
        </div>
      </div>
    </div>
  )
}
