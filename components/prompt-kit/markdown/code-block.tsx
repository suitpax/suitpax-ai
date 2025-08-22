"use client"

import { cn } from "@/lib/utils"

export function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <pre className={cn("rounded-xl border border-gray-200 bg-white p-3 overflow-x-auto", className)}>
      {children}
    </pre>
  )
}

export function CodeBlockCode({ code, language, theme }: { code: string; language?: string; theme?: string }) {
  return (
    <code
      className={cn(
        "text-sm block",
        language ? `language-${language}` : undefined,
        theme ? `theme-${theme}` : undefined,
      )}
      data-theme={theme}
    >
      {code}
    </code>
  )
}

export function CodeBlockGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between", className)}>
      {children}
    </div>
  )
}

