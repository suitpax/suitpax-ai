"use client"

import { cn } from "@/lib/utils"

export type ToolSelectorProps = {
  webSearchEnabled: boolean
  deepSearchEnabled: boolean
  onToggleWeb: (v: boolean) => void
  onToggleDeep: (v: boolean) => void
  className?: string
}

export default function ToolSelector({ webSearchEnabled, deepSearchEnabled, onToggleWeb, onToggleDeep, className }: ToolSelectorProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onToggleWeb(!webSearchEnabled)}
        className={cn("rounded-md border px-1.5 py-0.5 text-[10px]", webSearchEnabled ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50")}
        aria-pressed={webSearchEnabled}
      >
        Web
      </button>
      <button
        type="button"
        onClick={() => onToggleDeep(!deepSearchEnabled)}
        className={cn("rounded-md border px-1.5 py-0.5 text-[10px]", deepSearchEnabled ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50")}
        aria-pressed={deepSearchEnabled}
      >
        Deep
      </button>
    </div>
  )
}