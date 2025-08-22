"use client"

import { useState } from "react"

export function NoiseGateToggle() {
  const [enabled, setEnabled] = useState(true)
  return (
    <button onClick={() => setEnabled((v) => !v)} className={`rounded-xl px-3 py-1 text-xs border ${enabled ? "bg-black text-white border-black" : "bg-white border-gray-200"}`}>
      Noise gate {enabled ? "On" : "Off"}
    </button>
  )
}