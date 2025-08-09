"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ImportCostCenterCsv, CostCenterCharts, CostCenterForm, CostCenterKPIs, CostCenterTable, useCostCenters } from "@/components/cost-center"
import type { CostCenterComputed, UpsertCostCenterInput } from "@/components/cost-center"

export default function CostCenterPage() {
  const { loading, centers, totalBudget, totalSpent, monthlyByDept, upsertCenters, removeCenter, saveCenter } = useCostCenters()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CostCenterComputed | null>(null)

  const handleCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = (c: CostCenterComputed) => {
    setEditing(c)
    setShowForm(true)
  }

  const handleSubmit = async (input: UpsertCostCenterInput) => {
    saveCenter(input)
  }

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Cost Centers</h1>
            <p className="text-gray-600 font-light">Budgets and spending by department (driven by expense project codes)</p>
          </div>
          <div className="flex items-center space-x-2">
            <ImportCostCenterCsv onParsed={upsertCenters} />
            <Button size="sm" className="rounded-xl bg-gray-900 text-white hover:bg-black" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" /> New Cost Center
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
        <CostCenterKPIs totalBudget={totalBudget} totalSpent={totalSpent} activeCenters={centers.length} />
      </motion.div>

      {/* Charts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}>
        <CostCenterCharts monthlyByDept={monthlyByDept} centers={centers} />
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }}>
        <CostCenterTable centers={centers} onEdit={handleEdit} onDelete={removeCenter} />
      </motion.div>

      <CostCenterForm open={showForm} onOpenChange={setShowForm} initial={editing || undefined} onSubmit={handleSubmit} />
    </div>
  )
}