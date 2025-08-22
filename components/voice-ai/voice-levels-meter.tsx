"use client"

export function VoiceLevelsMeter({ level = 0, className = "" }: { level?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(1, level))
  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 overflow-hidden ${className}`}>
      <div className="h-full bg-black transition-all" style={{ width: `${clamped * 100}%` }} />
    </div>
  )
}