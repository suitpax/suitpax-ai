"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { CostCenter, UpsertCostCenterInput } from "./types"

interface CostCenterFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: CostCenter | null
  onSubmit: (input: UpsertCostCenterInput) => Promise<void> | void
}

export function CostCenterForm({ open, onOpenChange, initial, onSubmit }: CostCenterFormProps) {
  const [form, setForm] = useState<UpsertCostCenterInput>({
    code: "",
    name: "",
    owner: "",
    budget: 0,
    currency: "USD",
    notes: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id,
        code: initial.code,
        name: initial.name,
        owner: initial.owner,
        budget: initial.budget,
        currency: initial.currency,
        notes: initial.notes,
      })
    } else {
      setForm({ code: "", name: "", owner: "", budget: 0, currency: "USD", notes: "" })
    }
  }, [initial])

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await onSubmit(form)
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Cost Center" : "New Cost Center"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input id="owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving || !form.code || !form.name || form.budget <= 0}>
              {saving ? "Saving..." : initial ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CostCenterForm
