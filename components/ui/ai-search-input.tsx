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

export default function AISearchInput() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    try {
      router.push(`/dashboard/ai-core?prompt=${encodeURIComponent(query.trim())}`)
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask Suitpax AI..."
        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      <button type="submit" className="px-3 py-2 rounded-lg bg-black text-white text-sm">
        Ask
      </button>
    </form>
  )
}
