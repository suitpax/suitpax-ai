"use client"

import { cn } from "@/lib/utils"

export function HaloOrb({ className = "", size = 220 }: { className?: string; size?: number }) {
  const s = `${size}px`
  return (
    <div className={cn("relative", className)} style={{ width: s, height: s }}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),rgba(0,0,0,0.8))] blur-2xl" />
      <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.08),rgba(0,0,0,0.9))] blur-xl" />
      <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
    </div>
  )
}