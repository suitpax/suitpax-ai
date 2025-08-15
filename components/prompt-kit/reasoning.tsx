"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Brain } from "lucide-react"
import React, { createContext, useContext, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Context para el componente Reasoning
type ReasoningContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ReasoningContext = createContext<ReasoningContextType | null>(null)

function useReasoning() {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error("useReasoning must be used within a Reasoning component")
  }
  return context
}

export type ReasoningProps = {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
} & React.ComponentProps<typeof Collapsible>

export function Reasoning({ children, className, open, onOpenChange, ...props }: ReasoningProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const setIsOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const contextValue: ReasoningContextType = {
    isOpen,
    setIsOpen,
  }

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("w-full", className)} {...props}>
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  )
}

export type ReasoningTriggerProps = {
  children?: React.ReactNode
  className?: string
} & React.ComponentProps<typeof CollapsibleTrigger>

export function ReasoningTrigger({ children, className, ...props }: ReasoningTriggerProps) {
  const { isOpen } = useReasoning()

  return (
    <CollapsibleTrigger
      className={cn(
        "flex items-center gap-2 text-xs text-white/60 hover:text-white/80",
        "transition-all duration-200 group",
        "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent",
        "rounded-lg py-2 px-3 -mx-3",
        "hover:bg-white/5",
        className,
      )}
      {...props}
    >
      <Brain className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
      {isOpen ? (
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200" />
      )}
      {children || <span className="font-medium tracking-wide">{isOpen ? "Hide Reasoning" : "Show AI Reasoning"}</span>}
    </CollapsibleTrigger>
  )
}

export type ReasoningContentProps = {
  children: React.ReactNode
  className?: string
} & React.ComponentProps<typeof CollapsibleContent>

export function ReasoningContent({ children, className, ...props }: ReasoningContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "mt-3 space-y-3 overflow-hidden transition-all duration-300",
        "border-l-2 border-purple-400/30 pl-4 ml-2",
        "bg-white/5 backdrop-blur-sm rounded-r-lg p-4",
        "text-sm text-white/70 leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  )
}

// Componente para mostrar texto con efecto de streaming (simplificado)
export type ReasoningResponseProps = {
  text: string | AsyncIterable<string>
  className?: string
  onComplete?: () => void
} & React.HTMLAttributes<HTMLDivElement>

export function ReasoningResponse({ text, className, onComplete, ...props }: ReasoningResponseProps) {
  const [displayedText, setDisplayedText] = React.useState("")
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    if (typeof text === "string") {
      setDisplayedText(text)
      setIsComplete(true)
      onComplete?.()
      return
    }

    // Para AsyncIterable (streaming)
    let isCancelled = false
    setDisplayedText("")
    setIsComplete(false)

    async function processStream() {
      try {
        for await (const chunk of text) {
          if (isCancelled) break
          setDisplayedText((prev) => prev + chunk)
        }
        if (!isCancelled) {
          setIsComplete(true)
          onComplete?.()
        }
      } catch (error) {
        console.error("Error processing reasoning stream:", error)
        if (!isCancelled) {
          setIsComplete(true)
          onComplete?.()
        }
      }
    }

    processStream()

    return () => {
      isCancelled = true
    }
  }, [text, onComplete])

  return (
    <div className={cn("whitespace-pre-wrap font-mono", className)} {...props}>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-purple-400">▋</span>}
    </div>
  )
}
