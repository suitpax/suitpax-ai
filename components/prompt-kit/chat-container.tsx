"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, User, Bot } from 'lucide-react'
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ReasoningResponse } from "./reasoning"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  reasoning?: string
  timestamp: Date
}

interface ChatContainerProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
}

// Typing animation component
const TypingText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
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
const ChatLoadingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2 text-gray-500">
    <Bot className="h-4 w-4" />
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
)

// Individual message component
const ChatMessage: React.FC<{ message: Message; isTyping?: boolean }> = ({ message, isTyping = false }) => {
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
        headers: { "Content-Type": "application/json" },
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
    <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <div className={`max-w-[80%] ${message.role === "user" ? "order-1" : ""}`}>
        <Card
          className={`p-4 ${
            message.role === "user"
              ? "bg-emerald-950 text-white ml-auto"
              : "bg-white/50 backdrop-blur-sm border-gray-200"
          }`}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {isTyping ? (
              <TypingText text={message.content} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold my-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-semibold my-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-semibold my-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <pre className="bg-gray-900 text-white p-4 rounded-lg my-4 overflow-x-auto">
                        <code className={`language-${match ? match[1] : ''}`}>{children}</code>
                      </pre>
                    ) : (
                      <code className="bg-gray-200 text-gray-800 rounded px-1.5 py-0.5 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  table: ({node, ...props}) => <div className="overflow-x-auto"><table className="table-auto w-full my-4 border-collapse border border-gray-300" {...props} /></div>,
                  thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
                  th: ({node, ...props}) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />,
                  td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {message.role === "assistant" && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="h-8 px-2 text-xs hover:bg-gray-100"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadAsPDF(message.content, message.reasoning)}
                className="h-8 px-2 text-xs hover:bg-gray-100"
              >
                <Download className="h-3 w-3 mr-1" />
                PDF
              </Button>
            </div>
          )}
        </Card>

        {message.reasoning && (
          <div className="mt-2">
            <ReasoningResponse reasoning={message.reasoning} />
          </div>
        )}
      </div>

      {message.role === "user" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      )}
    </div>
  )
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Hey! I'm Suitpax AI</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                I'm here to help you with business travel, expense management, and any questions you might have. What
                can I assist you with today?
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <div className="font-medium text-gray-900 mb-1">✈️ Flight Search</div>
                  <div className="text-sm text-gray-600">"Find flights from NYC to London next week"</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <div className="font-medium text-gray-900 mb-1">💰 Expense Help</div>
                  <div className="text-sm text-gray-600">"Help me track my travel expenses"</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <div className="font-medium text-gray-900 mb-1">🏨 Hotel Booking</div>
                  <div className="text-sm text-gray-600">"Recommend business hotels in Paris"</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <div className="font-medium text-gray-900 mb-1">📋 Travel Policy</div>
                  <div className="text-sm text-gray-600">"What's our company travel policy?"</div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <Card className="p-4 bg-white/50 backdrop-blur-sm border-gray-200">
                <ChatLoadingIndicator />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about business travel, expenses, or Suitpax..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-950 focus:border-transparent min-h-[48px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-emerald-950 hover:bg-emerald-900 text-white px-6 py-3 rounded-xl"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
