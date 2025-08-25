"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const EventsPage = dynamic(() => import("@/app/dashboard/events/page"), { ssr: false })
const FinancePage = dynamic(() => import("@/app/dashboard/finance/page"), { ssr: false })

export default function NetworkingPage() {
  const [tab, setTab] = useState<'events'|'finance'>('events')
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Networking</h1>
          <p className="text-gray-600 font-light">Connect, find opportunities, organize events and budgets</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            <button onClick={() => setTab('events')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='events' ? 'bg-white shadow-sm' : ''}`}>Events</button>
            <button onClick={() => setTab('finance')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='finance' ? 'bg-white shadow-sm' : ''}`}>Finance</button>
          </div>
        </CardContent>
      </Card>

      {tab === 'events' ? <EventsPage /> : <FinancePage />}
    </div>
  )
}

