"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type AccordionItemProps = {
  id: string
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export type AccordionProps = {
  items: AccordionItemProps[]
  className?: string
  type?: "single" | "multiple"
  defaultOpenIds?: string[]
  openIds?: string[]
  onOpenChange?: (openIds: string[]) => void
}

export function Accordion({
  items,
  className,
  type = "multiple",
  defaultOpenIds,
  openIds,
  onOpenChange,
}: AccordionProps) {
  const isControlled = Array.isArray(openIds)
  const [internalOpenIds, setInternalOpenIds] = React.useState<string[]>(defaultOpenIds || [])
  const currentOpen = isControlled ? openIds! : internalOpenIds

  const setOpen = (next: string[]) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpenIds(next)
  }

  const toggle = (id: string) => {
    if (type === "single") {
      const next = currentOpen.includes(id) ? [] : [id]
      setOpen(next)
      return
    }
    const next = currentOpen.includes(id) ? currentOpen.filter((x) => x !== id) : [...currentOpen, id]
    setOpen(next)
  }

  return (
    <div className={cn("w-full divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white", className)}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={currentOpen.includes(item.id)}
          onToggle={() => !item.disabled && toggle(item.id)}
        />
      ))}
    </div>
  )
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItemProps
  isOpen: boolean
  onToggle: () => void
}) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    if (!contentRef.current) return
    setHeight(isOpen ? contentRef.current.scrollHeight : 0)
  }, [isOpen])

  return (
    <div className={cn("group", item.className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
          item.disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <span className="text-sm font-medium text-gray-900">{item.title}</span>
        <svg
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        aria-hidden={!isOpen}
        style={{ height }}
        className={cn("overflow-hidden transition-[height] duration-200 ease-out")}
      >
        <div ref={contentRef} className="px-4 pb-4 text-sm text-gray-600">
          {item.children}
        </div>
      </div>
    </div>
  )
}

export default Accordion