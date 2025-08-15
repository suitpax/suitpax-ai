"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  StarIcon,
  PlusIcon,
  TrashIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LoyaltyProgram {
  id: string
  airline_iata_code: string
  airline_name: string
  account_number: string
  tier?: string
  type: "personal" | "corporate"
}

interface CorporateContract {
  id: string
  airline_iata_code: string
  airline_name: string
  contract_name: string
  discount_percentage?: number
  benefits: string[]
}

interface LoyaltyProgramsProps {
  onProgramsChange?: (programs: LoyaltyProgram[]) => void
  onCorporateContractsChange?: (contracts: CorporateContract[]) => void
  className?: string
}

// Aerolíneas principales con programas de lealtad
const MAJOR_AIRLINES = [
  { code: "AA", name: "American Airlines", program: "AAdvantage" },
  { code: "UA", name: "United Airlines", program: "MileagePlus" },
  { code: "DL", name: "Delta Air Lines", program: "SkyMiles" },
  { code: "BA", name: "British Airways", program: "Executive Club" },
  { code: "LH", name: "Lufthansa", program: "Miles & More" },
  { code: "AF", name: "Air France", program: "Flying Blue" },
  { code: "KL", name: "KLM", program: "Flying Blue" },
  { code: "IB", name: "Iberia", program: "Iberia Plus" },
  { code: "VS", name: "Virgin Atlantic", program: "Flying Club" },
  { code: "EK", name: "Emirates", program: "Skywards" },
  { code: "QR", name: "Qatar Airways", program: "Privilege Club" },
  { code: "SQ", name: "Singapore Airlines", program: "KrisFlyer" },
  { code: "CX", name: "Cathay Pacific", program: "Asia Miles" },
  { code: "JL", name: "Japan Airlines", program: "JAL Mileage Bank" },
  { code: "NH", name: "ANA", program: "ANA Mileage Club" },
]

const TIER_LEVELS = ["Basic", "Silver", "Gold", "Platinum", "Diamond"]

