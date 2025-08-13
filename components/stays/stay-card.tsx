"use client"

interface Props {
  stay: any
}

export default function StayCard({ stay }: Props) {
  const name = stay?.name || stay?.hotel_name || "Hotel"
  const price = stay?.price?.amount || stay?.amount || 0
  const currency = stay?.price?.currency || stay?.currency || "USD"
  const location = stay?.city || stay?.location || "—"

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="h-36 bg-gray-100" />
      <div className="p-4 space-y-1">
        <div className="text-sm text-gray-500">{location}</div>
        <div className="font-medium tracking-tight">{name}</div>
        <div className="text-sm text-gray-700">{currency} {price}</div>
      </div>
    </div>
  )
}
