"use client"

import { useEffect, useMemo, useState } from "react"

export default function MiniCountdownBadge({ target, title = "Suitpax Launch" }: { target: string | Date; title?: string }) {
  const targetDate = useMemo(() => (typeof target === "string" ? new Date(target) : target), [target])
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const ms = Math.max(0, targetDate.getTime() - now.getTime())
  const totalMinutes = Math.floor(ms / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const mins = totalMinutes % 60

  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-0.5 text-[9px] font-medium text-white/90 border border-white/15">
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:150ms]" />
      </span>
      <span>{title}</span>
      <span className="opacity-80">•</span>
      <span>{days}d {hours}h {mins}m</span>
      <span className="opacity-60">to Oct 21</span>
    </span>
  )
}

