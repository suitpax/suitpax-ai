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
        "flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 rounded-md",
        "py-1 px-2 -mx-2",
        className
      )}
      {...props}
    >
      {isOpen ? (
        <ChevronDown className="h-3.5 w-3.5 transition-transform" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 transition-transform" />
      )}
      {children || (
        <span className="font-medium">
          {isOpen ? "Ocultar razonamiento" : "Ver razonamiento"}
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
        "border-l-2 border-gray-200 pl-3 ml-1",
        "text-xs text-gray-600",
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