"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const PromptInputContext = React.createContext<any>(null)

export type PromptInputTextareaProps = { disableAutosize?: boolean } & React.ComponentProps<typeof Textarea>

export const PromptInputTextarea = React.forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  ({ className, onKeyDown, disableAutosize = false, ...props }, ref) => {
    const ctx = React.useContext(PromptInputContext)
    if (!ctx) throw new Error("PromptInputTextarea must be used within PromptInput")
    const { value, setValue, maxHeight, onSubmit, disabled, textareaRef } = ctx

    React.useEffect(() => {
      if (disableAutosize) return
      if (!textareaRef.current) return
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height =
        typeof maxHeight === "number"
          ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
          : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`
    }, [value, maxHeight, disableAutosize])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSubmit?.()
      }
      onKeyDown?.(e)
    }

    return (
      <Textarea
        ref={(node) => {
          ;(textareaRef as any).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref && 'current' in (ref as any)) (ref as any).current = node
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        rows={1}
        disabled={disabled}
        {...props}
      />
    )
  }
)
PromptInputTextarea.displayName = "PromptInputTextarea"

export const PromptInputActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
  )
)
PromptInputActions.displayName = "PromptInputActions"

export type PromptInputActionProps = {
  className?: string
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
} & React.ComponentProps<typeof Tooltip>

export const PromptInputAction = React.forwardRef<HTMLDivElement, PromptInputActionProps>(
  ({ tooltip, children, className, side = "top", ...props }, ref) => (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
          <div ref={ref} className={cn("flex items-center space-x-1", className)}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)
PromptInputAction.displayName = "PromptInputAction"

type PromptInputProps = {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
}

export function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = React.useState(value || "")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          textareaRef,
        }}
      >
        <div
          className={cn(
            "border-input bg-background cursor-text rounded-3xl border p-2 shadow-xs",
            className
          )}
          onClick={() => textareaRef.current?.focus()}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  )
}
