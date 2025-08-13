"use client"

import { useState } from "react"
import { Plus, TrendingUp, DollarSign, Download, Settings, CheckCircle, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      name: "Business Current Account",
      bank: "HSBC Business",
      accountNumber: "****1234",
      balance: 45280.5,
      currency: "EUR",
      status: "connected",
      lastSync: "2024-01-15T10:30:00Z",
      type: "business",
    },
    {
      id: "2",
      name: "Company Expenses",
      bank: "Santander Business",
      accountNumber: "****5678",
      balance: 12450.75,
      currency: "EUR",
      status: "connected",
      lastSync: "2024-01-15T09:15:00Z",
      type: "business",
    },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: -450.0,
      currency: "EUR",
      description: "Hotel Booking - Madrid",
      date: "2024-01-15T08:30:00Z",
      category: "Accommodation",
      status: "completed",
      accountId: "1",
    },
    {
      id: "2",
      amount: -89.5,
      currency: "EUR",
      description: "Flight Booking Fee",
      date: "2024-01-14T14:20:00Z",
      category: "Transportation",
      status: "completed",
      accountId: "1",
    },
    {
      id: "3",
      amount: -125.3,
      currency: "EUR",
      description: "Business Lunch - Client Meeting",
      date: "2024-01-14T12:45:00Z",
      category: "Meals",
      status: "completed",
      accountId: "2",
    },
  ])

  const [isConnecting, setIsConnecting] = useState(false)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlySpending = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const handleConnectBank = async (bankData: any) => {
    setIsConnecting(true)
    // Simulate GoCardless API call
    setTimeout(() => {
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        name: `${bankData.bank} Business Account`,
        bank: bankData.bank,
        accountNumber: "****" + Math.floor(Math.random() * 9999),
        balance: Math.floor(Math.random() * 50000),
        currency: "EUR",
        status: "connected",
        lastSync: new Date().toISOString(),
        type: "business",
      }
      setAccounts([...accounts, newAccount])
      setIsConnecting(false)
    }, 2000)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || transaction.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-black">Suitpax Bank</h1>
            <p className="text-gray-600 font-light mt-2">
              Manage your business banking connections and expense tracking
            </p>
          </div>
          <Button
            onClick={() => setShowConnectionModal(true)}
            disabled={isConnecting}
            className="bg-black text-white hover:bg-gray-800 rounded-2xl px-6 py-3"
          >
            {isConnecting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Connect Bank Account
              </>
            )}
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Balance</p>
                <p className="text-2xl font-medium tracking-tighter text-black mt-1">
                  €{totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-gray-200 rounded-xl">
                <DollarSign className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Spending</p>
                <p className="text-2xl font-medium tracking-tighter text-black mt-1">
                  €{monthlySpending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-gray-200 rounded-xl">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Connected Accounts</p>
                <p className="text-2xl font-medium tracking-tighter text-black mt-1">{accounts.length}</p>
              </div>
              <div className="p-3 bg-gray-200 rounded-xl">
                <Building2 className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-1">
            <TabsTrigger value="overview" className="rounded-xl">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="categorization" className="rounded-xl">
              Auto-Categorization
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Connected Accounts */}
            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium tracking-tighter text-black">Connected Accounts</h2>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <BankAccountItem key={account.id} account={account} />
                ))}
              </div>
            </Card>

            {/* Transactions */}
            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-xl font-medium tracking-tighter text-black">Recent Transactions</h2>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 rounded-xl border-gray-200"
                  />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40 rounded-xl border-gray-200">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="meals">Meals</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <TransactionList transactions={filteredTransactions} />
            </Card>
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
            <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-medium tracking-tighter text-black mb-4">Bank Connection Settings</h2>
              <p className="text-gray-600">Advanced settings and account management options coming soon.</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="bg-blue-50/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Bank-Level Security</h3>
              <p className="text-sm text-blue-700 font-light">
                Your banking data is protected with 256-bit SSL encryption and never stored on our servers. We use
                GoCardless's secure API to access read-only transaction data with your explicit consent.
              </p>
            </div>
          </div>
        </Card>

        {/* Bank Connection Modal */}
        <BankConnectionModal
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
          onConnect={handleConnectBank}
        />
      </div>
    </div>
  )
}
