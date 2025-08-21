"use client"

import { cn } from "@/lib/utils"

export function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <pre className={cn("rounded-xl border border-gray-200 bg-white p-3 overflow-x-auto", className)}>
      {children}
    </pre>
  )
}

export function CodeBlockCode({ code, language }: { code: string; language?: string }) {
  return (
    <code className={cn("text-sm", language ? `language-${language}` : undefined)}>
      {code}
    </code>
  )
}

