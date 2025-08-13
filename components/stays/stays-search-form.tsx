"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface StaySearchParams {
  city: string
  checkIn: string
  checkOut: string
  adults?: number
  rooms?: number
}

interface Props {
  onSearch: (params: StaySearchParams) => Promise<void> | void
  loading?: boolean
}

export default function StaysSearchForm({ onSearch, loading }: Props) {
  const [city, setCity] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(1)
  const [rooms, setRooms] = useState(1)
  const [errors, setErrors] = useState<{ city?: string; checkIn?: string; checkOut?: string }>({})

  const validate = () => {
    const next: typeof errors = {}
    if (!city.trim()) next.city = "City is required"
    if (!checkIn) next.checkIn = "Check-in is required"
    if (!checkOut) next.checkOut = "Check-out is required"
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) next.checkOut = "Check-out must be after check-in"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSearch({ city, checkIn, checkOut, adults, rooms })
  }

  const isDisabled = loading || !city.trim() || !checkIn || !checkOut

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Label>City</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. London" aria-invalid={!!errors.city} />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
        </div>
        <div>
          <Label>Check-in</Label>
          <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} aria-invalid={!!errors.checkIn} />
          {errors.checkIn && <p className="text-xs text-red-600 mt-1">{errors.checkIn}</p>}
        </div>
        <div>
          <Label>Check-out</Label>
          <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} aria-invalid={!!errors.checkOut} />
          {errors.checkOut && <p className="text-xs text-red-600 mt-1">{errors.checkOut}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Adults</Label>
            <Input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value || 1))} />
          </div>
          <div>
            <Label>Rooms</Label>
            <Input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value || 1))} />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isDisabled} className="bg-black text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "Searching…" : "Search Stays"}
        </Button>
      </div>
    </form>
  )
}
