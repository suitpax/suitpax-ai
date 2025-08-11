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
    <div className={cn("rounded-xl border border-gray-200 bg-gray-50 overflow-hidden", className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
          <span className="text-[11px] font-medium text-gray-600">{langLabel || "CODE"}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-700 hover:bg-gray-100" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      )}
      <pre className="m-0 overflow-auto p-3 text-[12px] leading-relaxed text-gray-900">
        <code className={cn(language)}>{code}</code>
      </pre>
    </div>
  )
}