"use client"

import { cn } from "@/lib/utils"

export function PromptSuggestion({
  children,
  onClick,
  highlight,
  className,
}: {
  children: string
  onClick?: () => void
  highlight?: string
  className?: string
}) {
  if (highlight && highlight.trim()) {
    const text = children
    const query = highlight
    const parts = splitHighlight(text, query)
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full text-left rounded-xl border border-gray-200 bg-white px-3 py-2",
          "hover:bg-gray-50 transition-colors",
          className,
        )}
      >
        {parts.map((p, i) =>
          p.isMatch ? (
            <mark key={i} className="bg-yellow-100 text-gray-900 rounded px-0.5">
              {p.text}
            </mark>
          ) : (
            <span key={i}>{p.text}</span>
          ),
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-2xl border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900",
        "hover:bg-gray-100 transition-colors",
        className,
      )}
    >
      {children}
    </button>
  )
}

function splitHighlight(text: string, query: string): Array<{ text: string; isMatch: boolean }> {
  if (!query) return [{ text, isMatch: false }]
  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`(${escaped})`, "ig")
    return text.split(regex).filter(Boolean).map((part) => ({ text: part, isMatch: regex.test(part) }))
  } catch {
    return [{ text, isMatch: false }]
  }
}

export default PromptSuggestion

