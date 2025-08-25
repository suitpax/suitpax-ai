"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Building2, ChevronRight } from "lucide-react"

export default function PersonalDashboardPage() {
  const [tripType, setTripType] = useState<"personal" | "business">("personal")

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Plan your trip</h1>
            <p className="text-gray-600 font-light">Choose Personal or Business travel and start booking</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-full">
            <button onClick={() => setTripType("personal")} className={`px-3 py-1 text-xs font-medium rounded-full ${tripType === "personal" ? "bg-white text-black shadow" : "text-gray-600"}`}>Personal</button>
            <button onClick={() => setTripType("business")} className={`px-3 py-1 text-xs font-medium rounded-full ${tripType === "business" ? "bg-white text-black shadow" : "text-gray-600"}`}>Business</button>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ name: 'Book flight', href: `/dashboard/flights?tripType=${tripType}` }, { name: 'Book hotel', href: `/dashboard/hotels?tripType=${tripType}` }, { name: 'Track price', href: '/dashboard/flights' }, { name: 'View trips', href: '/dashboard/trips' }].map(a => (
            <Link key={a.name} href={a.href} className="text-center rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-900 hover:bg-white">
              {a.name}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Booking entry points */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 inline-flex items-center justify-center">
                    <Plane className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-lg font-medium tracking-tetter text-gray-900">Flights</div>
                    <div className="text-xs text-gray-600">Search and book flights</div>
                  </div>
                </div>
                <Button asChild size="sm" className="rounded-xl bg-black text-white hover:bg-gray-800">
                  <Link href={`/dashboard/flights?tripType=${tripType}`}>
                    Open <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 inline-flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-lg font-medium tracking-tetter text-gray-900">Hotels</div>
                    <div className="text-xs text-gray-600">Find business hotels</div>
                  </div>
                </div>
                <Button asChild size="sm" className="rounded-xl bg-black text-white hover:bg-gray-800">
                  <Link href={`/dashboard/hotels?tripType=${tripType}`}>
                    Open <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

