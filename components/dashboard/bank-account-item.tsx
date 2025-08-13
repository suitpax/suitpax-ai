"use client"

import { motion } from "framer-motion"
import { Building2, CheckCircle, Clock, AlertCircle, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BankAccount {
  id: string
  name: string
  bank: string
  accountNumber: string
  balance: number
  currency: string
  status: "connected" | "pending" | "error"
  lastSync: string
  type: "business" | "personal"
}

interface BankAccountItemProps {
  account: BankAccount
}

export function BankAccountItem({ account }: BankAccountItemProps) {
  const getStatusIcon = () => {
    switch (account.status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = () => {
    switch (account.status) {
      case "connected":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "error":
        return "bg-red-100 text-red-700"
    }
  }

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-black">{account.name}</h3>
                <Badge variant="secondary" className={`text-xs px-2 py-1 rounded-lg ${getStatusColor()}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon()}
                    {account.status}
                  </span>
                </Badge>
              </div>
              <p className="text-sm text-gray-600 font-light">
                {account.bank} • {account.accountNumber}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last sync: {formatLastSync(account.lastSync)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-medium tracking-tighter text-black">
                {account.currency}
                {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <Badge variant="outline" className="text-xs px-2 py-1 rounded-lg border-gray-200 text-gray-600">
                {account.type}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
