"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline"

interface FlightFilters {
  priceRange: [number, number]
  maxStops: number
  airlines: string[]
  departureTime: string[]
  arrivalTime: string[]
  duration: [number, number]
  cabinClass: string[]
  refundable: boolean
  changeable: boolean
  directOnly: boolean
}

interface Airline {
  code: string
  name: string
  count: number
}

interface FlightFiltersProps {
  offers: any[]
  filters: FlightFilters
  onFiltersChange: (filters: FlightFilters) => void
  isOpen: boolean
  onClose: () => void
  className?: string
}

// Interfaz para FlightFiltersDisplay
interface FlightFilter {
  id: string
  label: string
  value: string
  type: 'cabin' | 'airline' | 'stops' | 'price' | 'time'
}

interface FlightFiltersDisplayProps {
  filters: FlightFilter[]
  onRemoveFilter: (filterId: string) => void
  onClearAll: () => void
}

const TIME_PERIODS = [
  { key: 'early-morning', label: 'Early Morning', time: '05:00 - 08:00' },
  { key: 'morning', label: 'Morning', time: '08:00 - 12:00' },
  { key: 'afternoon', label: 'Afternoon', time: '12:00 - 18:00' },
  { key: 'evening', label: 'Evening', time: '18:00 - 22:00' },
  { key: 'night', label: 'Night', time: '22:00 - 05:00' }
]

const CABIN_CLASSES = [
  { key: 'economy', label: 'Economy' },
  { key: 'premium_economy', label: 'Premium Economy' },
  { key: 'business', label: 'Business' },
  { key: 'first', label: 'First Class' }
]

// Custom Checkbox Component
const Checkbox = ({ checked, onCheckedChange, className = "" }) => (
  <div 
    className={`w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center transition-all duration-200 ${
      checked 
        ? 'bg-black border-black' 
        : 'border-gray-300 hover:border-gray-400'
    } ${className}`}
    onClick={() => onCheckedChange(!checked)}
  >
    {checked && <CheckCircleIcon className="h-3 w-3 text-white" />}
  </div>
)

// Custom Badge Component
const Badge = ({ children, variant = "outline", className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
    variant === "outline" 
      ? "border border-gray-200 bg-gray-50 text-gray-700" 
      : "bg-blue-50 text-blue-700 border border-blue-200"
  } ${className}`}>
    {children}
  </span>
)

// Custom Button Component
const Button = ({ children, variant = "default", size = "default", onClick, className = "", disabled = false, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
      variant === "outline" 
        ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500" 
        : variant === "ghost"
        ? "text-gray-700 hover:bg-gray-100"
        : "bg-black text-white hover:bg-gray-800 focus:ring-gray-500"
    } ${
      size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
)

// Custom Label Component
const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
)

// Custom Slider Component
const Slider = ({ value, onValueChange, min, max, step = 1, className = "" }) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (index, newValue) => {
    const updatedValue = [...localValue]
    updatedValue[index] = parseInt(newValue)
    setLocalValue(updatedValue)
    onValueChange(updatedValue)
  }

  const percentage1 = ((localValue[0] - min) / (max - min)) * 100
  const percentage2 = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className={`relative ${className}`}>
      <div className="relative h-2 bg-gray-200 rounded-lg">
        <div 
          className="absolute h-2 bg-black rounded-lg"
          style={{
            left: `${percentage1}%`,
            width: `${percentage2 - percentage1}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
        />
      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}

