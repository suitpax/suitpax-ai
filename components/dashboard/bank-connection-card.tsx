"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Shield, Plus, CheckCircle, Building2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BankAccount {
  id: string
  name: string
  type: string
  last4: string
  balance: number
  isConnected: boolean
}

export function BankConnectionCard() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      name: "Chase Business Checking",
      type: "checking",
      last4: "4521",
      balance: 12450.0,
      isConnected: true,
    },
  ])

  const handleConnectBank = async () => {
    setIsConnecting(true)
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false)
      // Here you would integrate with Plaid or similar service
      console.log("Connecting to bank...")
    }, 2000)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tighter">Bank Accounts</h3>
                <p className="text-xs text-white/70">Manage your connected accounts</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
              {connectedAccounts.length} Connected
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Bank-level Security</h4>
              <p className="text-xs text-blue-700">
                Your banking information is encrypted and protected with 256-bit SSL encryption. We never store your
                login credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Connected Accounts</h4>
            <div className="space-y-3">
              {connectedAccounts.map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{account.name}</p>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500">
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)} •••• {account.last4}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${account.balance.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Available</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Connect New Account */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Add New Account</h4>
            <Badge variant="outline" className="text-xs">
              Secure Connection
            </Badge>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 border-dashed">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 border border-gray-200">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Connect Your Bank Account</h5>
              <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto">
                Securely connect your business bank account to automatically track expenses and manage your travel
                budget.
              </p>

              <Button
                onClick={handleConnectBank}
                disabled={isConnecting}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium px-6"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Bank Account
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs font-medium text-gray-900 mb-1">Auto Sync</p>
              <p className="text-xs text-gray-500">Automatic expense tracking</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-gray-900 mb-1">Secure</p>
              <p className="text-xs text-gray-500">Bank-level encryption</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Wallet className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-gray-900 mb-1">Real-time</p>
              <p className="text-xs text-gray-500">Live balance updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
