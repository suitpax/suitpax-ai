"use client"

import React, { memo } from "react"
import { cn } from "@/lib/utils"

export function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border bg-[#0b1020] text-white shadow-sm", className)}>
      {children}
    </div>
  )
}

export function CodeBlockGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("border-b border-white/10", className)}>
      {children}
    </div>
  )
}

export const CodeBlockCode = memo(function CodeBlockCode({ code, language }: { code: string; language: string }) {
  return (
    <pre className="overflow-x-auto p-3 text-xs">
      <code className={language ? `language-${language}` : undefined}>{code}</code>
    </pre>
  )
})

export default CodeBlock

