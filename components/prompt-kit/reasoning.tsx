"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ReasoningResponseProps {
  reasoning: string
  className?: string
}

export function ReasoningResponse({ reasoning, className }: ReasoningResponseProps) {
  return (
    <Card className={`p-3 bg-gray-50 border-gray-200 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-4 w-4 text-emerald-950" />
        <Badge variant="outline" className="text-xs">
          AI Reasoning
        </Badge>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="text-sm font-semibold mb-1">{children}</h1>,
            h2: ({ children }) => <h2 className="text-sm font-semibold mb-1">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xs font-semibold mb-1">{children}</h3>,
            p: ({ children }) => <p className="text-xs mb-1 last:mb-0 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-3 mb-1 text-xs">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-3 mb-1 text-xs">{children}</ol>,
            li: ({ children }) => <li className="mb-0.5">{children}</li>,
            code: ({ children, className }) => {
              const isInline = !className
              return isInline ? (
                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
              ) : (
                <code className="block bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto">{children}</code>
              )
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-gray-300 pl-2 italic mb-1 text-xs">{children}</blockquote>
            ),
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
          }}
        >
          {reasoning}
        </ReactMarkdown>
      </div>
    </Card>
  )
}
