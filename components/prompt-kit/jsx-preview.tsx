"use client"

import { useMemo } from "react"
import sanitizeHtml from "sanitize-html"

interface JSXPreviewProps {
  html: string
  className?: string
}

export default function JSXPreview({ html, className }: JSXPreviewProps) {
  const safe = useMemo(() => {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "pre", "code"]),
      allowedAttributes: {
        a: ["href", "target", "rel"],
        img: ["src", "alt", "width", "height"],
        '*': ["class"]
      }
    })
  }, [html])

  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />
}
