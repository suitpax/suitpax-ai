"use client"

import type React from "react"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function Source({
  href,
  children,
  className = "",
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex items-stretch overflow-hidden rounded-xl",
        "border border-white/20 bg-white/10 backdrop-blur-sm",
        "hover:border-white/30 hover:bg-white/15 hover:shadow-lg",
        "transition-all duration-200",
        className,
      )}
    >
      {children}
    </Link>
  )
}

export function SourceTrigger({
  showFavicon = false,
  faviconUrl,
  className = "",
}: {
  showFavicon?: boolean
  faviconUrl?: string
  className?: string
}) {
  const src = faviconUrl
  return (
    <div
      className={cn(
        "flex items-center justify-center w-12 min-w-12",
        "border-r border-white/20 bg-white/5 group-hover:bg-white/10",
        "transition-colors duration-200",
        className,
      )}
    >
      {showFavicon && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src || "/placeholder.svg"} alt="favicon" className="h-5 w-5 rounded" />
      ) : (
        <ExternalLink className="h-4 w-4 text-white/60" />
      )}
    </div>
  )
}

export function SourceContent({
  title,
  description,
  imageUrl,
}: {
  title: string
  description?: string
  imageUrl?: string
}) {
  return (
    <div className="px-4 py-3 max-w-xs">
      <div className="line-clamp-2 text-sm font-medium text-white/90 leading-snug">{title}</div>
      {description && <div className="line-clamp-3 text-xs text-white/60 mt-1 leading-relaxed">{description}</div>}
    </div>
  )
}

export default Source
