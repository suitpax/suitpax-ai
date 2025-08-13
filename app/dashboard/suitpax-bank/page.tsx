"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, DollarSign, Download, Settings, CheckCircle, Clock, Building2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankAccountItem } from "@/components/dashboard/bank-account-item"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { BankConnectionModal } from "@/components/dashboard/bank-connection-modal"
import { ExpenseAnalytics } from "@/components/dashboard/expense-analytics"
import { AutoCategorizationSettings } from "@/components/dashboard/auto-categorization-settings"
import { BankNotifications } from "@/components/dashboard/bank-notifications"

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

export default function SuitpaxBankPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlySpending = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const handleConnectBank = async (bankData: any) => {
    setIsConnecting(true)
    try {
      const response = await fetch("/api/gocardless/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankData),
      })

      if (response.ok) {
        const data = await response.json()
        const newAccount: BankAccount = {
          id: data.connectionId || Date.now().toString(),
          name: `${bankData.bank} Business Account`,
          bank: bankData.bank,
          accountNumber: "****" + Math.floor(Math.random() * 9999),
          balance: 0,
          currency: "EUR",
          status: "connected",
          lastSync: new Date().toISOString(),
          type: "business",
        }
        setAccounts([...accounts, newAccount])
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || transaction.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const EmptyState = ({ type }: { type: "accounts" | "transactions" }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {type === "accounts" ? (
          <Building2 className="h-8 w-8 text-gray-500" />
        ) : (
          <DollarSign className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <h3 className="text-xl font-medium tracking-tighter text-gray-900 mb-2">
        {type === "accounts" ? "No bank accounts connected" : "No transactions yet"}
      </h3>
      <p className="text-gray-600 font-light mb-6 max-w-md mx-auto">
        {type === "accounts"
          ? "Connect your first business bank account to start tracking expenses automatically."
          : "Your transaction history will appear here after connecting a bank account."}
      </p>
      {type === "accounts" && (
        <Button
          onClick={() => setShowConnectionModal(true)}
          className="bg-gray-900 text-white hover:bg-black rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Connect Bank Account
        </Button>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header - Following expense page pattern */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Suitpax Bank</h1>
            <p className="text-gray-600 font-light">Secure banking connections for automated expense tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
              onClick={() => setShowConnectionModal(true)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Bank
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPIs - Following expense page pattern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-medium tracking-tighter">€{totalBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
              <p className="text-2xl font-medium tracking-tighter">€{monthlySpending.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
              <p className="text-2xl font-medium tracking-tighter">{accounts.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-medium tracking-tighter">€0</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Tabs - Improved responsive design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-1">
            <TabsTrigger value="overview" className="rounded-xl text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl text-xs md:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="categorization" className="rounded-xl text-xs md:text-sm">
              Auto-Cat
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl text-xs md:text-sm">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl text-xs md:text-sm">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Connected Accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium tracking-tighter text-black">Connected Accounts</h2>
                    {accounts.length > 0 && (
                      <Button variant="outline" size="sm" className="rounded-xl bg-transparent border-gray-200">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    )}
                  </div>
                  {accounts.length === 0 ? (
                    <EmptyState type="accounts" />
                  ) : (
                    <div className="space-y-4">
                      {accounts.map((account) => (
                        <BankAccountItem key={account.id} account={account} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-medium tracking-tighter text-black">Recent Transactions</h2>
                    {transactions.length > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64 rounded-xl border-gray-200"
                          />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                          <SelectTrigger className="w-40 rounded-xl border-gray-200">
                            <SelectValue placeholder="Filter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="accommodation">Accommodation</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                            <SelectItem value="meals">Meals</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="rounded-xl bg-transparent border-gray-200">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                  {transactions.length === 0 ? (
                    <EmptyState type="transactions" />
                  ) : (
                    <TransactionList transactions={filteredTransactions} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics">
            <ExpenseAnalytics />
          </TabsContent>

          <TabsContent value="categorization">
            <AutoCategorizationSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <BankNotifications />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium tracking-tighter text-black mb-4">Bank Connection Settings</h2>
                <p className="text-gray-600 font-light">
                  Advanced settings and account management options coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Security Notice - Improved design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-blue-50/60 backdrop-blur-sm border-blue-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Bank-Level Security</h3>
                <p className="text-sm text-blue-700 font-light">
                  Your banking data is protected with 256-bit SSL encryption and never stored on our servers. We use
                  secure APIs to access read-only transaction data with your explicit consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bank Connection Modal */}
      <BankConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleConnectBank}
      />
    </div>
  )
}
