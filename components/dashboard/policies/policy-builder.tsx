"use client"

import { useState } from "react"

export function PolicyBuilder({ onGenerate }: { onGenerate: (input: any) => void }) {
  const [type, setType] = useState("Expense Policy")
  const [size, setSize] = useState("mid-market")
  const [budget, setBudget] = useState("standard")

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="rounded-xl border border-gray-200 px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)} />
        <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="seed">seed</option>
          <option value="series-a">series-a</option>
          <option value="mid-market">mid-market</option>
          <option value="enterprise">enterprise</option>
        </select>
        <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm" value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="frugal">frugal</option>
          <option value="standard">standard</option>
          <option value="premium">premium</option>
        </select>
      </div>
      <div className="mt-3 text-right">
        <button
          onClick={() => onGenerate({ type, size, budget })}
          className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
        >
          Generate
        </button>
      </div>
    </div>
  )
}

