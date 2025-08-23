"use client"

import { useEffect, useState } from "react"

export default function TokenIndicator() {
  const [usage, setUsage] = useState<{ used: number; limit?: number | null }>({ used: 0, limit: null })

  useEffect(() => {
    // Placeholder: could fetch from /api/user/dashboard-stats in future
    setUsage({ used: 0, limit: null })
  }, [])

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-700">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span>AI usage</span>
      {usage.limit != null ? (
        <span className="text-gray-500">{usage.used}/{usage.limit}</span>
      ) : (
        <span className="text-gray-500">{usage.used}</span>
      )}
    </div>
  )
}