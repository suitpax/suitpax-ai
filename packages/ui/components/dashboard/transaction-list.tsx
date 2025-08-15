"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Transaction {
  id: string
  amount: number
  currency: string
  description: string
  date: string
  category: string
  status: "completed" | "pending"
  accountId: string
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Accommodation: "bg-blue-100 text-blue-700",
      Transportation: "bg-green-100 text-green-700",
      Meals: "bg-orange-100 text-orange-700",
      Other: "bg-gray-100 text-gray-700",
    }
    return colors[category] || colors["Other"]
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-light">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${transaction.amount < 0 ? "bg-red-100" : "bg-green-100"}`}>
                  {transaction.amount < 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">{transaction.description}</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-1 rounded-lg ${getCategoryColor(transaction.category)}`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {transaction.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-lg font-medium tracking-tighter ${
                    transaction.amount < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {transaction.amount < 0 ? "-" : "+"}
                  {transaction.currency}
                  {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-1 rounded-lg ${
                    transaction.status === "completed"
                      ? "border-green-200 text-green-600"
                      : "border-yellow-200 text-yellow-600"
                  }`}
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
