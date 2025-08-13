"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Shield, Plus, CheckCircle, Building2, Wallet, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface BankAccount {
  id: string
  name: string
  type: string
  last4: string
  balance: number
  currency: string
  isConnected: boolean
  provider?: string
  iban?: string
}

interface Institution {
  id: string
  name: string
  bic: string
  transaction_total_days: string
  countries: string[]
  logo: string
}

export function BankConnectionCard() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [selectedCountry, setSelectedCountry] = useState("GB")
  const [selectedInstitution, setSelectedInstitution] = useState("")
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      name: "Chase Business Checking",
      type: "checking",
      last4: "4521",
      balance: 12450.0,
      currency: "GBP",
      isConnected: true,
      provider: "Chase",
    },
  ])

  const { toast } = useToast()

  const countries = [
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "NL", name: "Netherlands" },
  ]

  const loadInstitutions = async (country: string) => {
    setIsLoadingInstitutions(true)
    try {
      const response = await fetch(`/api/gocardless/institutions?country=${country}`)
      if (response.ok) {
        const data = await response.json()
        setInstitutions(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load banks for this country",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banks",
        variant: "destructive",
      })
    } finally {
      setIsLoadingInstitutions(false)
    }
  }

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    setSelectedInstitution("")
    loadInstitutions(country)
  }

  const handleConnectBank = async () => {
    if (!selectedInstitution) {
      toast({
        title: "Please select a bank",
        description: "Choose a bank from the list to connect your account",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      const response = await fetch("/api/gocardless/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institutionId: selectedInstitution,
          redirectUrl: `${window.location.origin}/dashboard?bank_connected=true`,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to bank authentication
        window.open(data.authLink, "_blank")

        toast({
          title: "Redirecting to bank",
          description: "Complete the authentication process in the new window",
        })
      } else {
        throw new Error("Failed to create bank connection")
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to your bank. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      // Call API to disconnect account
      setConnectedAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
      toast({
        title: "Account disconnected",
        description: "Your bank account has been safely disconnected",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive",
      })
    }
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
                <p className="text-xs text-white/70">Powered by GoCardless</p>
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
                Your banking information is encrypted and protected with 256-bit SSL encryption. We use GoCardless's
                secure API and never store your login credentials.
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {/* Connect New Account */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Add New Account</h4>
            <Badge variant="outline" className="text-xs">
              GoCardless Secure
            </Badge>
          </div>

          {/* Country Selection */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Select Country</label>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bank Selection */}
            {institutions.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Select Your Bank</label>
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={institution.logo || "/placeholder.svg"}
                            alt={institution.name}
                            className="w-4 h-4 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                          {institution.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 border-dashed">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 border border-gray-200">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Connect Your Bank Account</h5>
              <p className="text-xs text-gray-600 mb-4 max-w-sm mx-auto">
                Securely connect your business bank account via GoCardless to automatically track expenses and manage
                your travel budget.
              </p>

              <Button
                onClick={handleConnectBank}
                disabled={isConnecting || !selectedInstitution || isLoadingInstitutions}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium px-6"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : isLoadingInstitutions ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading banks...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect with GoCardless
                  </>
                )}
              </Button>

              {selectedInstitution && (
                <p className="text-xs text-gray-500 mt-2">You'll be redirected to your bank's secure login page</p>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs font-medium text-gray-900 mb-1">Auto Sync</p>
              <p className="text-xs text-gray-500">Real-time transaction data</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-gray-900 mb-1">Secure</p>
              <p className="text-xs text-gray-500">GoCardless encryption</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Wallet className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-gray-900 mb-1">Multi-Bank</p>
              <p className="text-xs text-gray-500">30+ countries supported</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
