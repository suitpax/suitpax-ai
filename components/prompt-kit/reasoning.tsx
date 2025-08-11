"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
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

export function Reasoning({
  children,
  className,
  open,
  onOpenChange,
  ...props
}: ReasoningProps) {
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
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  )
}

export type ReasoningTriggerProps = {
  children?: React.ReactNode
  className?: string
} & React.ComponentProps<typeof CollapsibleTrigger>

export function ReasoningTrigger({
  children,
  className,
  ...props
}: ReasoningTriggerProps) {
  const { isOpen } = useReasoning()

  return (
    <CollapsibleTrigger
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        "py-1 px-2 -mx-2", // Add padding and negative margin for better click area
        className
      )}
      {...props}
    >
      {isOpen ? (
        <ChevronDown className="h-4 w-4 transition-transform" />
      ) : (
        <ChevronRight className="h-4 w-4 transition-transform" />
      )}
      {children || (
        <span className="font-medium">
          {isOpen ? "Hide reasoning" : "Show reasoning"}
        </span>
      )}
    </CollapsibleTrigger>
  )
}

export type ReasoningContentProps = {
  children: React.ReactNode
  className?: string
} & React.ComponentProps<typeof CollapsibleContent>

export function ReasoningContent({
  children,
  className,
  ...props
}: ReasoningContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "mt-2 space-y-2 overflow-hidden transition-all",
        "border-l-2 border-muted pl-4 ml-2",
        "text-sm text-muted-foreground",
        className
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

export function ReasoningResponse({
  text,
  className,
  onComplete,
  ...props
}: ReasoningResponseProps) {
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
          setDisplayedText(prev => prev + chunk)
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
    <div className={cn("whitespace-pre-wrap", className)} {...props}>
      {displayedText}
      {!isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  )
}