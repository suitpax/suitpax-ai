"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowDown } from "lucide-react"

function getNearestScrollableParent(element: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = element
  while (el) {
    const style = window.getComputedStyle(el)
    const overflowY = style.getPropertyValue("overflow-y")
    const isScrollable = /(auto|scroll)/.test(overflowY)
    if (isScrollable && el.scrollHeight > el.clientHeight) return el
    el = el.parentElement
  }
  return document.scrollingElement as HTMLElement | null
}

export function ScrollButton({ className }: { className?: string }) {
  const selfRef = useRef<HTMLButtonElement>(null)
  const [show, setShow] = useState(false)
  const scrollParentRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const parent = getNearestScrollableParent(selfRef.current?.parentElement || null)
    scrollParentRef.current = parent
    if (!parent) return

    const onScroll = () => {
      const atBottom = parent.scrollTop + parent.clientHeight >= parent.scrollHeight - 4
      setShow(!atBottom)
    }
    onScroll()
    parent.addEventListener("scroll", onScroll, { passive: true })
    return () => parent.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToBottom = () => {
    const parent = scrollParentRef.current
    if (!parent) return
    parent.scrollTo({ top: parent.scrollHeight, behavior: "smooth" })
  }

  if (!show) return null

  return (
    <button
      ref={selfRef}
      type="button"
      onClick={scrollToBottom}
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 rounded-full",
        "bg-black text-white shadow-sm hover:bg-gray-900 transition-colors",
        "border border-gray-900/50",
        className,
      )}
      title="Scroll to bottom"
    >
      <ArrowDown className="h-5 w-5" />
    </button>
  )
}

export default ScrollButton

