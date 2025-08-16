"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"

export function Source({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={`group relative inline-flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all ${className}`}>
      {children}
    </Link>
  )
}

export function SourceTrigger({ showFavicon = false, faviconUrl, className = "" }: { showFavicon?: boolean; faviconUrl?: string; className?: string }) {
  const src = faviconUrl
  return (
    <div className={`flex items-center justify-center w-9 min-w-9 border-r border-gray-200 bg-gray-50 group-hover:bg-gray-100 ${className}`}>
      {showFavicon && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="favicon" className="h-4 w-4" />
      ) : (
        <div className="h-4 w-4 rounded bg-gray-300" />
      )}
    </div>
  )
}

export function SourceContent({ title, description, imageUrl }: { title: string; description?: string; imageUrl?: string }) {
  const favicon = useMemo(() => {
    try {
      const url = new URL(title.startsWith("http") ? title : "https://" + title)
      return `https://cdn.brandfetch.io/${url.hostname}/icon`
    } catch {
      return undefined
    }
  }, [title])

  return (
    <div className="px-3 py-2 max-w-xs">
      <div className="line-clamp-2 text-xs font-medium text-gray-900 leading-snug">{title}</div>
      {description && <div className="line-clamp-3 text-[11px] text-gray-600 mt-0.5">{description}</div>}
    </div>
  )
}

export default Source
