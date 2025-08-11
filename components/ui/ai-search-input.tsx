"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface AISearchInputProps {
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function AISearchInput({ placeholder = "Ask Suitpax AI...", className, size = "md" }: AISearchInputProps) {
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
    router.push("/dashboard/ai-chat")
  }

  const sizeClasses = {
    sm: "h-9 text-xs px-3",
    md: "h-10 text-sm px-3.5",
    lg: "h-11 text-sm px-4",
  } as const

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-md", className)}>
      <div className="relative w-full">
        <div className={cn("flex items-center rounded-full border border-gray-300/60 bg-white/70 backdrop-blur-sm shadow-sm", sizeClasses[size])}>
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-gray-500 text-gray-900"
          />
          <button type="submit" className="ml-2 inline-flex items-center justify-center h-7 px-3 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800">
            Ask
          </button>
        </div>
      </div>
    </form>
  )
}