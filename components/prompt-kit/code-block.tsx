"use client"

import { cn } from "@/lib/utils"
import { memo } from "react"
import type React from "react"

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
    <pre>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  )
})

