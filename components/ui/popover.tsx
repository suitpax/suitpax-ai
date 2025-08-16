"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type PopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
}

export default function Popover({ trigger, children, className, align = "center" }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center">
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[180px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0",
            className,
          )}
          role="dialog"
        >
          {children}
        </div>
      )}
    </div>
  )
}