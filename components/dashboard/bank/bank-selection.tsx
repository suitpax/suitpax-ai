"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface BankSelectionProps {
  selectedCountry: string
  selectedBank: string
  onBankSelect: (bankId: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

interface Bank {
  id: string
  name: string
  logo: string
  country: string
}

export const BankSelection = ({
  selectedCountry,
  selectedBank,
  onBankSelect,
  searchTerm,
  onSearchChange,
}: BankSelectionProps) => {
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBanks = async () => {
      if (!selectedCountry) return

      setLoading(true)
      try {
        const response = await fetch(`/api/gocardless/institutions?country=${encodeURIComponent(selectedCountry)}`)
        const data = await response.json()
        const institutions = Array.isArray(data) ? data : []
        const mapped: Bank[] = institutions.map((i: any) => ({
          id: i.id,
          name: i.name,
          logo: i.logo || i.logo_url || "/generic-bank-logo.png",
          country: selectedCountry,
        }))
        const term = searchTerm.trim().toLowerCase()
        const filtered = term
          ? mapped.filter((b) => b.name.toLowerCase().includes(term))
          : mapped
        setFilteredBanks(filtered)
      } catch (error) {
        console.error("Error fetching banks:", error)
        setFilteredBanks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanks()
  }, [selectedCountry, searchTerm])

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedCountry}
          onValueChange={(value) => {
            // Reset selected bank when country changes
            onBankSelect("")
          }}
        >
          <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
            <SelectItem value="ES">🇪🇸 Spain</SelectItem>
            <SelectItem value="FR">🇫🇷 France</SelectItem>
            <SelectItem value="DE">🇩🇪 Germany</SelectItem>
          </SelectContent>
        </Select>

        {/* Bank Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search banks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>
      </div>

      {/* Bank Selection Grid */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide max-h-32 pr-8">
          {loading ? (
            <div className="flex-shrink-0 w-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-500 font-light text-sm">Loading banks...</p>
            </div>
          ) : filteredBanks.length > 0 ? (
            filteredBanks.map((bank) => (
              <Card
                key={bank.id}
                className={`flex-shrink-0 w-48 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  selectedBank === bank.id
                    ? "border-black bg-gray-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm"
                }`}
                onClick={() => onBankSelect(bank.id)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={bank.logo || "/generic-bank-logo.png"}
                    alt={bank.name}
                    className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/generic-bank-logo.png"
                    }}
                  />
                  <span className="font-medium text-black text-sm truncate">{bank.name}</span>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex-shrink-0 w-full text-center py-8">
              <p className="text-gray-500 font-light">
                {selectedCountry
                  ? "Connect your bank account to get started with real-time financial data"
                  : "Select a country to view available banks"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Bank Info */}
      {selectedBank && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-900">
              {filteredBanks.find((bank) => bank.id === selectedBank)?.name}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            You'll be redirected to your bank's secure login page to authorize the connection.
          </p>
        </div>
      )}
    </div>
  )
}

export default BankSelection
