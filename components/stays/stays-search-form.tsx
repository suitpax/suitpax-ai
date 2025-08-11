"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface StaySearchParams {
  city?: string
  checkIn?: string
  checkOut?: string
  adults?: number
  rooms?: number
}

interface StaysSearchFormProps {
  onSearch: (params: StaySearchParams) => void
  loading?: boolean
}

export default function StaysSearchForm({ onSearch, loading }: StaysSearchFormProps) {
  const [city, setCity] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(1)
  const [rooms, setRooms] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ city, checkIn, checkOut, adults, rooms })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <div className="md:col-span-2">
        <Label className="text-xs text-gray-600">City</Label>
        <Input
          placeholder="e.g. London"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl"
        />
      </div>
      <div>
        <Label className="text-xs text-gray-600">Check-in</Label>
        <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="rounded-xl" />
      </div>
      <div>
        <Label className="text-xs text-gray-600">Check-out</Label>
        <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="rounded-xl" />
      </div>
      <div className="flex gap-2 items-end">
        <div>
          <Label className="text-xs text-gray-600">Adults</Label>
          <Input type="number" min={1} value={adults} onChange={(e) => setAdults(parseInt(e.target.value || '1'))} className="rounded-xl" />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Rooms</Label>
          <Input type="number" min={1} value={rooms} onChange={(e) => setRooms(parseInt(e.target.value || '1'))} className="rounded-xl" />
        </div>
        <Button type="submit" className="ml-auto rounded-xl" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  )
}