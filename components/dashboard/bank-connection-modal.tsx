"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Building2, Shield, CheckCircle, ArrowRight, Search, Sparkles } from "lucide-react"

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
    { id: "hsbc", name: "HSBC", logo: "/hsbc-bank-logo.png" },
    { id: "barclays", name: "Barclays", logo: "/barclays-logo.png" },
    { id: "lloyds", name: "Lloyds", logo: "/lloyds-bank-logo.png" },
    { id: "natwest", name: "NatWest", logo: "/natwest-logo.png" },
    { id: "santander_uk", name: "Santander UK", logo: "/santander-logo.png" },
    { id: "nationwide", name: "Nationwide", logo: "/generic-bank-logo.png" },
  ],
  ES: [
    { id: "santander", name: "Santander", logo: "/santander-logo.png" },
    { id: "bbva", name: "BBVA", logo: "assets/bbva-logo.png" },
    { id: "caixabank", name: "CaixaBank", logo: "/bank-logos/caixabank.png" },
    { id: "bankia", name: "Bankia", logo: "/bankia-logo.png" },
    { id: "sabadell", name: "Banco Sabadell", logo: "/sabadell-bank-logo.png" },
  ],
  FR: [
    { id: "bnp", name: "BNP Paribas", logo: "/bnp-paribas-logo.png" },
    { id: "credit_agricole", name: "Crédit Agricole", logo: "/credit-agricole-logo.png" },
    { id: "societe_generale", name: "Société Générale", logo: "/societe-generale-logo.png" },
    { id: "lcl", name: "LCL", logo: "/generic-bank-logo.png" },
  ],
  DE: [
    { id: "deutsche_bank", name: "Deutsche Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "commerzbank", name: "Commerzbank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "ing_de", name: "ING Germany", logo: "/placeholder.svg?height=32&width=32" },
  ],
  IT: [
    { id: "intesa", name: "Intesa Sanpaolo", logo: "/placeholder.svg?height=32&width=32" },
    { id: "unicredit", name: "UniCredit", logo: "/placeholder.svg?height=32&width=32" },
  ],
  NL: [
    { id: "ing_nl", name: "ING Netherlands", logo: "/placeholder.svg?height=32&width=32" },
    { id: "rabobank", name: "Rabobank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "abn_amro", name: "ABN AMRO", logo: "/placeholder.svg?height=32&width=32" },
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
    try {
      const response = await fetch("/api/gocardless/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          bank: selectedBank,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        onConnect({
          country: selectedCountry,
          bank: selectedBank,
          connectionId: data.connectionId,
        })
        onClose()
        setStep(1)
        setSelectedCountry("")
        setSelectedBank("")
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const availableBanks = selectedCountry ? BANKS[selectedCountry as keyof typeof BANKS] || [] : []
  const filteredBanks = availableBanks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/50 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_0%,transparent_50%)] rounded-2xl" />

        <div className="relative z-10">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-medium tracking-tighter text-black">
                  Connect with Suitpax Connect
                </DialogTitle>
                <p className="text-sm text-gray-600 font-light">Secure bank-level encryption for your business</p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                      step >= stepNum ? "bg-black text-white shadow-lg" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-0.5 mx-3 transition-all ${step > stepNum ? "bg-black" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Select Country */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-medium tracking-tighter text-black mb-2">Select Your Country</h3>
                  <p className="text-gray-600 font-light">Choose where your business bank account is located</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {COUNTRIES.map((country) => (
                    <Card
                      key={country.code}
                      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                        selectedCountry === country.code
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                      }`}
                      onClick={() => setSelectedCountry(country.code)}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <span className="text-3xl">{country.flag}</span>
                        <span className="font-medium text-black text-center">{country.name}</span>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedCountry}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-3 font-medium tracking-tight disabled:opacity-50"
                >
                  Continue to Banks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Select Bank */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-medium tracking-tighter text-black mb-2">Select Your Bank</h3>
                  <p className="text-gray-600 font-light">Choose your business banking provider</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for your bank..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm h-12"
                  />
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-4 min-w-max">
                    {filteredBanks.map((bank) => (
                      <Card
                        key={bank.id}
                        className={`flex-shrink-0 w-48 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                          selectedBank === bank.id
                            ? "border-black bg-gray-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                        }`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={bank.logo || "/placeholder.svg"}
                            alt={bank.name}
                            className="w-8 h-8 rounded-lg object-contain"
                          />
                          <span className="font-medium text-black text-sm">{bank.name}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!selectedBank}
                    className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl font-medium tracking-tight disabled:opacity-50"
                  >
                    Continue to Security
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Security & Connect */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-medium tracking-tighter text-black mb-2">Security & Permissions</h3>
                  <p className="text-gray-600 font-light">Your data is protected with enterprise-grade security</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-100">
                    <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Bank-Level Security</h4>
                      <p className="text-sm text-blue-700">
                        Your data is protected with 256-bit SSL encryption and never stored on our servers. We comply
                        with PCI DSS and GDPR standards.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
                    <h4 className="font-medium text-black mb-4">We will securely access:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Account balance and details",
                        "Transaction history (up to 24 months)",
                        "Account holder information",
                        "Payment references and descriptions",
                      ].map((permission, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm"
                    disabled={isConnecting}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex-1 bg-black text-white hover:bg-gray-800 rounded-xl font-medium tracking-tight disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 mr-2" />
                        Connect with Suitpax Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
