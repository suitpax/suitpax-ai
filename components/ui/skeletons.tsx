"use client"

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-4 space-y-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded w-full" />
      ))}
    </div>
  )
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-2xl border border-gray-200 animate-pulse" />
      ))}
    </div>
  )
}

