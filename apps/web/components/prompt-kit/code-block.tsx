"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ClipboardCopy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
  showHeader?: boolean
}

export default function CodeBlock({ code, language, className, showHeader = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const langLabel = (language || "").replace("language-", "").toUpperCase()

  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg",
        className,
      )}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <span className="text-xs font-medium text-white/80 tracking-wider">{langLabel || "CODE"}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-white/70 hover:bg-white/10 hover:text-white/90 rounded-lg transition-all"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      )}
      <pre className="m-0 overflow-auto p-4 text-sm leading-relaxed text-white/90 font-mono">
        <code className={cn(language)}>{code}</code>
      </pre>
    </div>
  )
}
