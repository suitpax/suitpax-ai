"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  CreditCardIcon,
  PlusIcon,
  CalendarIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockExpenses = [
  {
    id: 1,
    description: "Flight to London - British Airways",
    category: "Transportation",
    amount: 1245.0,
    date: "2024-03-15",
    status: "approved",
    receipt: true,
    merchant: "British Airways",
    paymentMethod: "Corporate Card",
  },
  {
    id: 2,
    description: "Hilton London Hotel - 3 nights",
    category: "Accommodation",
    amount: 450.0,
    date: "2024-03-16",
    status: "pending",
    receipt: true,
    merchant: "Hilton Hotels",
    paymentMethod: "Corporate Card",
  },
  {
    id: 3,
    description: "Business Dinner - The Ivy",
    category: "Meals",
    amount: 125.5,
    date: "2024-03-17",
    status: "approved",
    receipt: false,
    merchant: "The Ivy Restaurant",
    paymentMethod: "Personal Card",
  },
  {
    id: 4,
    description: "Taxi to Heathrow Airport",
    category: "Transportation",
    amount: 45.0,
    date: "2024-03-18",
    status: "pending",
    receipt: true,
    merchant: "Uber",
    paymentMethod: "Corporate Card",
  },
]

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [formData, setFormData] = useState({
    description: "",
    category: "Transportation",
    amount: "",
    date: "",
    merchant: "",
    paymentMethod: "Corporate Card",
    receipt: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Expense submitted:", formData)
    setShowAddForm(false)
    setFormData({
      description: "",
      category: "Transportation",
      amount: "",
      date: "",
      merchant: "",
      paymentMethod: "Corporate Card",
      receipt: null,
    })
  }

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.merchant.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || expense.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const approvedExpenses = mockExpenses
    .filter((expense) => expense.status === "approved")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = mockExpenses
    .filter((expense) => expense.status === "pending")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCardIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
      <p className="text-gray-500 mb-6">
        {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
          ? "Try adjusting your filters or search terms."
          : "Get started by adding your first business expense."}
      </p>
      {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
        <Button onClick={() => setShowAddForm(true)} className="bg-black text-white hover:bg-gray-800">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Expenses</h1>
          <p className="text-gray-600 font-light">Track and manage your business travel expenses</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-black text-white hover:bg-gray-800">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-medium tracking-tighter">${totalExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">+12% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-medium tracking-tighter">${approvedExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {mockExpenses.filter((e) => e.status === "approved").length} expenses
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <ReceiptPercentIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-medium tracking-tighter">${pendingExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {mockExpenses.filter((e) => e.status === "pending").length} expenses
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </motion.div>

      {/* Add Expense Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium tracking-tighter">Add New Expense</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter expense description"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="merchant">Merchant</Label>
                    <Input
                      id="merchant"
                      value={formData.merchant}
                      onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                      placeholder="Enter merchant name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="Corporate Card">Corporate Card</option>
                      <option value="Personal Card">Personal Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="receipt">Receipt (Optional)</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFormData({ ...formData, receipt: e.target.files?.[0] || null })}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tighter">
              {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                ? "Filtered Expenses"
                : "Recent Expenses"}
            </h2>
            <Badge className="bg-gray-200 text-gray-700 border-gray-200">
              {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CreditCardIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{expense.description}</h3>
                          <p className="text-sm text-gray-600 mt-1">{expense.merchant}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
                              {expense.category}
                            </Badge>
                            <span className="text-sm text-gray-500">{expense.date}</span>
                            <span className="text-sm text-gray-500">{expense.paymentMethod}</span>
                            {expense.receipt && (
                              <div className="flex items-center text-xs text-gray-500">
                                <DocumentTextIcon className="h-3 w-3 mr-1" />
                                Receipt
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-medium">${expense.amount.toLocaleString()}</div>
                          <Badge
                            className={`text-xs ${
                              expense.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : expense.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
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
  )
}
