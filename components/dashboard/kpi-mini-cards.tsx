"use client"

import { Card } from "@/components/ui/card"
import { Plane, DollarSign, TrendingUp, Calendar } from "lucide-react"

export function KpiMiniCards() {
  const items = [
    { title: "Total Trips", value: "0", change: "+0%", icon: Plane },
    { title: "Total Spent", value: "$0", change: "+0%", icon: DollarSign },
    { title: "Avg Trip Cost", value: "$0", change: "+0%", icon: TrendingUp },
    { title: "Active Bookings", value: "0", change: "+0%", icon: Calendar },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <Card key={it.title} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-gray-600 mb-1">{it.title}</p>
              <p className="text-lg font-medium tracking-tight text-gray-900">{it.value}</p>
              <p className="text-[10px] text-gray-500 mt-1">{it.change} from last month</p>
            </div>
            <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
              <it.icon className="h-3.5 w-3.5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
