"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Trash2, Building2 } from "lucide-react"
import type { Institution, BankAccount } from "./types" // Assuming these types are defined in a separate file
import Button from "./Button" // Assuming Button component is defined in a separate file

export function BankConnectionCard() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [selectedCountry, setSelectedCountry] = useState("GB")
  const [selectedInstitution, setSelectedInstitution] = useState("")
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([])

  const handleDisconnectAccount = (accountId: string) => {
    // Logic to handle disconnecting an account
    setConnectedAccounts(connectedAccounts.filter((account) => account.id !== accountId))
  }

  return (
    <div>
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
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        {account.iban ? ` • ${account.iban.slice(-4)}` : ` • •••• ${account.last4}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {account.balance.toLocaleString()} {account.currency}
                      </p>
                      <p className="text-xs text-gray-500">Available</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnectAccount(account.id)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Show empty state when no accounts connected */}
      {connectedAccounts.length === 0 && (
        <div className="mb-6 text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">No accounts connected</h4>
          <p className="text-xs text-gray-600">Connect your first business bank account to get started</p>
        </div>
      )}
    </div>
  )
}
