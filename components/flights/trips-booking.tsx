"use client"

import Image from "next/image"

export default function TripsBooking() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="flex items-center justify-between bg-white/90 border border-gray-200 rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-16 rounded-lg overflow-hidden border border-gray-200">
            <Image src="/cities/london.jpg" alt="London" fill className="object-cover" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Madrid (MAD) → Heathrow (LHR)</div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span>British Airways</span>
              <img src="https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/BA.svg" alt="BA" className="h-3 w-auto" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">From</div>
          <div className="text-lg font-semibold text-gray-900">€180</div>
        </div>
      </div>
    </div>
  )
}

