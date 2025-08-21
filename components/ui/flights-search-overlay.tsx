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
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur", className)}>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl p-6 flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-900" />
        <div className="text-sm font-medium text-gray-800">{label}</div>
      </div>
    </div>
  )
}

