"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, DollarSign } from "lucide-react"

interface CostCenter {
  id: string
  name: string
  code: string
  description?: string
  budget_monthly?: number
}

export default function CostCentersPage() {
  const [centers, setCenters] = useState<CostCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: "", code: "", description: "", budget_monthly: "" })
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cost-centers", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load cost centers")
      setCenters(data.data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const createCenter = async () => {
    setCreating(true)
    setError(null)
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || undefined,
        budget_monthly: form.budget_monthly ? Number(form.budget_monthly) : undefined,
      }
      const res = await fetch("/api/cost-centers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create cost center")
      setForm({ name: "", code: "", description: "", budget_monthly: "" })
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tighter leading-none">Cost Centers</h1>
          <p className="text-gray-600 font-light mt-2">Manage budgets and assign users to cost centers</p>
        </div>
      </div>

      <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create new cost center</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm">Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Marketing" />
            </div>
            <div>
              <Label className="text-sm">Code</Label>
              <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="MKT" />
            </div>
            <div>
              <Label className="text-sm">Monthly Budget (optional)</Label>
              <Input type="number" min={0} value={form.budget_monthly} onChange={e => setForm({ ...form, budget_monthly: e.target.value })} placeholder="10000" />
            </div>
            <div className="flex items-end">
              <Button onClick={createCenter} disabled={creating || !form.name || !form.code} className="w-full bg-black text-white hover:bg-gray-800">
                {creating ? 'Creating…' : 'Create'}
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <Label className="text-sm">Description</Label>
            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
          </div>
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Existing cost centers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : centers.length === 0 ? (
            <div className="text-sm text-gray-500">No cost centers yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {centers.map((cc) => (
                <div key={cc.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium tracking-tighter">{cc.name}</div>
                      <div className="text-xs text-gray-500">Code: {cc.code}</div>
                    </div>
                    <Badge className="bg-gray-200 text-gray-700 border-gray-200">{cc.budget_monthly ? `$${Number(cc.budget_monthly).toLocaleString()}/mo` : 'No budget'}</Badge>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">{cc.description || '—'}</div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                    <Users className="h-4 w-4" /> Manage members
                    <DollarSign className="h-4 w-4" /> View spending
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}