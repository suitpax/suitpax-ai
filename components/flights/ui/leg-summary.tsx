"use client"

interface LegSummaryProps {
  index: number
  origin: string
  destination: string
  duration?: string
}

export default function LegSummary({ index, origin, destination, duration }: LegSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-800">
      <div className="font-medium tracking-tighter">Leg {index}: {origin} → {destination}</div>
      {duration && <div className="text-gray-600">Duration: {duration}</div>}
    </div>
  )
}

