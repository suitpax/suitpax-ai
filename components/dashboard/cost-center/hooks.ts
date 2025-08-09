"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"
import type { CostCenter, CostCenterComputed, ExpenseLike, UpsertCostCenterInput } from "./types"

// MVP: keep local cost centers, compute spend by expenses.project_code from Supabase

export function useCostCenters() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<CostCenter[]>([])
  const [expenses, setExpenses] = useState<ExpenseLike[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: session } = await supabase.auth.getSession()
        const uid = session.session?.user?.id || null
        setUserId(uid)

        if (uid) {
          const { data } = await supabase
            .from("expenses")
            .select("id, amount, currency, status, expense_date, project_code, title, category")
            .eq("user_id", uid)
          setExpenses((data || []) as ExpenseLike[])
        }

        const key = uid ? `cost_centers:${uid}` : "cost_centers"
        const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
        const parsed: CostCenter[] = raw ? JSON.parse(raw) : []
        setCenters(parsed)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [supabase])

  const computed: CostCenterComputed[] = useMemo(() => {
    const codeToSpent: Record<string, number> = {}
    for (const e of expenses) {
      const code = (e.project_code || "").trim()
      if (!code) continue
      codeToSpent[code] = (codeToSpent[code] || 0) + (e.amount || 0)
    }

    return centers.map((c) => {
      const spent = codeToSpent[c.code] || 0
      const utilizationPct = c.budget ? (spent / c.budget) * 100 : 0
      const variance = c.budget - spent
      return { ...c, spent, utilizationPct, variance }
    })
  }, [centers, expenses])

  const totalBudget = useMemo(() => computed.reduce((s, c) => s + c.budget, 0), [computed])
  const totalSpent = useMemo(() => computed.reduce((s, c) => s + c.spent, 0), [computed])

  const persist = (updated: CostCenter[]) => {
    if (typeof window !== "undefined") {
      const key = userId ? `cost_centers:${userId}` : "cost_centers"
      window.localStorage.setItem(key, JSON.stringify(updated))
    }
  }

  const upsertCenters = (rows: UpsertCostCenterInput[]) => {
    const codeToExisting: Record<string, CostCenter> = {}
    centers.forEach((c) => (codeToExisting[c.code] = c))
    const updated: CostCenter[] = [...centers]

    for (const r of rows) {
      if (r.code in codeToExisting) {
        const idx = updated.findIndex((u) => u.code === r.code)
        updated[idx] = {
          ...updated[idx],
          ...r,
          id: updated[idx].id,
          updatedAt: new Date().toISOString(),
        }
      } else {
        updated.push({
          id: crypto.randomUUID(),
          code: r.code,
          name: r.name,
          owner: r.owner,
          budget: r.budget,
          currency: r.currency,
          notes: r.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    }

    setCenters(updated)
    persist(updated)
  }

  const removeCenter = (centerId: string) => {
    const updated = centers.filter((c) => c.id !== centerId)
    setCenters(updated)
    persist(updated)
  }

  const saveCenter = (input: UpsertCostCenterInput) => {
    upsertCenters([input])
  }

  const monthlyByDept = useMemo(() => {
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleString(undefined, { month: "short" }) }
    })

    const codeToName: Record<string, string> = {}
    centers.forEach((c) => (codeToName[c.code] = c.name))

    const rows = months.map((m) => {
      const base: Record<string, number | string> = { month: m.label }
      for (const e of expenses) {
        if (!e.project_code) continue
        const d = new Date(e.expense_date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        if (key !== m.key) continue
        const name = codeToName[e.project_code] || e.project_code
        base[name] = (Number(base[name]) || 0) + (e.amount || 0)
      }
      return base
    })

    return rows
  }, [centers, expenses])

  return {
    loading,
    centers: computed,
    totalBudget,
    totalSpent,
    monthlyByDept,
    upsertCenters,
    removeCenter,
    saveCenter,
  }
}