export interface CostCenter {
  id: string
  code: string
  name: string
  owner?: string
  budget: number
  currency: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface CostCenterComputed extends CostCenter {
  spent: number
  utilizationPct: number
  variance: number
}

export interface CsvCostCenterRow {
  code: string
  name: string
  budget: number
  currency?: string
  owner?: string
  notes?: string
}

export interface ExpenseLike {
  id: string
  amount: number
  currency: string
  status: string
  expense_date: string
  project_code: string | null
  title: string
  category: string
}

export type UpsertCostCenterInput = Omit<CostCenter, "id" | "createdAt" | "updatedAt"> & {
  id?: string
}
