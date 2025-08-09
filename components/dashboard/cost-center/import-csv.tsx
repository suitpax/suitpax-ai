"use client"

import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import type { CsvCostCenterRow, UpsertCostCenterInput } from "./types"

interface ImportCostCenterCsvProps {
  onParsed: (rows: UpsertCostCenterInput[]) => void
}

export function ImportCostCenterCsv({ onParsed }: ImportCostCenterCsvProps) {
  const handleFile = (file: File) => {
    Papa.parse<CsvCostCenterRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data || []).map((r) => ({
          code: (r.code || "").trim(),
          name: (r.name || "").trim(),
          budget: Number(r.budget) || 0,
          currency: r.currency || "USD",
          owner: r.owner || "",
          notes: r.notes || "",
        }))
        const valid = rows.filter((r) => r.code && r.name && r.budget > 0)
        onParsed(valid)
      },
    })
  }

  return (
    <label className="inline-flex items-center">
      <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
      <Button size="sm" variant="outline" className="rounded-xl">
        <Upload className="h-4 w-4 mr-2" /> Import CSV
      </Button>
    </label>
  )
}

export default ImportCostCenterCsv