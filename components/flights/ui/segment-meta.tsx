"use client"

interface SegmentMetaProps {
  airlineName?: string
  flightNumber?: string
  departAt?: string
  arriveAt?: string
}

export default function SegmentMeta({ airlineName, flightNumber, departAt, arriveAt }: SegmentMetaProps) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] text-gray-600">{airlineName} {flightNumber}</div>
      {departAt && arriveAt && (
        <div className="mt-1 flex items-center justify-between text-gray-600 text-[11px]">
          <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0 text-[10px]">Departs: {departAt}</span>
          <span className="inline-flex items-center rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0 text-[10px]">Arrives: {arriveAt}</span>
        </div>
      )}
    </div>
  )
}

