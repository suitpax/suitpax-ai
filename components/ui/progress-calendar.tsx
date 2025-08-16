"use client"

import React, { useMemo } from "react"

type DayCell = {
  date: Date
  value: number // 0..4
}

export type ProgressCalendarProps = {
  weeks?: number
  startFrom?: Date // default: today
  data?: Array<{ date: string | Date; value: number }>
  className?: string
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

const intensityClasses = [
  "bg-white/5 border-white/10",
  "bg-emerald-700/30 border-emerald-500/30",
  "bg-emerald-600/40 border-emerald-400/40",
  "bg-emerald-500/50 border-emerald-300/50",
  "bg-emerald-400/70 border-emerald-200/60",
]

export const ProgressCalendar: React.FC<ProgressCalendarProps> = ({
  weeks = 5,
  startFrom,
  data,
  className,
}) => {
  const today = useMemo(() => (startFrom ? new Date(startFrom) : new Date()), [startFrom])

  const dataMap = useMemo(() => {
    const map = new Map<string, number>()
    if (data && data.length > 0) {
      data.forEach((d) => {
        const dateObj = typeof d.date === "string" ? new Date(d.date) : d.date
        map.set(formatDateKey(dateObj), Math.max(0, Math.min(4, Math.round(d.value))))
      })
    }
    return map
  }, [data])

  const days: DayCell[] = useMemo(() => {
    const totalDays = weeks * 7
    const list: DayCell[] = []

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (totalDays - 1 - i))
      const key = formatDateKey(date)
      const value = dataMap.has(key) ? (dataMap.get(key) as number) : Math.floor(Math.random() * 5)
      list.push({ date, value })
    }

    return list
  }, [weeks, today, dataMap])

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
            Progress Calendar
          </span>
          <span className="text-[10px] text-white/60">
            {days.length} days
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[9px] text-white/50">Less</span>
          <div className="h-3 w-3 rounded-[4px] border border-white/10 bg-white/5" />
          <div className="h-3 w-3 rounded-[4px] border border-emerald-500/30 bg-emerald-700/30" />
          <div className="h-3 w-3 rounded-[4px] border border-emerald-400/40 bg-emerald-600/40" />
          <div className="h-3 w-3 rounded-[4px] border border-emerald-300/50 bg-emerald-500/50" />
          <div className="h-3 w-3 rounded-[4px] border border-emerald-200/60 bg-emerald-400/70" />
          <span className="text-[9px] text-white/50">More</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-center text-[9px] text-white/50 mb-1">
            {d}
          </div>
        ))}
        {days.map((day, idx) => (
          <div key={idx} className="flex items-center justify-center">
            <div
              title={`${day.date.toDateString()}`}
              className={`h-6 w-full rounded-[6px] border ${intensityClasses[day.value]}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressCalendar