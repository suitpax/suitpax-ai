"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

const BankSelection = () => {
  const [filteredBanks, setFilteredBanks] = useState([
    { id: 1, name: "Bank A", logo: "/bank-a-logo.png" },
    { id: 2, name: "Bank B", logo: "/bank-b-logo.png" },
    // Add more banks as needed
  ])

  const [selectedBank, setSelectedBank] = useState<number | null>(null)

  const onBankSelect = (bankId: number) => {
    setSelectedBank(bankId)
  }

  return (
    <div className="relative">
      <div
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide max-h-32 pr-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
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

      <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
    </div>
  )
}

export default BankSelection
