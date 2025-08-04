"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ReasoningResponseProps {
  reasoning: string
}

export function ReasoningResponse({ reasoning }: ReasoningResponseProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!reasoning) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        >
          <Brain className="w-3 h-3 mr-1" />
          {isOpen ? (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              Hide reasoning
            </>
          ) : (
            <>
              <ChevronRight className="w-3 h-3 mr-1" />
              Show reasoning
            </>
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">AI Reasoning Process</span>
          </div>
          <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-code:text-emerald-600 prose-code:bg-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white prose-pre:border prose-blockquote:border-l-emerald-400 prose-blockquote:bg-white prose-blockquote:pl-3 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{reasoning}</ReactMarkdown>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
