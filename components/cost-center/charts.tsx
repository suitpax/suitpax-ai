"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, LineChart, Line, CartesianGrid } from "recharts"
import type { CostCenterComputed } from "./types"

interface ChartsProps {
  monthlyByDept: Array<Record<string, number | string>>
  centers: CostCenterComputed[]
}

export function CostCenterCharts({ monthlyByDept, centers }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium tracking-tighter">Monthly Spend by Department</h2>
            <Badge className="bg-gray-200 text-gray-700 border-gray-200">Last 6 months</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyByDept} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                {centers.map((c, idx) => (
                  <Bar key={c.code} dataKey={c.name} stackId="a" fill={chartPalette[idx % chartPalette.length]} radius={[6, 6, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium tracking-tighter">Utilization Trend</h2>
            <Badge className="bg-gray-200 text-gray-700 border-gray-200">All centers</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={centers.map(c => ({ name: c.name, value: Math.round((c.spent / Math.max(1, c.budget)) * 100) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip formatter={(v: any) => `${Number(v)}%`} />
                <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} dot={{ r: 3, fill: '#111827' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const chartPalette = [
  "#111827",
  "#4b5563",
  "#9ca3af",
  "#6b7280",
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
]

export default CostCenterCharts