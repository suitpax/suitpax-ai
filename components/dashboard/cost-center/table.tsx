"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { CostCenterComputed } from "./types"

interface CostCenterTableProps {
  centers: CostCenterComputed[]
  onEdit?: (center: CostCenterComputed) => void
  onDelete?: (centerId: string) => void
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount)
  } catch {
    return `$${amount.toLocaleString()}`
  }
}

export function CostCenterTable({ centers, onEdit, onDelete }: CostCenterTableProps) {
  const columns = useMemo(() => ["Name", "Code", "Budget", "Spent", "Utilization", "Variance", "Actions"], [])

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium tracking-tighter">Centers</h2>
          <span className="text-xs text-gray-500">Budget vs Spent</span>
        </div>

        {/* Mobile list */}
        <div className="space-y-3 sm:hidden">
          {centers.map((c) => (
            <div key={c.id} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.code}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit?.(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete?.(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Budget</div>
                  <div className="font-medium">{formatCurrency(c.budget, c.currency)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Spent</div>
                  <div className="font-medium">{formatCurrency(c.spent, c.currency)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Utilization</div>
                  <div className="font-medium">{Math.round(c.utilizationPct)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="overflow-x-auto hidden sm:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                {columns.map((c) => (
                  <th key={c} className="py-2 pr-4">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {centers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                  <td className="py-3 pr-4 text-gray-700">{c.code}</td>
                  <td className="py-3 pr-4 text-gray-700">{formatCurrency(c.budget, c.currency)}</td>
                  <td className="py-3 pr-4 text-gray-700">{formatCurrency(c.spent, c.currency)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-40 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.utilizationPct > 100 ? "bg-red-500" : "bg-gray-900"}`}
                          style={{ width: `${Math.min(100, Math.round(c.utilizationPct))}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{Math.round(c.utilizationPct)}%</span>
                    </div>
                  </td>
                  <td className={`py-3 pr-4 ${c.variance < 0 ? "text-red-600" : "text-gray-700"}`}>
                    {c.variance < 0 ? "-" : "+"}{formatCurrency(Math.abs(c.variance), c.currency)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => onEdit?.(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete?.(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default CostCenterTable