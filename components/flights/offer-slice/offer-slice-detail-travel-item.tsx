"use client"

interface Props {
  label: string
  value: string
}

export default function OfferSliceDetailTravelItem({ label, value }: Props) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-gray-600">{label}</div>
      <div className="text-gray-900 font-medium">{value}</div>
    </div>
  )
}

