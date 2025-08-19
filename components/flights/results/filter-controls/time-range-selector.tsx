"use client"

interface TimeRangeSelectorProps {
  value?: { from?: string; to?: string }
  onChange?: (val: { from?: string; to?: string }) => void
}

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="time"
        value={value?.from || ""}
        onChange={(e) => onChange?.({ from: e.target.value, to: value?.to })}
        className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
      />
      <input
        type="time"
        value={value?.to || ""}
        onChange={(e) => onChange?.({ from: value?.from, to: e.target.value })}
        className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
      />
    </div>
  )
}

