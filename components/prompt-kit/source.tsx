"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Source({ href, children, className, target = "_blank", rel = "noopener noreferrer" }: { href: string; children: React.ReactNode; className?: string; target?: string; rel?: string }) {
  return (
    <a href={href} target={target} rel={rel} className={cn("group inline-flex items-start gap-2 max-w-sm", className)}>
      {children}
    </a>
  )
}

export function SourceTrigger({ showFavicon, label, className }: { showFavicon?: boolean; label?: string | number; className?: string }) {
  return (
    <div className={cn("inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-gray-300 bg-white px-2 text-xs text-gray-900", "group-hover:bg-gray-900 group-hover:text-white transition-colors", className)}>
      {showFavicon ? <Favicon /> : label ?? ""}
    </div>
  )
}

export function SourceContent({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm", "group-hover:border-gray-300", className)}>
      <div className="line-clamp-2 text-sm font-medium text-gray-900">{title}</div>
      {description ? <div className="mt-1 line-clamp-3 text-xs text-gray-600">{description}</div> : null}
    </div>
  )
}

function Favicon() {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [src, setSrc] = React.useState<string | null>(null)
  React.useEffect(() => {
    try {
      const parent = ref.current?.closest("a") as HTMLAnchorElement | null
      if (!parent?.href) return
      const u = new URL(parent.href)
      const icon = `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`
      setSrc(icon)
    } catch {}
  }, [])
  return (
    <span ref={ref} className="inline-flex h-4 w-4 items-center justify-center">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="favicon" className="h-4 w-4 rounded-sm" />
      ) : (
        <span className="inline-block h-3 w-3 rounded-sm bg-gray-300" />
      )}
    </span>
  )
}

export default Source
