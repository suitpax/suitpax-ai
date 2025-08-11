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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSearch({ city, checkIn, checkOut, adults, rooms })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Label>City</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. London" />
        </div>
        <div>
          <Label>Check-in</Label>
          <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
        <div>
          <Label>Check-out</Label>
          <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
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
        <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-gray-800">
          {loading ? "Searching…" : "Search Stays"}
        </Button>
      </div>
    </form>
  )
}