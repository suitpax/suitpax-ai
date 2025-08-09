"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ImportCostCenterCsv, CostCenterCharts, CostCenterForm, CostCenterKPIs, CostCenterTable, useCostCenters } from "@/components/dashboard/cost-center"
import type { CostCenterComputed, UpsertCostCenterInput } from "@/components/dashboard/cost-center"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function CostCenterPage() {
  const { loading, centers, totalBudget, totalSpent, monthlyByDept, upsertCenters, removeCenter, saveCenter } = useCostCenters()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CostCenterComputed | null>(null)
  const [search, setSearch] = useState("")

  const filteredCenters = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return centers
    return centers.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.owner || "").toLowerCase().includes(q))
  }, [centers, search])

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

      {/* Search */}
      <div className="max-w-sm">
        <Input placeholder="Search by name, code or owner" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Loading state */}
      {loading && (
        <Card className="border-gray-200">
          <CardContent className="p-6 text-sm text-gray-600">Loading cost centers...</CardContent>
        </Card>
      )}

      {/* Zero state */}
      {!loading && centers.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium tracking-tighter mb-1">No cost centers yet</h2>
                <p className="text-sm text-gray-600">Import a CSV or create your first cost center to start tracking budgets.</p>
              </div>
              <div className="flex items-center gap-2">
                <ImportCostCenterCsv onParsed={upsertCenters} />
                <Button onClick={handleCreate}>Create Center</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {centers.length > 0 && (
        <>
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
            <CostCenterTable centers={filteredCenters} onEdit={handleEdit} onDelete={removeCenter} />
          </motion.div>
        </>
      )}

      <CostCenterForm open={showForm} onOpenChange={setShowForm} initial={editing || undefined} onSubmit={handleSubmit} />
    </div>
  )
}