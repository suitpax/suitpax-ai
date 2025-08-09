"use client"

import Papa from "papaparse"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import type { CsvCostCenterRow, UpsertCostCenterInput } from "./types"

interface ImportCsvProps {
  onParsed: (rows: UpsertCostCenterInput[]) => void
}

export function ImportCostCenterCsv({ onParsed }: ImportCsvProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rows: UpsertCostCenterInput[] = (results.data as CsvCostCenterRow[])
          .filter(r => r.code && r.name)
          .map(r => ({
            code: String(r.code).trim(),
            name: String(r.name).trim(),
            budget: Number(r.budget) || 0,
            currency: (r.currency || "USD").toUpperCase(),
            owner: r.owner || "",
            notes: r.notes || "",
          }))
        onParsed(rows)
      },
      error: (error) => {
        console.error("CSV parse error", error)
      }
    })
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <Button variant="outline" size="sm" className="rounded-xl border-gray-200 hover:bg-gray-50" onClick={() => inputRef.current?.click()}>
        Import CSV
      </Button>
    </div>
  )
}

export default ImportCostCenterCsv