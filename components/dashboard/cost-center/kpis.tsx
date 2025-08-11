"use client"

import { Card, CardContent } from "@/components/ui/card"

interface KPIsProps {
  totalBudget: number
  totalSpent: number
  activeCenters: number
}

export function CostCenterKPIs({ totalBudget, totalSpent, activeCenters }: KPIsProps) {
  const utilization = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <p className="text-2xl font-medium tracking-tighter">{utilization}%</p>
        </CardContent>
      </Card>
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-gray-600">Active Centers</p>
          <p className="text-2xl font-medium tracking-tighter">{activeCenters}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CostCenterKPIs
