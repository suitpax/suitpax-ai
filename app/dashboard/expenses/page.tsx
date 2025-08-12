"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  CreditCardIcon,
  PlusIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockExpenses: any[] = []

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [expenses, setExpenses] = useState<any[]>([])
  const [formData, setFormData] = useState({
    description: "",
    category: "Transportation",
    amount: "",
    date: "",
    merchant: "",
    paymentMethod: "Corporate Card",
    receipt: null as File | null,
  })

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/expenses")
      const data = await res.json()
      if (res.ok && data.success) {
        setExpenses(data.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append("description", formData.description)
      fd.append("category", formData.category)
      fd.append("amount", formData.amount)
      fd.append("date", formData.date)
      fd.append("merchant", formData.merchant)
      fd.append("paymentMethod", formData.paymentMethod)
      if (formData.receipt) {
        fd.append("receipt", formData.receipt)
      }

      const res = await fetch("/api/expenses", {
        method: "POST",
        body: fd,
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormData({
          description: "",
          category: "Transportation",
          amount: "",
          date: "",
          merchant: "",
          paymentMethod: "Corporate Card",
          receipt: null,
        })
        setShowAddForm(false)
        loadExpenses()
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || expense.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const approvedExpenses = expenses
    .filter((e) => e.status === "approved")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const pendingExpenses = expenses
    .filter((e) => e.status === "pending")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCardIcon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">No expenses found</h3>
      <p className="text-gray-600 font-light mb-6 max-w-md mx-auto">
        <em className="font-serif italic">
          {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
            ? "Try adjusting your filters or search terms to find what you're looking for."
            : "Get started by adding your first business expense and keep track of your spending."}
        </em>
      </p>
      {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Your First Expense
          </button>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Expenses</h1>
            <p className="text-gray-600 font-light">
              <em className="font-serif italic">Track and manage your business travel expenses</em>
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold tracking-tighter text-gray-900">${totalExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold tracking-tighter text-gray-900">
                  ${approvedExpenses.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">
                    {mockExpenses.filter((e) => e.status === "approved").length} expenses
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold tracking-tighter text-gray-900">${pendingExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600 font-medium">
                    {mockExpenses.filter((e) => e.status === "pending").length} expenses
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium"
          >
            <option value="all">All Categories</option>
            <option value="Transportation">Transportation</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Meals">Meals</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </motion.div>

        {/* Add Expense Form */}
        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <h2 className="text-2xl font-medium tracking-tighter">Add New Expense</h2>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-900 font-medium rounded-xl hover:bg-white transition-colors tracking-tight border border-white/20"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter expense description"
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium"
                      required
                    >
                      <option value="Transportation">Transportation</option>
                      <option value="Accommodation">Accommodation</option>
                      <option value="Meals">Meals</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-2">
                      Amount ($)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="merchant" className="text-sm font-medium text-gray-700 mb-2">
                      Merchant
                    </Label>
                    <Input
                      id="merchant"
                      value={formData.merchant}
                      onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                      placeholder="Enter merchant name"
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </Label>
                    <select
                      id="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-medium"
                    >
                      <option value="Corporate Card">Corporate Card</option>
                      <option value="Personal Card">Personal Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="receipt" className="text-sm font-medium text-gray-700 mb-2">
                      Receipt (Optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0] || null
                          setFormData({ ...formData, receipt: file })
                          if (file) {
                            // Intentar OCR para pre-llenar
                            const fd = new FormData()
                            fd.append("parseOnly", "true")
                            fd.append("receipt", file)
                            const res = await fetch("/api/expenses", { method: "POST", body: fd })
                            const data = await res.json()
                            if (res.ok && data.success && data.parsed) {
                              setFormData((prev) => ({
                                ...prev,
                                amount: data.parsed.amount ? String(data.parsed.amount) : prev.amount,
                                date: data.parsed.expense_date || prev.date,
                                merchant: data.parsed.vendor || prev.merchant,
                                description: prev.description || data.parsed.vendor || "Expense",
                              }))
                            }
                          }
                        }}
                        className="rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:transition-colors"
                      />
                      <PhotoIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-light">
                      Upload a receipt image or PDF. We'll automatically extract details using AI.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl py-3 font-medium tracking-tight"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Expense
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Expenses List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
            <span className="ml-3 text-gray-600 font-medium">Loading expenses...</span>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tighter">
                {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                  ? "Filtered Expenses"
                  : "Recent Expenses"}
              </h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200 px-3 py-1 rounded-xl font-medium">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="space-y-4">
              {filteredExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-shadow">
                            {expense.category === "Transportation" && (
                              <CreditCardIcon className="h-7 w-7 text-gray-600" />
                            )}
                            {expense.category === "Accommodation" && (
                              <BuildingOfficeIcon className="h-7 w-7 text-gray-600" />
                            )}
                            {expense.category === "Meals" && <CurrencyDollarIcon className="h-7 w-7 text-gray-600" />}
                            {!["Transportation", "Accommodation", "Meals"].includes(expense.category) && (
                              <BanknotesIcon className="h-7 w-7 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg tracking-tight">
                              {expense.title || expense.description}
                            </h3>
                            <p className="text-gray-600 mt-1 font-medium">{expense.merchant || expense.vendor}</p>
                            <div className="flex items-center flex-wrap gap-3 mt-3">
                              <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs px-3 py-1 rounded-xl font-medium">
                                {expense.category}
                              </Badge>
                              <span className="text-sm text-gray-500 font-medium">{expense.date}</span>
                              <span className="text-sm text-gray-500 font-medium">{expense.paymentMethod}</span>
                              {expense.currency && (
                                <span className="text-sm text-gray-500 font-medium">{expense.currency}</span>
                              )}
                              {expense.receipt && (
                                <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                                  <DocumentTextIcon className="h-3 w-3 mr-1" />
                                  Receipt Attached
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 tracking-tight">
                              ${Number(expense.amount).toLocaleString()}
                            </div>
                            <Badge
                              className={`text-xs px-3 py-1 rounded-xl font-medium mt-2 ${
                                expense.status === "approved"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : expense.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              }`}
                            >
                              {expense.status === "approved" && <CheckCircleIcon className="h-3 w-3 mr-1 inline" />}
                              {expense.status === "pending" && <ClockIcon className="h-3 w-3 mr-1 inline" />}
                              {expense.status === "rejected" && <XCircleIcon className="h-3 w-3 mr-1 inline" />}
                              {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loading}
                            className="rounded-xl border-gray-200 bg-transparent hover:bg-gray-50"
                          >
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
