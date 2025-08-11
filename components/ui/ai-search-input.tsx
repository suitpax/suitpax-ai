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
      <div className={cn(
        "relative rounded-2xl p-[2px]",
        "bg-[conic-gradient(at_10%_10%,#e5e7eb,white_25%,#c7d2fe_50%,#bae6fd_75%,#e5e7eb)]",
        "shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
      )}>
        <div className={cn("flex items-center rounded-2xl bg-white", sizeClasses[size])}>
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-800"
          />
          <button type="submit" className="ml-2 inline-flex items-center justify-center h-7 px-3 rounded-xl bg-gray-900 text-white text-xs font-medium hover:bg-black">
            Ask
          </button>
        </div>
      </div>
    </form>
  )
}