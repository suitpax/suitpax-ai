"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const CELL = 16
const GAP = 12
const DOT = 5

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 1)
  const diff = startOfDay(d).getTime() - startOfDay(start).getTime()
  return Math.floor(diff / 86400000) + 1
}
function dateFromIndex(year: number, index: number) {
  return new Date(year, 0, index + 1)
}
function formatDotLabel(d: Date) {
  const m = d.getMonth() + 1
  const dd = d.getDate()
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d)
  return `${m}/${dd} ${weekday}`
}

export default function ProgressCalendar() {
  const now = React.useMemo(() => new Date(), [])
  const year = now.getFullYear()
  const totalDays = isLeapYear(year) ? 366 : 365
  const todayIndex = dayOfYear(now) - 1

  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const [isCoarse, setIsCoarse] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    const mq = window.matchMedia("(pointer: coarse)")
    const update = () => setIsCoarse(mq.matches || hasTouch)
    update()
    if (mq.addEventListener) mq.addEventListener("change", update)
    else mq.addListener(update)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update)
      else mq.removeListener(update)
    }
  }, [])

  const displayIndex = hoverIndex !== null && hoverIndex > todayIndex ? hoverIndex : todayIndex
  const daysLeft = totalDays - (displayIndex + 1)
  const dots = React.useMemo(() => Array.from({ length: totalDays }, (_, i) => i), [totalDays])

  React.useEffect(() => {
    if (!isCoarse && openIndex !== null) setOpenIndex(null)
  }, [isCoarse, openIndex])

  const raf = (cb: () => void) => {
    if (typeof window === "undefined") return cb()
    requestAnimationFrame(cb)
  }

  return (
    <TooltipProvider>
      <div className="w-full" style={{ width: "min(92vw, 596px)" }}>
        <div
          className="mb-8"
          onMouseLeave={() => setHoverIndex(null)}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, ${CELL}px)`,
            gap: `${GAP}px`,
            justifyContent: "center",
          }}
        >
          {dots.map((i) => {
            const isShownWhite = i <= displayIndex
            const date = dateFromIndex(year, i)
            const label = formatDotLabel(date)

            const core = (
              <div
                className="flex items-center justify-center cursor-pointer select-none"
                role="button"
                tabIndex={0}
                style={{ width: CELL, height: CELL }}
                onMouseEnter={() => {
                  if (!isCoarse) {
                    raf(() => {
                      if (i > todayIndex) setHoverIndex(i)
                      else setHoverIndex(null)
                    })
                  }
                }}
                onClick={(e) => {
                  if (!isCoarse) return
                  e.stopPropagation()
                  raf(() => {
                    if (i > todayIndex) setHoverIndex(i)
                    else setHoverIndex(null)
                  })
                }}
              >
                <div
                  className={cn(
                    "rounded-full transition-colors duration-150",
                    isShownWhite ? "bg-white" : "bg-neutral-700",
                  )}
                  style={{ width: DOT, height: DOT }}
                />
              </div>
            )

            if (isCoarse) {
              const open = openIndex === i
              return (
                <Popover
                  key={i}
                  open={open}
                  onOpenChange={(o) => {
                    if (!o) {
                      raf(() => {
                        setOpenIndex(null)
                        setHoverIndex(null)
                      })
                    } else {
                      raf(() => {
                        setOpenIndex(i)
                        if (i > todayIndex) setHoverIndex(i)
                        else setHoverIndex(null)
                      })
                    }
                  }}
                >
                  <PopoverTrigger asChild>{core}</PopoverTrigger>
                  <PopoverContent
                    side="top"
                    sideOffset={8}
                    align="center"
                    updatePositionStrategy="always"
                    className="w-auto min-w-0 whitespace-nowrap px-2 py-1 text-xs bg-black text-white border border-white/10 rounded shadow-lg"
                  >
                    {label}
                  </PopoverContent>
                </Popover>
              )
            }

            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>{core}</TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  updatePositionStrategy="always"
                  className="w-auto min-w-0 whitespace-nowrap text-xs bg-black text-white border border-white/10 rounded shadow-lg"
                >
                  {label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-white/90 text-base md:text-lg">{year}</div>
          <div className="flex items-baseline gap-2">
            <RollingDigits value={daysLeft} className="relative top-[2px] text-sm md:text-base font-normal text-white" />
            <span className="text-neutral-500 text-sm md:text-base font-normal">days left</span>
          </div>
        </div>

        <style jsx>{`
          .rollingDigit { display: inline-block; height: 1em; line-height: 1em; vertical-align: baseline; overflow: hidden; position: relative; }
          .rollingDigit > span { display: inline-block; transform: translateY(10%); opacity: 0; animation: rollIn 0.18s ease forwards; }
          @keyframes rollIn { to { transform: translateY(0); opacity: 1; } }
        `}</style>
      </div>
    </TooltipProvider>
  )
}

function RollingDigits({ value, className }: { value: number; className?: string }) {
  const [digits, setDigits] = React.useState<string[]>(String(value).split(""))
  React.useEffect(() => { setDigits(String(value).split("")) }, [value])
  return (
    <span className={className}>
      {digits.map((d, idx) => (
        <span key={`${idx}-${d}`} className="rollingDigit" aria-hidden="true">
          <span style={{ animationDelay: `${idx * 0.06}s` }}>{d}</span>
        </span>
      ))}
      <span className="sr-only">{value}</span>
    </span>
  )
}