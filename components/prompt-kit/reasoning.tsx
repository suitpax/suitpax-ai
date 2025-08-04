"use client"

import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { Brain, ChevronDown, ChevronRight } from "lucide-react"
import type React from "react"
import { createContext, useContext, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
        "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        "py-1 px-2 -mx-2", // Add padding and negative margin for better click area
        className,
      )}
      {...props}
    >
      {isOpen ? (
        <ChevronDown className="h-4 w-4 transition-transform" />
      ) : (
        <ChevronRight className="h-4 w-4 transition-transform" />
      )}
      {children || <span className="font-medium">{isOpen ? "Hide reasoning" : "Show reasoning"}</span>}
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
        "mt-2 space-y-2 overflow-hidden transition-all",
        "border-l-2 border-muted pl-4 ml-2",
        "text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  )
}

// Componente para mostrar texto con efecto de streaming (simplificado)
interface ReasoningResponseProps {
  reasoning: string
}

export const ReasoningResponse: React.FC<ReasoningResponseProps> = ({ reasoning }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!reasoning) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Brain className="h-3 w-3 mr-1" />
          AI Reasoning
          {isOpen ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="mt-2 p-3 bg-gray-50/50 border-gray-200">
          <div className="prose prose-xs max-w-none text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{reasoning}</ReactMarkdown>
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
