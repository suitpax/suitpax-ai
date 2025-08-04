"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { createContext, useContext, useState } from "react"
import { ChevronDown } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type ReasoningContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ReasoningContext = createContext<ReasoningContextType | null>(null)

export function useReasoning() {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error("useReasoning must be used within a Reasoning component")
  }
  return context
}

export type ReasoningProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function Reasoning({ children, className, ...props }: ReasoningProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ReasoningContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </ReasoningContext.Provider>
  )
}

export type ReasoningTriggerProps = {
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function ReasoningTrigger({ children, className, ...props }: ReasoningTriggerProps) {
  const { isOpen, setIsOpen } = useReasoning()

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn("flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors", className)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
}

export type ReasoningContentProps = {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function ReasoningContent({ children, className, ...props }: ReasoningContentProps) {
  const { isOpen } = useReasoning()

  if (!isOpen) return null

  return (
    <div
      className={cn("mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export type ReasoningResponseProps = {
  text: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export function ReasoningResponse({ text, className, ...props }: ReasoningResponseProps) {
  return (
    <div
      className={cn(
        "prose prose-gray prose-xs max-w-none prose-headings:font-medium prose-headings:tracking-tighter prose-h1:text-sm prose-h2:text-xs prose-h3:text-xs prose-p:text-xs prose-p:leading-relaxed prose-p:mb-2 prose-ul:text-xs prose-ul:mb-2 prose-ol:text-xs prose-ol:mb-2 prose-li:mb-0.5 prose-strong:font-medium prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded prose-pre:p-2 prose-pre:text-xs prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-2 prose-blockquote:italic prose-table:text-xs prose-th:font-medium prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1",
        className,
      )}
      {...props}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  )
}
