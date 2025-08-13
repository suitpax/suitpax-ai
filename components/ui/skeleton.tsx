"use client"

import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-gray-200", className)} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  )
}
