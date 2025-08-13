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

export default function AISearchInput({
  placeholder = "Search or ask AI anything...",
  className,
  size = "md",
  onSubmit,
}: AISearchInputProps) {
  const [query, setQuery] = useState("")
  const [showReasoning, setShowReasoning] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = query.trim()
    if (!value) return

    setShowReasoning(true)
    setTimeout(() => setShowReasoning(false), 2000)

    if (onSubmit) {
      onSubmit(value)
    } else {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("ai-chat:prompt", value)
        }
      } catch {}
      router.push("/dashboard/suitpax-ai")
    }

    setQuery("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (e.target.value.length > 0 && !showReasoning) {
      setShowReasoning(true)
      setTimeout(() => setShowReasoning(false), 1500)
    }
  }

  return (
    <div className={cn("w-full relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-11 pr-12 text-sm bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-gray-400 shadow-sm hover:shadow-md"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </form>

      {showReasoning && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl p-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">Reasoning...</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Analyzing your request and preparing the best response</p>
          </div>
        </div>
      )}
    </div>
  )
}
