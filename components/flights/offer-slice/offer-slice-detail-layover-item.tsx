"use client"

interface Props {
  duration?: string
  airportName?: string
}

export default function OfferSliceDetailLayoverItem({ duration, airportName }: Props) {
  if (!duration && !airportName) return null
  return (
    <div className="text-[12px] text-gray-500">
      Layover {duration ? `· ${duration}` : ''} {airportName ? `· ${airportName}` : ''}
    </div>
  )
}

