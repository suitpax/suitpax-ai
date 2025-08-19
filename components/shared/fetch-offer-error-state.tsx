"use client"

interface Props { message?: string }
export default function FetchOfferErrorState({ message = "We couldn’t fetch this offer. Please try again." }: Props) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-3 text-sm">
      {message}
    </div>
  )
}

