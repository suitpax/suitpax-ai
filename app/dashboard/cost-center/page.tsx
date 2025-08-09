"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"

interface CostCenterSummary {
  name: string
  budget: number
  spent: number
}

export default function CostCenterPage() {
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<CostCenterSummary[]>([])

  useEffect(() => {
    // TODO: Replace with API fetch
    setCenters([
      { name: "Sales", budget: 120000, spent: 68000 },
      { name: "Engineering", budget: 200000, spent: 154000 },
      { name: "Marketing", budget: 90000, spent: 72000 },
      { name: "Operations", budget: 110000, spent: 83000 },
    ])
  }, [])

  const monthly = [
    { month: "Jan", Sales: 9000, Engineering: 18000, Marketing: 7000, Operations: 8000 },
    { month: "Feb", Sales: 10000, Engineering: 20000, Marketing: 9000, Operations: 9000 },
    { month: "Mar", Sales: 8000, Engineering: 22000, Marketing: 12000, Operations: 7000 },
    { month: "Apr", Sales: 9500, Engineering: 21000, Marketing: 11000, Operations: 8500 },
    { month: "May", Sales: 11000, Engineering: 23000, Marketing: 10000, Operations: 9000 },
    { month: "Jun", Sales: 10500, Engineering: 18000, Marketing: 12000, Operations: 9500 },
  ]

  const totalBudget = centers.reduce((s, c) => s + c.budget, 0)
  const totalSpent = centers.reduce((s, c) => s + c.spent, 0)

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Cost Centers</h1>
            <p className="text-gray-600 font-light">Budgets and spending by department</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-xl border-gray-200 hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" /> Import CSV
            </Button>
            <Button size="sm" className="rounded-xl bg-gray-900 text-white hover:bg-black">
              <Plus className="h-4 w-4 mr-2" /> New Cost Center
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Total Budget</p>
            <p className="text-2xl font-medium tracking-tighter">${totalBudget.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-medium tracking-tighter">${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Utilization</p>
            <p className="text-2xl font-medium tracking-tighter">
              {totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Active Centers</p>
            <p className="text-2xl font-medium tracking-tighter">{centers.length}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter">Monthly Spend by Department</h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200">Last 6 months</Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="Sales" stackId="a" fill="#111827" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Engineering" stackId="a" fill="#4b5563" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Marketing" stackId="a" fill="#9ca3af" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Operations" stackId="a" fill="#6b7280" radius={[6, 6, 0, 0]} />
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
                <LineChart data={centers.map(c => ({ name: c.name, value: Math.round((c.spent / c.budget) * 100) }))}>
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
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }}>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium tracking-tighter">Centers</h2>
              <span className="text-xs text-gray-500">Budget vs Spent</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Budget</th>
                    <th className="py-2 pr-4">Spent</th>
                    <th className="py-2 pr-4">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {centers.map((c) => (
                    <tr key={c.name} className="border-t border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                      <td className="py-3 pr-4 text-gray-700">${c.budget.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-gray-700">${c.spent.toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-40 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900"
                              style={{ width: `${Math.min(100, Math.round((c.spent / c.budget) * 100))}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {Math.round((c.spent / c.budget) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}