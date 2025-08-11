"use client"

import { cn } from "@/lib/utils"

interface PromptSuggestion {
  id: string
  title: string
  prompt: string
}

interface PromptSuggestionsProps {
  suggestions: PromptSuggestion[]
  onSelect: (prompt: string) => void
  className?: string
}

export default function PromptSuggestions({ suggestions, onSelect, className }: PromptSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.prompt)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-100"
          title={s.title}
        >
          <span className="font-medium">{s.title}</span>
        </button>
      ))}
    </div>
  )
}