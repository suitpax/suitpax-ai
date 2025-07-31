"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
  CreditCardIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"

const expenseCategories = ["Flight", "Hotel", "Meals", "Transportation", "Conference", "Other"]

const mockExpenses = [
  {
    id: 1,
    title: "Flight to New York",
    amount: 450.0,
    category: "Flight",
    date: "2024-01-15",
    status: "approved",
    receipt: true,
  },
  {
    id: 2,
    title: "Hotel Manhattan",
    amount: 280.0,
    category: "Hotel",
    date: "2024-01-16",
    status: "pending",
    receipt: true,
  },
  {
    id: 3,
    title: "Client Dinner",
    amount: 125.5,
    category: "Meals",
    date: "2024-01-17",
    status: "draft",
    receipt: false,
  },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = expenses.filter((e) => e.status === "pending").length
  const approvedExpenses = expenses.filter((e) => e.status === "approved").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-8">
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
            <em className="font-serif italic">Track and manage your travel expenses</em>
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </motion.div>

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
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
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
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Expense
            </button>
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200">
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-200 rounded-xl">
                      <CreditCardIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium tracking-tight text-gray-900">{expense.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 font-light">
                          <em className="font-serif italic">{expense.category}</em>
                        </span>
                        <span className="text-sm text-gray-600 font-light">
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                        {expense.receipt && (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <DocumentArrowUpIcon className="h-3 w-3 mr-1" />
                            Receipt
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-medium tracking-tighter">${expense.amount.toLocaleString()}</p>
                      <div
                        className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium border ${getStatusColor(expense.status)}`}
                      >
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
