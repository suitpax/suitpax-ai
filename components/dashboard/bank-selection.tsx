"use client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Bank {
  id: string
  name: string
  logo: string
}

interface BankSelectionProps {
  selectedCountry: string
  selectedBank: string
  onBankSelect: (bankId: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  className?: string
}

const BANKS = {
  GB: [
    { id: "hsbc", name: "HSBC", logo: "/hsbc-bank-logo.png" },
    { id: "barclays", name: "Barclays", logo: "/barclays-logo.png" },
    { id: "lloyds", name: "Lloyds", logo: "/lloyds-bank-logo.png" },
    { id: "natwest", name: "NatWest", logo: "/natwest-logo.png" },
    { id: "santander_uk", name: "Santander UK", logo: "/santander-logo.png" },
    { id: "nationwide", name: "Nationwide", logo: "/generic-bank-logo.png" },
    { id: "halifax", name: "Halifax", logo: "/generic-bank-logo.png" },
    { id: "first_direct", name: "First Direct", logo: "/generic-bank-logo.png" },
  ],
  ES: [
    { id: "santander", name: "Santander", logo: "/santander-logo.png" },
    { id: "bbva", name: "BBVA", logo: "assets/bbva-logo.png" },
    { id: "caixabank", name: "CaixaBank", logo: "/bank-logos/caixabank.png" },
    { id: "bankia", name: "Bankia", logo: "/bankia-logo.png" },
    { id: "sabadell", name: "Banco Sabadell", logo: "/sabadell-bank-logo.png" },
    { id: "ing_es", name: "ING España", logo: "/generic-bank-logo.png" },
  ],
  FR: [
    { id: "bnp", name: "BNP Paribas", logo: "/bnp-paribas-logo.png" },
    { id: "credit_agricole", name: "Crédit Agricole", logo: "/credit-agricole-logo.png" },
    { id: "societe_generale", name: "Société Générale", logo: "/societe-generale-logo.png" },
    { id: "lcl", name: "LCL", logo: "/generic-bank-logo.png" },
    { id: "credit_mutuel", name: "Crédit Mutuel", logo: "/generic-bank-logo.png" },
  ],
  DE: [
    { id: "deutsche_bank", name: "Deutsche Bank", logo: "/generic-bank-logo.png" },
    { id: "commerzbank", name: "Commerzbank", logo: "/generic-bank-logo.png" },
    { id: "ing_de", name: "ING Germany", logo: "/generic-bank-logo.png" },
    { id: "dkb", name: "DKB", logo: "/generic-bank-logo.png" },
  ],
  IT: [
    { id: "intesa", name: "Intesa Sanpaolo", logo: "/generic-bank-logo.png" },
    { id: "unicredit", name: "UniCredit", logo: "/generic-bank-logo.png" },
    { id: "bnl", name: "BNL", logo: "/generic-bank-logo.png" },
  ],
  NL: [
    { id: "ing_nl", name: "ING Netherlands", logo: "/generic-bank-logo.png" },
    { id: "rabobank", name: "Rabobank", logo: "/generic-bank-logo.png" },
    { id: "abn_amro", name: "ABN AMRO", logo: "/generic-bank-logo.png" },
  ],
}

export function BankSelection({
  selectedCountry,
  selectedBank,
  onBankSelect,
  searchTerm,
  onSearchChange,
  className = "",
}: BankSelectionProps) {
  const availableBanks = selectedCountry ? BANKS[selectedCountry as keyof typeof BANKS] || [] : []
  const filteredBanks = availableBanks.filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search for your bank..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm h-12"
        />
      </div>

      <div className="relative">
        <div
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitScrollbar: { display: "none" },
          }}
        >
          {filteredBanks.map((bank) => (
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
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {filteredBanks.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-light">No banks found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}
