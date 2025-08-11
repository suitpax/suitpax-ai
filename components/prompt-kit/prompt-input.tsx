"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const PromptInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (val: string) => void
    isLoading?: boolean
    onSubmit?: () => void
  }
>(({ className, children, value, onValueChange, isLoading, onSubmit, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full flex-col gap-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm",
      "transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-300",
      className
    )}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSubmit?.()
      }
    }}
    {...props}
  >
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child
      // Inject controlled props into PromptInputTextarea if present
      if ((child as any).type?.displayName === "PromptInputTextarea") {
        return React.cloneElement(child as any, {
          value,
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onValueChange?.(e.target.value),
          disabled: (child as any).props?.disabled ?? isLoading,
        })
      }
      return child
    })}
  </div>
))
PromptInput.displayName = "PromptInput"

export const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onInput, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={1}
    onInput={(e) => {
      const el = e.currentTarget
      el.style.height = "auto"
      el.style.height = `${Math.min(240, el.scrollHeight)}px`
      onInput?.(e)
    }}
    className={cn(
      "w-full resize-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "leading-relaxed max-h-60 overflow-y-auto no-scrollbar",
      className
    )}
    {...props}
  />
))
PromptInputTextarea.displayName = "PromptInputTextarea"

export const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between gap-2", className)}
    {...props}
  />
))
PromptInputActions.displayName = "PromptInputActions"

export const PromptInputAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tooltip?: string }
>(({ className, tooltip, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-1", className)}
    title={tooltip}
    {...props}
  >
    {children}
  </div>
))
PromptInputAction.displayName = "PromptInputAction"