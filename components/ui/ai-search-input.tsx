"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface AISearchInputProps {
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function AISearchInput({
  placeholder = "Search or ask AI anything...",
  className,
  size = "md",
}: AISearchInputProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = query.trim()
    if (!value) return

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("ai-chat:prompt", value)
      }
    } catch {}

    router.push("/dashboard/suitpax-ai")
    setQuery("")
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pl-10 pr-4 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all placeholder:text-gray-400"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Sparkles className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </form>
  )
}
