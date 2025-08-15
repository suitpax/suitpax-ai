"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SystemHealthCard() {
  const systems = [
    { name: "API", status: "Operational", color: "bg-green-500" },
    { name: "Database", status: "Operational", color: "bg-green-500" },
    { name: "Workers", status: "Idle", color: "bg-gray-400" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">System Health</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {systems.map((s) => (
          <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-sm text-gray-900">{s.name}</div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              <span className="text-xs text-gray-600">{s.status}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
