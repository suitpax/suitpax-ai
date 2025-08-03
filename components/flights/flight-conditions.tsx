"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  CalendarIcon,
  ClockIcon
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FlightCondition {
  allowed: boolean
  penalty_amount?: string
  penalty_currency?: string
  penalty_percentage?: number
}

interface FlightConditions {
  change_before_departure?: FlightCondition
  change_after_departure?: FlightCondition
  refund_before_departure?: FlightCondition
  refund_after_departure?: FlightCondition
  carry_on_bag?: {
    allowed: boolean
    quantity?: number
    weight_limit?: string
  }
  checked_bag?: {
    allowed: boolean
    quantity?: number
    weight_limit?: string
    price?: string
    currency?: string
  }
}

interface PrivateFare {
  corporate_contract_id: string
  name: string
  savings_amount?: string
  savings_currency?: string
}

interface FlightConditionsProps {
  conditions: FlightConditions
  privateFares?: PrivateFare[]
  cabinClass: string
  totalAmount: string
  currency: string
  className?: string
  showDetails?: boolean
}

export function FlightConditionsDisplay({ 
  conditions, 
  privateFares = [],
  cabinClass,
  totalAmount,
  currency,
  className = "",
  showDetails = false 
}: FlightConditionsProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails)

  const formatPrice = (amount: string, curr: string) => {
    const price = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr
    }).format(price)
  }

  const getConditionIcon = (condition?: FlightCondition) => {
    if (!condition) return <XCircleIcon className="h-4 w-4 text-gray-400" />
    
    if (condition.allowed) {
      if (condition.penalty_amount && parseFloat(condition.penalty_amount) > 0) {
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
      }
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />
    }
    return <XCircleIcon className="h-4 w-4 text-red-500" />
  }

  const getConditionText = (condition?: FlightCondition, type: string = "") => {
    if (!condition) return "Not available"
    
    if (!condition.allowed) return "Not allowed"
    
    if (condition.penalty_amount && parseFloat(condition.penalty_amount) > 0) {
      return `Allowed with ${formatPrice(condition.penalty_amount, condition.penalty_currency || currency)} fee`
    }
    
    return "Free"
  }

  const getConditionBadgeColor = (condition?: FlightCondition) => {
    if (!condition || !condition.allowed) return "bg-red-50 text-red-700 border-red-200"
    
    if (condition.penalty_amount && parseFloat(condition.penalty_amount) > 0) {
      return "bg-orange-50 text-orange-700 border-orange-200"
    }
    
    return "bg-green-50 text-green-700 border-green-200"
  }

  // Determinar las condiciones más importantes para mostrar en resumen
  const keyConditions = [
    {
      key: "refund",
      condition: conditions.refund_before_departure,
      label: "Refundable",
      shortLabel: "Refund"
    },
    {
      key: "change",
      condition: conditions.change_before_departure,
      label: "Changeable",
      shortLabel: "Change"
    }
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Resumen de condiciones principales */}
      <div className="flex flex-wrap gap-2">
        {keyConditions.map(({ key, condition, shortLabel }) => (
          <Badge 
            key={key}
            variant="outline" 
            className={`text-xs ${getConditionBadgeColor(condition)}`}
          >
            {getConditionIcon(condition)}
            <span className="ml-1">
              {condition?.allowed ? (
                condition.penalty_amount && parseFloat(condition.penalty_amount) > 0 ? 
                `${shortLabel} (fee)` : 
                shortLabel
              ) : `No ${shortLabel.toLowerCase()}`}
            </span>
          </Badge>
        ))}
        
        {privateFares.length > 0 && (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
            <CurrencyDollarIcon className="h-3 w-3 mr-1" />
            Corporate Rate
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          {cabinClass.replace('_', ' ')}
        </Badge>
      </div>

      {/* Botón para mostrar detalles */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
      >
        <DocumentTextIcon className="h-3 w-3 mr-1" />
        <span className="mr-1">
          {isExpanded ? 'Hide' : 'View'} fare conditions
        </span>
        <ChevronDownIcon 
          className={`h-3 w-3 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {/* Detalles expandibles */}
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
              <CardContent className="p-4 space-y-4">
                {/* Tarifas corporativas */}
                {privateFares.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-purple-900">Corporate Discounts Applied</h4>
                        <div className="mt-1 space-y-1">
                          {privateFares.map((fare, index) => (
                            <div key={index} className="text-xs text-purple-700">
                              • {fare.name}
                              {fare.savings_amount && (
                                <span className="ml-1 font-medium">
                                  (Save {formatPrice(fare.savings_amount, fare.savings_currency || currency)})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Política de cambios */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Change Policy
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getConditionIcon(conditions.change_before_departure)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Before Departure</div>
                        <div className="text-xs text-gray-600">
                          {getConditionText(conditions.change_before_departure, "change")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getConditionIcon(conditions.change_after_departure)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">After Departure</div>
                        <div className="text-xs text-gray-600">
                          {getConditionText(conditions.change_after_departure, "change")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Política de reembolsos */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Refund Policy
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getConditionIcon(conditions.refund_before_departure)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Before Departure</div>
                        <div className="text-xs text-gray-600">
                          {getConditionText(conditions.refund_before_departure, "refund")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      {getConditionIcon(conditions.refund_after_departure)}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">After Departure</div>
                        <div className="text-xs text-gray-600">
                          {getConditionText(conditions.refund_after_departure, "refund")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Política de equipaje */}
                {(conditions.carry_on_bag || conditions.checked_bag) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Baggage Policy
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {conditions.carry_on_bag && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-2">Carry-on Bag</div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div>• Allowed: {conditions.carry_on_bag.allowed ? 'Yes' : 'No'}</div>
                            {conditions.carry_on_bag.quantity && (
                              <div>• Quantity: {conditions.carry_on_bag.quantity}</div>
                            )}
                            {conditions.carry_on_bag.weight_limit && (
                              <div>• Weight limit: {conditions.carry_on_bag.weight_limit}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {conditions.checked_bag && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-2">Checked Bag</div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div>• Allowed: {conditions.checked_bag.allowed ? 'Yes' : 'No'}</div>
                            {conditions.checked_bag.quantity && (
                              <div>• Quantity: {conditions.checked_bag.quantity}</div>
                            )}
                            {conditions.checked_bag.weight_limit && (
                              <div>• Weight limit: {conditions.checked_bag.weight_limit}</div>
                            )}
                            {conditions.checked_bag.price && (
                              <div>• Price: {formatPrice(conditions.checked_bag.price, conditions.checked_bag.currency || currency)}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-700">
                      <div className="font-medium mb-1">Important Notes:</div>
                      <ul className="space-y-1">
                        <li>• Conditions may vary based on fare type and airline policy</li>
                        <li>• Fees shown are per passenger and may be subject to change</li>
                        <li>• Contact airline directly for special circumstances</li>
                        <li>• Some conditions may not apply to award tickets</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}