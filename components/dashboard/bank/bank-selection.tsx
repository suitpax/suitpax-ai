"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building2, Globe } from "lucide-react"

interface BankSelectionProps {
  selectedCountry: string
  selectedBank: string
  onBankSelect: (bankId: string, bankName: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  onBankNameResolve?: (name: string) => void
}

interface Bank {
  id: string
  name: string
  logo: string
  country: string
}

const SUPPORTED_COUNTRIES = [
  { code: "GB", name: "United Kingdom" },
  { code: "ES", name: "Spain" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "AT", name: "Austria" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  { code: "LU", name: "Luxembourg" },
  { code: "FI", name: "Finland" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
]

export const BankSelection = ({
  selectedCountry,
  selectedBank,
  onBankSelect,
  searchTerm,
  onSearchChange,
  onBankNameResolve,
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
        const filtered = term ? mapped.filter((b) => b.name.toLowerCase().includes(term)) : mapped
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
    <div className="space-y-6">
      {/* Country Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Country</label>
          <Select
            value={selectedCountry}
            onValueChange={(value) => {
              // Reset selected bank when country changes
              onBankSelect("", "")
            }}
          >
            <SelectTrigger className="w-full rounded-xl border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <SelectValue placeholder="Choose country" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {SUPPORTED_COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bank Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Banks</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by bank name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bank Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tighter text-gray-900">
            Available Banks
            {filteredBanks.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({filteredBanks.length} found)</span>
            )}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <p className="text-gray-500 font-light text-sm ml-3">Loading banks...</p>
          </div>
        ) : filteredBanks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBanks.map((bank) => (
              <Card
                key={bank.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  selectedBank === bank.id
                    ? "border-black bg-gray-50 shadow-md ring-2 ring-gray-900 ring-opacity-20"
                    : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                }`}
                onClick={() => onBankSelect(bank.id, bank.name)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={bank.logo || "/generic-bank-logo.png"}
                      alt={bank.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/generic-bank-logo.png"
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">{bank.name}</h4>
                    <p className="text-xs text-gray-500">
                      {SUPPORTED_COUNTRIES.find((c) => c.code === bank.country)?.name}
                    </p>
                  </div>
                  {selectedBank === bank.id && (
                    <div className="w-full pt-2 border-t border-gray-200">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-900 text-white text-xs font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-light">
              {selectedCountry
                ? searchTerm
                  ? `No banks found matching "${searchTerm}"`
                  : "No banks available for this country"
                : "Select a country to view available banks"}
            </p>
          </div>
        )}
      </div>

      {/* Selected Bank Info */}
      {selectedBank && (
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Ready to connect: {filteredBanks.find((bank) => bank.id === selectedBank)?.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                You'll be redirected to your bank's secure login page to authorize the connection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BankSelection
