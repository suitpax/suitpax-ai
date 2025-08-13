"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Building2, ArrowUpRight, ArrowDownRight, Plus, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { NumberFlow } from "@/components/ui/number-flow"
import { useUserData } from "@/hooks/use-user-data"

interface BankAccount {
  id: string
  bank_name: string
  account_type: string
  balance: number
  currency: string
  last_updated: string
  status: "connected" | "pending" | "error"
}

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
  category: string
  status: "completed" | "pending"
}

export function BankConnectionSection() {
  const { user, profile } = useUserData()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        // Fetch connected bank accounts
        const accountsResponse = await fetch("/api/gocardless/accounts")
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json()
          setAccounts(accountsData.accounts || [])
        }

        // Fetch recent transactions
        const transactionsResponse = await fetch("/api/gocardless/transactions")
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          setTransactions(transactionsData.transactions || [])
        }
      } catch (error) {
        console.error("Error fetching bank data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBankData()
    }
  }, [user])

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyIncome = transactions
    .filter((t) => t.type === "income" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)

  const handleConnectBank = () => {
    // Redirect to bank connection flow
    window.location.href = "/dashboard/suitpax-bank"
  }

  if (loading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-pulse"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-300 text-sm font-medium">Your Balance</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-2xl font-light">$</span>
                <NumberFlow
                  value={totalBalance}
                  className="text-3xl font-medium tracking-tight"
                  format={{
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Compared to last month <span className="text-green-400">+2.4%</span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                {accounts.length} Account{accounts.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowUpRight className="h-3 w-3 text-green-400" />
                <span className="text-xs text-gray-400">Income</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">$</span>
                <NumberFlow
                  value={monthlyIncome}
                  className="text-lg font-medium"
                  format={{
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <ArrowDownRight className="h-3 w-3 text-red-400" />
                <span className="text-xs text-gray-400">Expenses</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm">$</span>
                <NumberFlow
                  value={monthlyExpenses}
                  className="text-lg font-medium"
                  format={{
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 font-medium">Connected Accounts</CardTitle>
            <Button onClick={handleConnectBank} size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Connect Bank
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No banks connected</h3>
              <p className="text-gray-600 mb-4">
                Connect your business bank account to get started with expense tracking
              </p>
              <Button onClick={handleConnectBank} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Connect Securely with Suitpax Connect
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{account.bank_name}</h4>
                      <p className="text-sm text-gray-600">{account.account_type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-medium text-gray-900">${account.balance.toLocaleString()}</span>
                      {account.status === "connected" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {account.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <Badge
                      variant={account.status === "connected" ? "default" : "secondary"}
                      className={
                        account.status === "connected" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }
                    >
                      {account.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 font-medium">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{transaction.description}</h4>
                      <p className="text-xs text-gray-600">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium text-sm ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
