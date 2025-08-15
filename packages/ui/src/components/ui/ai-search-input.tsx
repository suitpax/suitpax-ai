"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface AISearchInputProps {
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
  onSubmit?: (query: string) => void
}

export default function AISearchInput({ placeholder = "Ask Suitpax AI...", className, size = "md", onSubmit }: AISearchInputProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = query.trim()
    if (!value) return
    try {
      onSubmit ? onSubmit(value) : router.push(`/dashboard/suitpax-ai?prompt=${encodeURIComponent(value)}`)
    } catch {}
  }

  const sizeClasses = size === "sm" ? "h-8 text-xs" : size === "lg" ? "h-12 text-sm" : "h-10 text-sm"

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn("flex-1 rounded-xl border border-gray-200 px-3 bg-white/90", sizeClasses)}
      />
      <button type="submit" className={cn("inline-flex items-center gap-1 px-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors", size === "sm" ? "h-8 text-xs" : size === "lg" ? "h-12 text-sm" : "h-10 text-sm")}
        aria-label="Ask Suitpax AI">
        Ask <ArrowRight className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </button>
    </form>
  )
}
