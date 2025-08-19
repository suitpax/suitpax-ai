"use client"

import Image from "next/image"

export default function TripsBooking() {
  return (
    <div className="w-full max-w-3xl mx-auto mb-4">
      <div className="flex items-center justify-between bg-white/95 border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-24 rounded-xl overflow-hidden border border-gray-200">
            <Image src="https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&h=160&w=320" alt="London" fill className="object-cover" />
          </div>
          <div>
            <div className="text-base font-medium text-gray-900">Madrid (MAD) → Heathrow (LHR)</div>
            <div className="text-xs text-gray-600 flex items-center gap-2 mt-0.5">
              <span>British Airways</span>
              <img src="https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/BA.svg" alt="BA" className="h-3 w-auto" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">From</div>
          <div className="text-2xl font-semibold text-gray-900">€180</div>
          <div className="text-[10px] text-gray-500">Non-stop • 2h 25m</div>
        </div>
      </div>
    </div>
  )
}

