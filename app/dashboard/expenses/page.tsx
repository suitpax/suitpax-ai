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
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockExpenses = [
  {
    id: 1,
    description: "Flight to London",
    category: "Transportation",
    amount: "$1,245.00",
    date: "2024-03-15",
    status: "approved",
    receipt: true,
  },
  {
    id: 2,
    description: "Hilton London Hotel",
    category: "Accommodation",
    amount: "$450.00",
    date: "2024-03-16",
    status: "pending",
    receipt: true,
  },
  {
    id: 3,
    description: "Business Dinner",
    category: "Meals",
    amount: "$125.50",
    date: "2024-03-17",
    status: "approved",
    receipt: false,
  },
  {
    id: 4,
    description: "Taxi to Airport",
    category: "Transportation",
    amount: "$45.00",
    date: "2024-03-18",
    status: "pending",
    receipt: true,
  },
]

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    category: "Transportation",
    amount: "",
    date: "",
    receipt: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Expense submitted:", formData)
    setShowAddForm(false)
    setFormData({
      description: "",
      category: "Transportation",
      amount: "",
      date: "",
      receipt: null,
    })
  }

  const totalExpenses = mockExpenses.reduce((sum, expense) => {
    return sum + Number.parseFloat(expense.amount.replace("$", "").replace(",", ""))
  }, 0)

  const approvedExpenses = mockExpenses
    .filter((expense) => expense.status === "approved")
    .reduce((sum, expense) => {
      return sum + Number.parseFloat(expense.amount.replace("$", "").replace(",", ""))
    }, 0)

  const pendingExpenses = mockExpenses
    .filter((expense) => expense.status === "pending")
    .reduce((sum, expense) => {
      return sum + Number.parseFloat(expense.amount.replace("$", "").replace(",", ""))
    }, 0)

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
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <div>
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
                    <Label htmlFor="amount">Amount</Label>
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
                </div>

                <div>
                  <Label htmlFor="receipt">Receipt (Optional)</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setFormData({ ...formData, receipt: e.target.files?.[0] || null })}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                  />
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-tighter">Recent Expenses</h2>
          <Badge className="bg-gray-200 text-gray-700 border-gray-200">{mockExpenses.length} expenses</Badge>
        </div>

        <div className="space-y-4">
          {mockExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CreditCardIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{expense.description}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
                            {expense.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{expense.date}</span>
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
                        <div className="text-lg font-medium">{expense.amount}</div>
                        <Badge
                          className={`text-xs ${
                            expense.status === "approved" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
