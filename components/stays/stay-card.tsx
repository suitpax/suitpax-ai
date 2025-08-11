import Image from "next/image"

interface StayCardProps {
  stay: any
}

export default function StayCard({ stay }: StayCardProps) {
  const imageUrl = stay?.images?.[0]?.url || "/placeholder.svg"
  const name = stay?.name || "Property"
  const address = stay?.address?.formatted || ""
  const price = stay?.cheapest_rate?.total_amount
  const currency = stay?.cheapest_rate?.total_currency
  const rating = stay?.rating || stay?.star_rating

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-xs text-gray-600 line-clamp-1">{address}</p>
          </div>
          {rating && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{rating}★</span>
          )}
        </div>
        {price && (
          <div className="mt-2 text-sm font-semibold text-gray-900">
            {price} {currency}
          </div>
        )}
      </div>
    </div>
  )
}