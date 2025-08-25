"use client"

import React, { createContext, useContext, useMemo } from "react"

type PromptInputContextValue = {
  value: string
  onValueChange: (next: string) => void
  isLoading?: boolean
  onSubmit?: () => void
}

const PromptInputContext = createContext<PromptInputContextValue | null>(null)

function usePromptInputContext() {
  const ctx = useContext(PromptInputContext)
  if (!ctx) throw new Error("PromptInput components must be used within <PromptInput>")
  return ctx
}

type PromptInputProps = React.PropsWithChildren<{
  value: string
  onValueChange: (next: string) => void
  isLoading?: boolean
  onSubmit?: () => void
  className?: string
}>

export function PromptInput(props: PromptInputProps) {
  const { value, onValueChange, isLoading, onSubmit, className, children } = props
  const ctx = useMemo<PromptInputContextValue>(() => ({ value, onValueChange, isLoading, onSubmit }), [value, onValueChange, isLoading, onSubmit])

  return (
    <PromptInputContext.Provider value={ctx}>
      <div className={
        [
          "rounded-2xl border border-gray-200 bg-white p-3 text-gray-900 shadow-sm",
          "focus-within:border-gray-300",
          className || "",
        ].join(" ")
      }>
        {children}
      </div>
    </PromptInputContext.Provider>
  )
}

type PromptInputTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function PromptInputTextarea({ className, onKeyDown, ...rest }: PromptInputTextareaProps) {
  const { value, onValueChange, onSubmit, isLoading } = usePromptInputContext()

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (onKeyDown) onKeyDown(e)
    if (e.defaultPrevented) return
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading) onSubmit?.()
    }
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      rows={3}
      className={[
        "w-full resize-y rounded-xl border border-transparent bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-0",
        className || "",
      ].join(" ")}
      {...rest}
    />
  )
}

type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>

export function PromptInputActions({ className, ...rest }: PromptInputActionsProps) {
  return (
    <div
      className={[
        "flex items-center gap-2",
        className || "",
      ].join(" ")}
      {...rest}
    />
  )
}

type PromptInputActionProps = React.HTMLAttributes<HTMLDivElement> & { tooltip?: string }

export function PromptInputAction({ className, tooltip, ...rest }: PromptInputActionProps) {
  return (
    <div
      title={tooltip}
      className={[
        "inline-flex items-center justify-center",
        className || "",
      ].join(" ")}
      {...rest}
    />
  )
}

export default PromptInput
