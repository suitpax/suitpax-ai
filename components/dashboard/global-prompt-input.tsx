"use client"

import { useState } from "react"
import { ArrowUp } from "lucide-react"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"

type GlobalPromptInputProps = {
  placeholder?: string
  onSubmitNavigate?: (value: string) => void
  className?: string
}

export function GlobalPromptInput({ placeholder = "Ask the AI to plan a trip, analyze an expense, or draft a policy…", onSubmitNavigate, className }: GlobalPromptInputProps) {
  const [value, setValue] = useState("")

  const handleSubmit = () => {
    const v = value.trim()
    if (!v) return
    if (onSubmitNavigate) onSubmitNavigate(v)
    else window.location.href = `/dashboard/ai-center?tab=chat&prompt=${encodeURIComponent(v)}`
  }

  return (
    <PromptInput value={value} onValueChange={setValue} onSubmit={handleSubmit} className={className || "bg-white border-gray-200 shadow-sm"}>
      <PromptInputTextarea placeholder={placeholder} />
      <PromptInputActions>
        <PromptInputAction tooltip="Send">
          <button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-2xl h-7 w-7 p-0 inline-flex items-center justify-center">
            <ArrowUp className="size-3.5" />
          </button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  )
}

export default GlobalPromptInput

