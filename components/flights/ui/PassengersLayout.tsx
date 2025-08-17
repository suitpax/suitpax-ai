"use client"

import PassengerSelect from './PassengerSelect'

interface Props {
  value: { adults: number; children: number; infants: number }
  onChange: (next: { adults: number; children: number; infants: number }) => void
}

export default function PassengersLayout({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-700">Passengers</div>
      <PassengerSelect adults={value.adults} children={value.children} infants={value.infants} onChange={onChange} />
    </div>
  )
}