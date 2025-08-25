"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Building2, Car, Train, ChevronRight } from "lucide-react"

type TripType = "personal" | "business"

const PRODUCTS = [
  { id: "flights", name: "Flights", href: "/dashboard/flights", icon: Plane, available: true, desc: "Search and book flights" },
  { id: "hotels", name: "Hotels", href: "/dashboard/hotels", icon: Building2, available: true, desc: "Find business hotels" },
  { id: "cars", name: "Cars", href: "#", icon: Car, available: false, desc: "Coming soon" },
  { id: "trains", name: "Trains", href: "#", icon: Train, available: false, desc: "Coming soon" },
]

export default function BookingHubPage() {
  const [tripType, setTripType] = useState<TripType>("personal")

  const products = useMemo(() => PRODUCTS, [])

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Book</h1>
            <p className="text-gray-600 font-light">Quick access to booking products</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button onClick={() => setTripType("personal")} className={`px-3 py-1 text-xs font-medium rounded-full ${tripType === "personal" ? "bg-white text-black shadow" : "text-gray-600"}`}>Personal</button>
            <button onClick={() => setTripType("business")} className={`px-3 py-1 text-xs font-medium rounded-full ${tripType === "business" ? "bg-white text-black shadow" : "text-gray-600"}`}>Business</button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 inline-flex items-center justify-center">
                      <p.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-lg font-medium tracking-tetter text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-600">{p.desc}</div>
                    </div>
                  </div>
                  {p.available ? (
                    <Button asChild size="sm" className="rounded-xl bg-black text-white hover:bg-gray-800">
                      <Link href={`${p.href}${tripType === "personal" ? "?tripType=personal" : "?tripType=business"}`}>
                        Open <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-[11px] text-gray-500">Coming soon</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

