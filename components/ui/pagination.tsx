"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const canPrev = page > 1
  const canNext = page < pageCount

  const go = (p: number) => {
    if (p < 1 || p > pageCount) return
    onPageChange(p)
  }

  const pages = getPages(page, pageCount)

  return (
    <nav className={cn("inline-flex items-center gap-1", className)} aria-label="Pagination">
      <button
        onClick={() => go(page - 1)}
        disabled={!canPrev}
        className={cn(
          "px-3 py-1.5 rounded-lg border text-sm",
          canPrev ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
        )}
        aria-label="Previous"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className="px-2 text-sm text-gray-500">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-sm",
              p === page
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => go(page + 1)}
        disabled={!canNext}
        className={cn(
          "px-3 py-1.5 rounded-lg border text-sm",
          canNext ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-50" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
        )}
        aria-label="Next"
      >
        ›
      </button>
    </nav>
  )
}

function getPages(page: number, pageCount: number): (number | "…")[] {
  const delta = 1
  const range: number[] = []
  const rangeWithDots: (number | "…")[] = []
  let l: number

  for (let i = Math.max(2, page - delta); i <= Math.min(pageCount - 1, page + delta); i++) {
    range.push(i)
  }
  if (page - delta > 2) rangeWithDots.push(1, "…")
  else if (page > 1) rangeWithDots.push(1)
  rangeWithDots.push(...range)
  if (page + delta < pageCount - 1) rangeWithDots.push("…", pageCount)
  else if (page < pageCount) rangeWithDots.push(pageCount)
  if (pageCount <= 1) return [1]
  return rangeWithDots
}