// Componente FlightFiltersDisplay que necesita ser exportado
export function FlightFiltersDisplay({ 
  filters, 
  onRemoveFilter, 
  onClearAll 
}: FlightFiltersDisplayProps) {
  if (filters.length === 0) return null

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge 
            key={filter.id} 
            className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
          >
            {filter.label}: {filter.value}
            <XMarkIcon 
              className="h-3 w-3 cursor-pointer hover:text-blue-900" 
              onClick={() => onRemoveFilter(filter.id)}
            />
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default function FlightFilters({
  offers,
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  className = ""
}: FlightFiltersProps) {
  const [tempFilters, setTempFilters] = useState<FlightFilters>(filters)
  const [airlines, setAirlines] = useState<Airline[]>([])

  // Extract available airlines from offers
  useEffect(() => {
    if (offers && offers.length > 0) {
      const airlineMap = new Map<string, { name: string; count: number }>()
      
      offers.forEach(offer => {
        const mainSegment = offer.slices?.[0]?.segments?.[0]
        if (mainSegment?.airline) {
          const code = mainSegment.airline.iata_code
          const name = mainSegment.airline.name
          
          if (airlineMap.has(code)) {
            airlineMap.get(code)!.count++
          } else {
            airlineMap.set(code, { name, count: 1 })
          }
        }
      })

      const airlineList = Array.from(airlineMap.entries())
        .map(([code, { name, count }]) => ({ code, name, count }))
        .sort((a, b) => b.count - a.count)

      setAirlines(airlineList)
    }
  }, [offers])

  // Calculate price range from offers
  const priceRange = offers && offers.length > 0 ? {
    min: Math.min(...offers.map(offer => parseFloat(offer.total_amount))),
    max: Math.max(...offers.map(offer => parseFloat(offer.total_amount)))
  } : { min: 0, max: 5000 }

  // Calculate duration range (in minutes)
  const durationRange = offers && offers.length > 0 ? {
    min: Math.min(...offers.map(offer => {
      const duration = offer.slices?.[0]?.duration || "PT0M"
      return parseDuration(duration)
    })),
    max: Math.max(...offers.map(offer => {
      const duration = offer.slices?.[0]?.duration || "PT0M"
      return parseDuration(duration)
    }))
  } : { min: 0, max: 1440 }

  function parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(d+)H)?(?:(d+)M)?/)
    if (!match) return 0
    const hours = parseInt(match[1] || "0")
    const minutes = parseInt(match[2] || "0")
    return hours * 60 + minutes
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const updateFilter = <K extends keyof FlightFilters>(
    key: K,
    value: FlightFilters[K]
  ) => {
    setTempFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    onFiltersChange(tempFilters)
    onClose()
  }

  const resetFilters = () => {
    const defaultFilters: FlightFilters = {
      priceRange: [priceRange.min, priceRange.max],
      maxStops: 3,
      airlines: [],
      departureTime: [],
      arrivalTime: [],
      duration: [durationRange.min, durationRange.max],
      cabinClass: [],
      refundable: false,
      changeable: false,
      directOnly: false
    }
    setTempFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const toggleAirline = (airlineCode: string) => {
    const newAirlines = tempFilters.airlines.includes(airlineCode)
      ? tempFilters.airlines.filter(code => code !== airlineCode)
      : [...tempFilters.airlines, airlineCode]
    updateFilter('airlines', newAirlines)
  }

  const toggleTimeSlot = (timeSlot: string, type: 'departureTime' | 'arrivalTime') => {
    const currentTimes = tempFilters[type]
    const newTimes = currentTimes.includes(timeSlot)
      ? currentTimes.filter(time => time !== timeSlot)
      : [...currentTimes, timeSlot]
    updateFilter(type, newTimes)
  }

  const toggleCabinClass = (cabinClass: string) => {
    const newClasses = tempFilters.cabinClass.includes(cabinClass)
      ? tempFilters.cabinClass.filter(c => c !== cabinClass)
      : [...tempFilters.cabinClass, cabinClass]
    updateFilter('cabinClass', newClasses)
  }

  const activeFiltersCount = [
    tempFilters.airlines.length > 0,
    tempFilters.departureTime.length > 0,
    tempFilters.arrivalTime.length > 0,
    tempFilters.cabinClass.length > 0,
    tempFilters.refundable,
    tempFilters.changeable,
    tempFilters.directOnly,
    tempFilters.priceRange[0] !== priceRange.min || tempFilters.priceRange[1] !== priceRange.max,
    tempFilters.duration[0] !== durationRange.min || tempFilters.duration[1] !== durationRange.max,
    tempFilters.maxStops < 3
  ].filter(Boolean).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="h-full border-0 rounded-none flex flex-col">
              {/* Header */}
              <div className="pb-4 border-b border-gray-200 sticky top-0 bg-white z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-medium">Filters</h2>
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      Price Range
                    </Label>
                    <span className="text-sm text-gray-600">
                      ${tempFilters.priceRange[0]} - ${tempFilters.priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={tempFilters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                    min={priceRange.min}
                    max={priceRange.max}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>

                {/* Stops */}
                <div className="space-y-4">
                  <Label className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Stops
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={tempFilters.directOnly}
                        onCheckedChange={(checked) => updateFilter('directOnly', checked)}
                      />
                      <span className="text-sm text-gray-700">Direct flights only</span>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Maximum stops: {tempFilters.maxStops}</Label>
                      <Slider
                        value={[tempFilters.maxStops, tempFilters.maxStops]}
                        onValueChange={(value) => updateFilter('maxStops', value[0])}
                        min={0}
                        max={3}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Direct</span>
                        <span>1 stop</span>
                        <span>2 stops</span>
                        <span>3+ stops</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Airlines */}
                <div className="space-y-4">
                  <Label className="flex items-center">
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Airlines
                  </Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {airlines.map((airline) => (
                      <div key={airline.code} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={tempFilters.airlines.includes(airline.code)}
                            onCheckedChange={() => toggleAirline(airline.code)}
                          />
                          <span className="text-sm text-gray-700">{airline.name}</span>
                        </div>
                        <Badge className="text-xs bg-gray-50">
                          {airline.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div className="space-y-4">
                  <Label className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Departure Time
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {TIME_PERIODS.map((period) => (
                      <div key={period.key} className="flex items-center space-x-3">
                        <Checkbox
                          checked={tempFilters.departureTime.includes(period.key)}
                          onCheckedChange={() => toggleTimeSlot(period.key, 'departureTime')}
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-700">{period.label}</span>
                          <span className="text-xs text-gray-500 ml-2">{period.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Flight Duration
                    </Label>
                    <span className="text-sm text-gray-600">
                      {formatDuration(tempFilters.duration[0])} - {formatDuration(tempFilters.duration[1])}
                    </span>
                  </div>
                  <Slider
                    value={tempFilters.duration}
                    onValueChange={(value) => updateFilter('duration', value as [number, number])}
                    min={durationRange.min}
                    max={durationRange.max}
                    step={30}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatDuration(durationRange.min)}</span>
                    <span>{formatDuration(durationRange.max)}</span>
                  </div>
                </div>

                {/* Cabin Class */}
                <div className="space-y-4">
                  <Label className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-2" />
                    Cabin Class
                  </Label>
                  <div className="space-y-2">
                    {CABIN_CLASSES.map((cabin) => (
                      <div key={cabin.key} className="flex items-center space-x-3">
                        <Checkbox
                          checked={tempFilters.cabinClass.includes(cabin.key)}
                          onCheckedChange={() => toggleCabinClass(cabin.key)}
                        />
                        <span className="text-sm text-gray-700">{cabin.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                                {/* Fare Options */}
                <div className="space-y-4">
                  <Label className="flex items-center">
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                    Fare Options
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={tempFilters.refundable}
                        onCheckedChange={(checked) => updateFilter('refundable', checked)}
                      />
                      <span className="text-sm text-gray-700">Refundable fares only</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={tempFilters.changeable}
                        onCheckedChange={(checked) => updateFilter('changeable', checked)}
                      />
                      <span className="text-sm text-gray-700">Changeable fares only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={applyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
