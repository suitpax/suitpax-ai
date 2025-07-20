"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Receipt, DollarSign, Calendar, Filter } from "lucide-react"

interface Expense {
  id: string
  title: string
  description?: string
  amount: number
  currency: string
  category: "flight" | "hotel" | "meals" | "transport" | "other"
  status: "pending" | "approved" | "rejected" | "reimbursed"
  date: string
  receipt_url?: string
}

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [filter, setFilter] = useState<string>("all")

  const [newExpense, setNewExpense] = useState({
    title: "",
    description: "",
    amount: "",
    category: "meals" as const,
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      // Mock data for demo
      const mockExpenses: Expense[] = [
        {
          id: "1",
          title: "Flight to NYC",
          description: "Business trip to New York",
          amount: 450.0,
          currency: "USD",
          category: "flight",
          status: "approved",
          date: "2024-01-15",
        },
        {
          id: "2",
          title: "Hotel Manhattan",
          description: "3 nights at Hilton Manhattan",
          amount: 720.0,
          currency: "USD",
          category: "hotel",
          status: "pending",
          date: "2024-01-16",
        },
        {
          id: "3",
          title: "Client Dinner",
          description: "Dinner with potential clients",
          amount: 125.5,
          currency: "USD",
          category: "meals",
          status: "approved",
          date: "2024-01-17",
        },
        {
          id: "4",
          title: "Taxi to Airport",
          description: "Transportation to JFK",
          amount: 45.0,
          currency: "USD",
          category: "transport",
          status: "reimbursed",
          date: "2024-01-18",
        },
      ]
      setExpenses(mockExpenses)
    } catch (error) {
      console.error("Failed to fetch expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async () => {
    try {
      const expense: Expense = {
        id: Date.now().toString(),
        title: newExpense.title,
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        currency: "USD",
        category: newExpense.category,
        status: "pending",
        date: newExpense.date,
      }

      setExpenses((prev) => [expense, ...prev])
      setNewExpense({
        title: "",
        description: "",
        amount: "",
        category: "meals",
        date: new Date().toISOString().split("T")[0],
      })
      setIsAddingExpense(false)
    } catch (error) {
      console.error("Failed to add expense:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "reimbursed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flight":
        return "✈️"
      case "hotel":
        return "🏨"
      case "meals":
        return "🍽️"
      case "transport":
        return "🚗"
      default:
        return "📄"
    }
  }

  const filteredExpenses = expenses.filter((expense) => filter === "all" || expense.status === filter)

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expense Tracker</h2>
          <p className="text-muted-foreground">Manage and track your business expenses</p>
        </div>
        <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Create a new expense entry for your business trip.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter expense title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter expense description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value: any) => setNewExpense((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="meals">Meals</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingExpense(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{filteredExpenses.length} expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.filter((e) => e.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.filter((e) => e.status === "approved").length}</div>
            <p className="text-xs text-muted-foreground">Ready for reimbursement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reimbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {expenses
                .filter((e) => e.status === "reimbursed")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Expenses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="reimbursed">Reimbursed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                  <div>
                    <h3 className="font-semibold">{expense.title}</h3>
                    {expense.description && <p className="text-sm text-muted-foreground">{expense.description}</p>}
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{expense.category}</p>
                  </div>
                  <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all" ? "You haven't added any expenses yet." : `No expenses with status "${filter}" found.`}
            </p>
            <Button onClick={() => setIsAddingExpense(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Expense
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
