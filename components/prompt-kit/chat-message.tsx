"use client"

import { motion } from "framer-motion"
import { Bot, User, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { useState } from "react"
import CodeBlock from "@/components/prompt-kit/code-block"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url?: string; snippet?: string }>
}

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
  showReasoning?: boolean
}

export function ChatMessage({ message, isTyping = false, showReasoning = false }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [showReasoningDetails, setShowReasoningDetails] = useState(false)
  const [showSources, setShowSources] = useState(false)

  return (
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={20} height={20} className="object-contain" />
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-3xl">
        <div
          className={cn(
            "rounded-2xl p-4",
            isUser
              ? "bg-gray-900 text-white rounded-br-lg"
              : "bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-sm",
          )}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-xl font-semibold mb-3 tracking-tight" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2 tracking-tight" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2 tracking-tight" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-3" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-3" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4 bg-gray-50 py-2 rounded-r-lg"
                    {...props}
                  />
                ),
                a: ({ node, href, children, ...props }) => (
                  <a
                    className={cn(
                      "font-medium underline underline-offset-2 decoration-2 transition-colors",
                      isUser
                        ? "text-blue-200 hover:text-blue-100 decoration-blue-300"
                        : "text-blue-600 hover:text-blue-800 decoration-blue-400",
                    )}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table
                      className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden"
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="border border-gray-200 px-4 py-3 text-left bg-gray-50 font-semibold text-gray-900"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => <td className="border border-gray-200 px-4 py-3" {...props} />,
                img: ({ node, src, alt, ...props }) => (
                  <div className="my-4">
                    <img
                      className="rounded-xl max-w-full h-auto shadow-sm border border-gray-200"
                      src={src || "/placeholder.svg"}
                      alt={alt}
                      {...props}
                    />
                    {alt && <p className="text-sm text-gray-600 mt-2 text-center italic">{alt}</p>}
                  </div>
                ),
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-6 border-gray-200" {...props} />,
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "")
                  if (inline) {
                    return (
                      <code
                        className={cn(
                          "rounded-md px-2 py-1 text-sm font-mono",
                          isUser ? "bg-white/20 text-blue-100" : "bg-gray-100 text-gray-800",
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }
                  const lang = match ? match[1] : undefined
                  const content = String(children).replace(/\n$/, "")
                  return <CodeBlock code={content} language={lang} />
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Reasoning Section */}
        {!isUser && showReasoning && message.reasoning && (
          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReasoningDetails(!showReasoningDetails)}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100 p-2 h-auto"
            >
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">AI Reasoning</span>
              {showReasoningDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showReasoningDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-blue-200"
              >
                <div className="text-sm text-blue-800 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.reasoning}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Sources Section */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-800 hover:bg-gray-100 p-2 h-auto"
            >
              <span className="text-sm font-medium">Sources ({message.sources.length})</span>
              {showSources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showSources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-200 space-y-2"
              >
                {message.sources.map((source, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{source.title}</span>
                      )}
                      {source.snippet && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{source.snippet}</p>}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className={cn("text-xs text-gray-500", isUser ? "text-right" : "text-left")}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-600" />
        </div>
      )}
    </div>
  )
}

export function ChatLoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
        <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax AI" width={20} height={20} className="object-contain" />
      </div>
      <div className="max-w-2xl p-4 bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
