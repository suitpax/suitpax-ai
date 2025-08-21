"use client"

import { useMemo } from "react"
import Popover from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

type Mode = "single" | "range"

export function DateRangePicker({
  mode = "range",
  value,
  onChange,
  disabled,
  className = "",
  placeholder = "Select date(s)",
}: {
  mode?: Mode
  value?: Date | DateRange
  onChange?: (val: Date | DateRange | undefined) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}) {
  const label = useMemo(() => {
    if (mode === "single") {
      const v = value as Date | undefined
      return v ? v.toLocaleDateString() : placeholder
    }
    const r = value as DateRange | undefined
    if (!r?.from && !r?.to) return placeholder
    const from = r?.from ? r.from.toLocaleDateString() : "—"
    const to = r?.to ? r.to.toLocaleDateString() : "—"
    return `${from} → ${to}`
  }, [value, mode, placeholder])

  return (
    <Popover
      align="start"
      trigger={
        <Button
          variant="outline"
          className={`rounded-2xl bg-white text-gray-900 border-gray-300 hover:bg-gray-50 ${className}`}
          disabled={disabled}
        >
          {label}
        </Button>
      }
      className="p-2"
    >
      <DayPicker
        mode={mode as any}
        selected={value as any}
        onSelect={(v) => onChange?.(v as any)}
        numberOfMonths={2}
        fixedWeeks
        weekStartsOn={1}
        className="rdp-root"
      />
    </Popover>
  )
}

export default DateRangePicker

