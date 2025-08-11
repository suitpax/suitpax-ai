"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      // ignore
    }
  }

  const lang = (language || "").replace(/^language-/, "").toUpperCase()

  return (
    <div className={cn("group relative mt-3 mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-[10px] font-medium tracking-wide text-gray-600">{lang || "CODE"}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-100"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-auto p-3 text-xs leading-relaxed text-gray-900">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock