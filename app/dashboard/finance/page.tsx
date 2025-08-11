"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ExpensesPage = dynamic(() => import("@/app/dashboard/expenses/page"), { ssr: false })
const CostCenterPage = dynamic(() => import("@/app/dashboard/cost-center/page"), { ssr: false })

export default function FinancePage() {
  const [tab, setTab] = useState<'expenses'|'cost-centers'>('expenses')

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Finance</h1>
          <p className="text-gray-600 font-light">Expenses and Cost Centers</p>
        </div>
        <Button variant="outline" onClick={async () => {
          await fetch('/api/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: `Finance export - ${new Date().toISOString()}` }) })
        }}>Export PDF</Button>
      </div>

      <Card>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            <button onClick={() => setTab('expenses')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='expenses' ? 'bg-white shadow-sm' : ''}`}>Expenses</button>
            <button onClick={() => setTab('cost-centers')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='cost-centers' ? 'bg-white shadow-sm' : ''}`}>Cost Centers</button>
          </div>
        </CardContent>
      </Card>

      {tab === 'expenses' ? <ExpensesPage /> : <CostCenterPage />}
    </div>
  )
}