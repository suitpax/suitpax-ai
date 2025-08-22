"use client"

import { cn } from "@/lib/utils"
import { ChevronDown as ChevronDownIcon } from "lucide-react"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { Markdown } from "@/components/prompt-kit/markdown"

type ReasoningContextType = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const ReasoningContext = createContext<ReasoningContextType | undefined>(undefined)

function useReasoningContext() {
  const context = useContext(ReasoningContext)
  if (!context) {
    throw new Error("useReasoningContext must be used within a Reasoning provider")
  }
  return context
}

export type ReasoningProps = {
  children: React.ReactNode
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isStreaming?: boolean
}

export function Reasoning({ children, className, open, onOpenChange, isStreaming }: ReasoningProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [wasAutoOpened, setWasAutoOpened] = useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? Boolean(open) : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  useEffect(() => {
    if (isStreaming && !wasAutoOpened) {
      if (!isControlled) setInternalOpen(true)
      setWasAutoOpened(true)
    }
    if (!isStreaming && wasAutoOpened) {
      if (!isControlled) setInternalOpen(false)
      setWasAutoOpened(false)
    }
  }, [isStreaming, wasAutoOpened, isControlled])

  return (
    <ReasoningContext.Provider value={{ isOpen, onOpenChange: handleOpenChange }}>
      <div className={className}>{children}</div>
    </ReasoningContext.Provider>
  )
}

export type ReasoningTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  className?: string
}

export function ReasoningTrigger({ children, className, ...props }: ReasoningTriggerProps) {
  const { isOpen, onOpenChange } = useReasoningContext()
  return (
    <button
      className={cn("flex cursor-pointer items-center gap-2 text-sm", className)}
      onClick={() => onOpenChange(!isOpen)}
      {...props}
    >
      <span className="text-primary">{children}</span>
      <div className={cn("transform transition-transform", isOpen ? "rotate-180" : "")}>
        <ChevronDownIcon className="size-4" />
      </div>
    </button>
  )
}

export type ReasoningContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
  markdown?: boolean
  contentClassName?: string
}

export function ReasoningContent({ children, className, contentClassName, markdown = false, ...props }: ReasoningContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const { isOpen } = useReasoningContext()

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return
    const el = contentRef.current
    const inner = innerRef.current
    const observer = new ResizeObserver(() => {
      if (el && inner && isOpen) {
        el.style.maxHeight = `${inner.scrollHeight}px`
      }
    })
    observer.observe(inner)
    if (isOpen) {
      el.style.maxHeight = `${inner.scrollHeight}px`
    }
    return () => observer.disconnect()
  }, [isOpen])

  const content = markdown ? <Markdown>{children as string}</Markdown> : children

  return (
    <div
      ref={contentRef}
      className={cn("overflow-hidden transition-[max-height] duration-150 ease-out", className)}
      style={{ maxHeight: isOpen ? contentRef.current?.scrollHeight : "0px" }}
      {...props}
    >
      <div ref={innerRef} className={cn("text-muted-foreground prose prose-sm dark:prose-invert", contentClassName)}>
        {content}
      </div>
    </div>
  )
}

export default Reasoning

