"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Building2, Shield, CheckCircle, ArrowRight, Search } from "lucide-react"

interface BankConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (bankData: any) => void
}

const COUNTRIES = [
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
]

const BANKS = {
  GB: [
    { id: "hsbc", name: "HSBC", logo: "🏦" },
    { id: "barclays", name: "Barclays", logo: "🏦" },
    { id: "lloyds", name: "Lloyds", logo: "🏦" },
    { id: "natwest", name: "NatWest", logo: "🏦" },
  ],
  ES: [
    { id: "santander", name: "Santander", logo: "🏦" },
    { id: "bbva", name: "BBVA", logo: "🏦" },
    { id: "caixabank", name: "CaixaBank", logo: "🏦" },
    { id: "bankia", name: "Bankia", logo: "🏦" },
  ],
  FR: [
    { id: "bnp", name: "BNP Paribas", logo: "🏦" },
    { id: "credit_agricole", name: "Crédit Agricole", logo: "🏦" },
    { id: "societe_generale", name: "Société Générale", logo: "🏦" },
  ],
}

export function BankConnectionModal({ isOpen, onClose, onConnect }: BankConnectionModalProps) {
  const [step, setStep] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate GoCardless connection
    setTimeout(() => {
      onConnect({
        country: selectedCountry,
        bank: selectedBank,
      })
      setIsConnecting(false)
      onClose()
      setStep(1)
      setSelectedCountry("")
      setSelectedBank("")
    }, 3000)
  }

  const availableBanks = selectedCountry ? BANKS[selectedCountry as keyof typeof BANKS] || [] : []
  const filteredBanks = availableBanks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium tracking-tighter text-black">
            Connect Your Bank Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && <div className={`w-12 h-0.5 mx-2 ${step > stepNum ? "bg-black" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Country */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-black">Select Your Country</h3>
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((country) => (
                  <Card
                    key={country.code}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedCountry === country.code
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedCountry(country.code)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-medium text-black">{country.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedCountry}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Select Bank */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-black">Select Your Bank</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for your bank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredBanks.map((bank) => (
                  <Card
                    key={bank.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedBank === bank.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedBank(bank.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{bank.logo}</span>
                      <span className="font-medium text-black">{bank.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedBank}
                  className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Security & Connect */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-black">Security & Permissions</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Bank-Level Security</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your data is protected with 256-bit SSL encryption and never stored on our servers.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-black">We will access:</h4>
                  <div className="space-y-2">
                    {[
                      "Account balance and details",
                      "Transaction history (up to 24 months)",
                      "Account holder information",
                    ].map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl"
                  disabled={isConnecting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 mr-2" />
                      Connect Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
