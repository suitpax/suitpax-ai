"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCardIcon, PlusIcon, CalendarIcon, TagIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const expenseCategories = ["Flight", "Hotel", "Meals", "Transportation", "Conference", "Other"]

const mockExpenses = [
  {
    id: 1,
    description: "Hotel - Hilton London",
    amount: "$450.00",
    date: "March 10, 2024",
    category: "Accommodation",
    status: "Approved",
    receipt: true,
  },
  {
    id: 2,
    description: "Flight - JFK to LHR",
    amount: "$1,245.00",
    date: "March 8, 2024",
    category: "Transportation",
    status: "Pending",
    receipt: true,
  },
  {
    id: 3,
    description: "Business Dinner",
    amount: "$125.50",
    date: "March 7, 2024",
    category: "Meals",
    status: "Approved",
    receipt: false,
  },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number.parseFloat(expense.amount.replace("$", "").replace(",", "")),
    0,
  )
  const pendingExpenses = expenses.filter((e) => e.status === "Pending").length
  const approvedExpenses = expenses.filter((e) => e.status === "Approved").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

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
          <p className="text-gray-600 font-light">Track and manage your business expenses</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-black text-white hover:bg-gray-800">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </motion.div>

      {/* Add Expense Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium tracking-tighter mb-4">Add New Expense</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Input placeholder="Enter expense description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <Input placeholder="$0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input placeholder="Select category" className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">Save Expense</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">{pendingExpenses}</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Approved</p>
              <p className="text-2xl font-medium tracking-tighter mt-1">{approvedExpenses}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <TagIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
        >
          <option value="All">All Categories</option>
          {expenseCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Expenses List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        {filteredExpenses.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCardIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600 font-light mb-6">
              <em className="font-serif italic">
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first expense"}
              </em>
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200">
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                          <CreditCardIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{expense.description}</div>
                          <div className="text-sm text-gray-600">{expense.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="font-medium text-gray-900">{expense.category}</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-500">Amount</div>
                          <div className="text-lg font-medium text-gray-900">{expense.amount}</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-500">Status</div>
                          <div
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              expense.status === "Approved" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {expense.status}
                          </div>
                        </div>

                        <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
