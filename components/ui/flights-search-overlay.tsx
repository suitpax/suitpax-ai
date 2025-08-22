"use client"

import { cn } from "@/lib/utils"

interface FlightsSearchOverlayProps {
  open: boolean
  label?: string
  className?: string
}

export default function FlightsSearchOverlay({ open, label = "Searching flights…", className }: FlightsSearchOverlayProps) {
  if (!open) return null
  return (
    <div className={cn("fixed top-4 left-1/2 -translate-x-1/2 z-50", className)}>
      <div className="rounded-full border border-gray-200 bg-white/95 shadow-md px-4 py-2 flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-900" />
        <div className="text-xs font-medium text-gray-900">{label}</div>
      </div>
    </div>
  )
}

