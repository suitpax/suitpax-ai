"use client"

export function Separator({ orientation = "horizontal", className = "" }: { orientation?: "horizontal" | "vertical"; className?: string }) {
  return (
    <div className={`${orientation === "vertical" ? "w-px h-6" : "h-px w-full"} bg-gray-200 ${className}`} />
  )
}