export function LoyaltyProgramsManager({
  onProgramsChange,
  onCorporateContractsChange,
  className = "",
}: LoyaltyProgramsProps) {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([])
  const [corporateContracts, setCorporateContracts] = useState<CorporateContract[]>([])
  const [showAddProgram, setShowAddProgram] = useState(false)
  const [showAddCorporate, setShowAddCorporate] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Estado para nuevo programa personal
  const [newProgram, setNewProgram] = useState({
    airline_iata_code: "",
    account_number: "",
    tier: "",
  })

  // Estado para nuevo contrato corporativo
  const [newCorporate, setNewCorporate] = useState({
    airline_iata_code: "",
    contract_name: "",
    discount_percentage: 0,
  })

  useEffect(() => {
    const savedPrograms = typeof window !== "undefined" ? localStorage.getItem("suitpax_loyalty_programs") : null
    const savedContracts = typeof window !== "undefined" ? localStorage.getItem("suitpax_corporate_contracts") : null

    if (savedPrograms) {
      try {
        const parsed = JSON.parse(savedPrograms)
        setPrograms(parsed)
        onProgramsChange?.(parsed)
      } catch (error) {
        console.error("Error loading loyalty programs:", error)
      }
    }

    if (savedContracts) {
      try {
        const parsed = JSON.parse(savedContracts)
        setCorporateContracts(parsed)
        onCorporateContractsChange?.(parsed)
      } catch (error) {
        console.error("Error loading corporate contracts:", error)
      }
    }
  }, [onProgramsChange, onCorporateContractsChange])

  const savePrograms = (updatedPrograms: LoyaltyProgram[]) => {
    setPrograms(updatedPrograms)
    if (typeof window !== "undefined") {
      localStorage.setItem("suitpax_loyalty_programs", JSON.stringify(updatedPrograms))
    }
    onProgramsChange?.(updatedPrograms)
  }

  const saveCorporateContracts = (updatedContracts: CorporateContract[]) => {
    setCorporateContracts(updatedContracts)
    if (typeof window !== "undefined") {
      localStorage.setItem("suitpax_corporate_contracts", JSON.stringify(updatedContracts))
    }
    onCorporateContractsChange?.(updatedContracts)
  }

  const addLoyaltyProgram = () => {
    if (!newProgram.airline_iata_code || !newProgram.account_number) return

    const airline = MAJOR_AIRLINES.find((a) => a.code === newProgram.airline_iata_code)
    if (!airline) return

    const program: LoyaltyProgram = {
      id: Date.now().toString(),
      airline_iata_code: newProgram.airline_iata_code,
      airline_name: airline.name,
      account_number: newProgram.account_number,
      tier: newProgram.tier || "Basic",
      type: "personal",
    }

    savePrograms([...programs, program])
    setNewProgram({ airline_iata_code: "", account_number: "", tier: "" })
    setShowAddProgram(false)
  }

  const addCorporateContract = () => {
    if (!newCorporate.airline_iata_code || !newCorporate.contract_name) return

    const airline = MAJOR_AIRLINES.find((a) => a.code === newCorporate.airline_iata_code)
    if (!airline) return

    const contract: CorporateContract = {
      id: Date.now().toString(),
      airline_iata_code: newCorporate.airline_iata_code,
      airline_name: airline.name,
      contract_name: newCorporate.contract_name,
      discount_percentage: newCorporate.discount_percentage,
      benefits: ["Priority booking", "Flexible cancellation", "Dedicated support", "Bulk booking discounts"],
    }

    saveCorporateContracts([...corporateContracts, contract])
    setNewCorporate({ airline_iata_code: "", contract_name: "", discount_percentage: 0 })
    setShowAddCorporate(false)
  }

  const removeProgram = (id: string) => {
    savePrograms(programs.filter((p) => p.id !== id))
  }

  const removeCorporateContract = (id: string) => {
    saveCorporateContracts(corporateContracts.filter((c) => c.id !== id))
  }

  const getTierIcon = (tier: string) => {
    const tierLevel = TIER_LEVELS.indexOf(tier)
    if (tierLevel >= 3) return <StarIconSolid className="h-3 w-3 text-yellow-500" />
    if (tierLevel >= 2) return <StarIcon className="h-3 w-3 text-yellow-500" />
    return <StarIcon className="h-3 w-3 text-gray-400" />
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Diamond":
      case "Platinum":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Gold":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Silver":
        return "bg-gray-50 text-gray-700 border-gray-300"
      default:
        return "bg-blue-50 text-blue-700 border-blue-200"
    }
  }

  const totalPrograms = programs.length + corporateContracts.length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header con resumen */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
          >
            <StarIcon className="h-4 w-4 mr-2" />
            Loyalty Programs
            {totalPrograms > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                {totalPrograms}
              </Badge>
            )}
            <ChevronDownIcon className={`h-3 w-3 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {totalPrograms > 0 && (
          <div className="flex items-center space-x-2">
            {programs.slice(0, 3).map((program) => (
              <Badge
                key={program.id}
                variant="outline"
                className={`text-xs ${getTierColor(program.tier || "Basic")}`}
              >
                {getTierIcon(program.tier || "Basic")}
                <span className="ml-1">{program.airline_iata_code}</span>
              </Badge>
            ))}
            {corporateContracts.slice(0, 2).map((contract) => (
              <Badge key={contract.id} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                {contract.airline_iata_code}
              </Badge>
            ))}
            {totalPrograms > 5 && (
              <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                +{totalPrograms - 5}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Panel expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium flex items-center">
                  <StarIcon className="h-5 w-5 mr-2" />
                  Manage Loyalty Programs
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Add your frequent flyer accounts and corporate contracts to unlock better prices and benefits.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Programas personales */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Personal Programs
                    </h4>
                    <Button variant="outline" size="sm" onClick={() => setShowAddProgram(true)} className="text-xs">
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Program
                    </Button>
                  </div>

                  {programs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {programs.map((program) => (
                        <div
                          key={program.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">{program.airline_iata_code}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{program.airline_name}</div>
                              <div className="text-xs text-gray-600">{program.account_number}</div>
                              <Badge variant="outline" className={`text-xs mt-1 ${getTierColor(program.tier || "Basic")}`}>
                                {getTierIcon(program.tier || "Basic")}
                                <span className="ml-1">{program.tier || "Basic"}</span>
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProgram(program.id)}
                            className="text-red-500 hover:text-red-700 p-1 h-auto"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                      <StarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No personal programs added yet</p>
                    </div>
                  )}

                  {/* Formulario para agregar programa personal */}
                  <AnimatePresence>
                    {showAddProgram && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Airline</Label>
                              <Select
                                value={newProgram.airline_iata_code}
                                onValueChange={(value) => setNewProgram((prev) => ({ ...prev, airline_iata_code: value }))}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Select airline" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MAJOR_AIRLINES.map((airline) => (
                                    <SelectItem key={airline.code} value={airline.code}>
                                      {airline.code} - {airline.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700">Account Number</Label>
                              <Input
                                type="text"
                                value={newProgram.account_number}
                                onChange={(e) => setNewProgram((prev) => ({ ...prev, account_number: e.target.value }))}
                                placeholder="Enter account number"
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700">Tier Level</Label>
                              <Select value={newProgram.tier} onValueChange={(value) => setNewProgram((prev) => ({ ...prev, tier: value }))}>
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Select tier" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIER_LEVELS.map((tier) => (
                                    <SelectItem key={tier} value={tier}>
                                      {tier}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddProgram(false)} className="text-xs">
                              Cancel
                            </Button>
                            <Button size="sm" onClick={addLoyaltyProgram} disabled={!newProgram.airline_iata_code || !newProgram.account_number} className="text-xs">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Add Program
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contratos corporativos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      Corporate Contracts
                    </h4>
                    <Button variant="outline" size="sm" onClick={() => setShowAddCorporate(true)} className="text-xs">
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Contract
                    </Button>
                  </div>

                  {corporateContracts.length > 0 ? (
                    <div className="space-y-3">
                      {corporateContracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg border border-green-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-green-700">{contract.airline_iata_code}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{contract.contract_name}</div>
                              <div className="text-xs text-gray-600">{contract.airline_name}</div>
                              {contract.discount_percentage && (
                                <Badge variant="outline" className="text-xs mt-1 bg-green-100 text-green-700 border-green-300">
                                  {contract.discount_percentage}% discount
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCorporateContract(contract.id)}
                            className="text-red-500 hover:text-red-700 p-1 h-auto"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                      <BuildingOfficeIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No corporate contracts added yet</p>
                    </div>
                  )}

                  {/* Formulario para agregar contrato corporativo */}
                  <AnimatePresence>
                    {showAddCorporate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Airline</Label>
                              <Select
                                value={newCorporate.airline_iata_code}
                                onValueChange={(value) => setNewCorporate((prev) => ({ ...prev, airline_iata_code: value }))}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Select airline" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MAJOR_AIRLINES.map((airline) => (
                                    <SelectItem key={airline.code} value={airline.code}>
                                      {airline.code} - {airline.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700">Contract Name</Label>
                              <Input
                                type="text"
                                value={newCorporate.contract_name}
                                onChange={(e) => setNewCorporate((prev) => ({ ...prev, contract_name: e.target.value }))}
                                placeholder="Enter contract name"
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700">Discount %</Label>
                              <Input
                                type="number"
                                value={newCorporate.discount_percentage}
                                onChange={(e) =>
                                  setNewCorporate((prev) => ({ ...prev, discount_percentage: Number(e.target.value) || 0 }))
                                }
                                placeholder="0"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddCorporate(false)} className="text-xs">
                              Cancel
                            </Button>
                            <Button size="sm" onClick={addCorporateContract} disabled={!newCorporate.airline_iata_code || !newCorporate.contract_name} className="text-xs">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Add Contract
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Nota informativa */}
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <InformationCircleIcon className="h-4 w-4 mt-0.5" />
                  <p>
                    Suitpax uses your personal and corporate loyalty information to unlock better fares and benefits when
                    available. This information is stored locally in your browser and can be removed at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
