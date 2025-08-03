"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ClockIcon, 
  MapPinIcon, 
  ChevronDownIcon,
  InformationCircleIcon,
  PaperAirplaneIcon 
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Stop {
  airport: {
    iata_code: string
    name: string
    city_name: string
  }
  duration: string
  arrival_time?: string
  departure_time?: string
}

interface Segment {
  aircraft: { name: string }
  airline: { 
    name: string
    iata_code: string
    logo_symbol_url?: string 
  }
  flight_number: string
  origin: { 
    city_name: string
    iata_code: string
    name: string 
  }
  destination: { 
    city_name: string
    iata_code: string
    name: string 
  }
  departing_at: string
  arriving_at: string
  duration: string
}

interface FlightStopsProps {
  segments: Segment[]
  className?: string
  showDetails?: boolean
}

export function FlightStops({ segments, className = "", showDetails = false }: FlightStopsProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails)
  
  if (!segments || segments.length === 0) return null

  const stops = segments.length - 1
  const totalDuration = segments.reduce((total, segment) => {
    // Simplificada conversión de duración - en producción usar librería como date-fns
    const match = segment.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    const hours = parseInt(match?.[1] || "0")
    const minutes = parseInt(match?.[2] || "0")
    return total + (hours * 60) + minutes
  }, 0)

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return duration
    
    const hours = match[1] || "0"
    const minutes = match[2] || "0"
    
    if (hours === "0") return `${minutes}m`
    if (minutes === "0") return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const formatTotalDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const getLayoverDuration = (arrivalTime: string, departureTime: string) => {
    const arrival = new Date(arrivalTime)
    const departure = new Date(departureTime)
    const diffMs = departure.getTime() - arrival.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return formatTotalDuration(diffMinutes)
  }

  if (stops === 0) {
    // Vuelo directo
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
          <PaperAirplaneIcon className="h-3 w-3 mr-1" />
          Non-stop
        </Badge>
        <span className="text-sm text-gray-600">
          {formatTotalDuration(totalDuration)}
        </span>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Resumen de paradas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            <MapPinIcon className="h-3 w-3 mr-1" />
            {stops} {stops === 1 ? 'stop' : 'stops'}
          </Badge>
          <span className="text-sm text-gray-600">
            Total: {formatTotalDuration(totalDuration)}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
        >
          <span className="mr-1">
            {isExpanded ? 'Hide details' : 'Show details'}
          </span>
          <ChevronDownIcon 
            className={`h-3 w-3 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </Button>
      </div>

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
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              {segments.map((segment, index) => {
                const departureTime = new Date(segment.departing_at)
                const arrivalTime = new Date(segment.arriving_at)
                const nextSegment = segments[index + 1]
                
                return (
                  <div key={index} className="space-y-3">
                    {/* Segmento de vuelo */}
                    <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-3">
                        {segment.airline.logo_symbol_url ? (
                          <img 
                            src={segment.airline.logo_symbol_url} 
                            alt={segment.airline.name}
                            className="w-6 h-6 rounded object-contain"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                            <PaperAirplaneIcon className="h-3 w-3 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {segment.airline.name} {segment.flight_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            {segment.aircraft.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDuration(segment.duration)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {segment.origin.iata_code} → {segment.destination.iata_code}
                        </div>
                      </div>
                    </div>

                    {/* Ruta del segmento */}
                    <div className="grid grid-cols-3 gap-4 items-center text-center">
                      {/* Salida */}
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {departureTime.toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {segment.origin.iata_code}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {segment.origin.city_name}
                        </div>
                      </div>

                      {/* Línea de vuelo */}
                      <div className="flex items-center justify-center">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <PaperAirplaneIcon className="h-4 w-4 text-gray-400 mx-2" />
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      {/* Llegada */}
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {arrivalTime.toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {segment.destination.iata_code}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {segment.destination.city_name}
                        </div>
                      </div>
                    </div>

                    {/* Conexión/Layover */}
                    {nextSegment && (
                      <div className="flex items-center justify-center py-2">
                        <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-200">
                          <ClockIcon className="h-3 w-3" />
                          <span className="text-xs font-medium">
                            {getLayoverDuration(segment.arriving_at, nextSegment.departing_at)} layover in {segment.destination.city_name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente simplificado para mostrar solo el resumen
export function FlightStopsSummary({ segments, className = "" }: FlightStopsProps) {
  if (!segments || segments.length === 0) return null

  const stops = segments.length - 1

  if (stops === 0) {
    return (
      <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 text-xs ${className}`}>
        Non-stop
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={`bg-orange-50 text-orange-700 border-orange-200 text-xs ${className}`}>
      {stops} {stops === 1 ? 'stop' : 'stops'}
    </Badge>
  )
}