"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Car, MapPin, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface CarOffer {
  id: string
  vendor: string
  model: string
  category: string
  seats: number
  transmission: "auto" | "manual"
  image?: string
  price: string
  refundable?: boolean
  badges?: Array<{ kind: string; label: string }>
}

export default function CarsPage() {
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState<CarOffer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tripType, setTripType] = useState<"round-trip" | "one-way">("one-way")

  const [params, setParams] = useState({
    pickup: "",
    dropoff: "",
    pickupDate: "",
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
    driverAge: 30,
    carType: "any",
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOffers([])

    try {
      // Placeholder search: integrate provider (e.g., Duffel Cars / Rentalcars / Amadeus) when ready
      await new Promise((r) => setTimeout(r, 1200))
      setOffers([
        {
          id: "1",
          vendor: "Enterprise",
          model: "BMW 3 Series",
          category: "Premium",
          seats: 5,
          transmission: "auto",
          image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
          price: "USD 128/day",
          refundable: true,
          badges: [{ kind: "best_value", label: "Best value" }, { kind: "policy_ok", label: "Policy OK" }],
        },
        {
          id: "2",
          vendor: "Hertz",
          model: "VW Golf",
          category: "Compact",
          seats: 5,
          transmission: "manual",
          image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
          price: "USD 52/day",
          refundable: false,
          badges: [{ kind: "eco", label: "Eco" }],
        },
      ])
    } catch (e: any) {
      setError(e?.message || "Search failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Cars</h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Search and book business car rentals</em>
              </p>
            </div>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center gap-3">
                <Button type="button" variant={tripType === "one-way" ? "default" : "outline"} onClick={() => setTripType("one-way")} className="rounded-xl">One Way</Button>
                <Button type="button" variant={tripType === "round-trip" ? "default" : "outline"} onClick={() => setTripType("round-trip")} className="rounded-xl">Round Trip</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input value={params.pickup} onChange={(e) => setParams({ ...params, pickup: e.target.value })} placeholder="City or airport" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Drop-off Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input value={params.dropoff} onChange={(e) => setParams({ ...params, dropoff: e.target.value })} placeholder="City or airport" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pickup</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="date" value={params.pickupDate} onChange={(e) => setParams({ ...params, pickupDate: e.target.value })} className="pl-10" />
                    </div>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="time" value={params.pickupTime} onChange={(e) => setParams({ ...params, pickupTime: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                </div>
                {tripType === "round-trip" && (
                  <div className="space-y-2">
                    <Label>Return</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input type="date" value={params.returnDate} onChange={(e) => setParams({ ...params, returnDate: e.target.value })} className="pl-10" />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input type="time" value={params.returnTime} onChange={(e) => setParams({ ...params, returnTime: e.target.value })} className="pl-10" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Driver Age</Label>
                  <Input type="number" min={18} value={params.driverAge} onChange={(e) => setParams({ ...params, driverAge: Number(e.target.value || 18) })} />
                </div>
                <div className="space-y-2">
                  <Label>Car Type</Label>
                  <Select value={params.carType} onValueChange={(v: any) => setParams({ ...params, carType: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-xl">Search Cars</Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-white/70 backdrop-blur-sm border border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && offers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => (
              <Card key={o.id} className="bg-white/70 backdrop-blur-sm border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {o.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.image} alt={o.model} className="h-32 w-full object-cover rounded-xl mb-3" />
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{o.vendor} · {o.model}</div>
                      <div className="text-xs text-gray-600">{o.category} · {o.seats} seats · {o.transmission === 'auto' ? 'Automatic' : 'Manual'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{o.price}</div>
                      <div className="text-[10px] text-gray-600">per day</div>
                    </div>
                  </div>
                  {o.badges && o.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {o.badges.map((b, i) => (
                        <div key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                          {b.label}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <Button className="w-full rounded-xl">Select</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}