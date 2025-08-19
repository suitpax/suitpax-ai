"use client"

interface OfferSliceConditionsProps {
  conditions?: any
}

export default function OfferSliceConditions({ conditions }: OfferSliceConditionsProps) {
  if (!conditions) return null
  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      {conditions.refund_before_departure && (
        <span className={`dc-baggage-item ${conditions.refund_before_departure.allowed ? '' : 'opacity-60'}`}>Refundable</span>
      )}
      {conditions.change_before_departure && (
        <span className={`dc-baggage-item ${conditions.change_before_departure.allowed ? '' : 'opacity-60'}`}>Changeable</span>
      )}
    </div>
  )
}

