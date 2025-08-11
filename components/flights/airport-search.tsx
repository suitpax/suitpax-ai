'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPinIcon, CheckIcon } from '@heroicons/react/24/outline'

interface Airport {
  id: string
  iata_code: string
  name: string
  city_name: string
  country_name: string
}

interface AirportSearchProps {
  label: string
  placeholder: string
  value: string
  onChange: (airportCode: string, airport?: Airport) => void
  error?: string
}

export default function AirportSearch({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error 
}: AirportSearchProps) {
  const [query, setQuery] = useState('')
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchAirports = async () => {
      if (query.length < 2) {
        setAirports([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/flights/duffel/places?q=${encodeURIComponent(query)}&limit=10`)
        const data = await response.json()
        
        if (data.success) {
          setAirports((data.places || []).map((p: any) => ({
            id: p.id,
            iata_code: p.iata_code,
            name: p.name,
            city_name: p.city_name || (p.type === 'city' ? p.name : ''),
            country_name: p.country_name || ''
          })))
        } else {
          setAirports([])
        }
      } catch (error) {
        console.error('Airport search error:', error)
        setAirports([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAirports, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mantener sincronizado el valor externo con el input visible
  useEffect(() => {
    // Si llega un IATA (3 letras) y el usuario no está escribiendo algo distinto, muéstralo
    if (value && value !== query && value.length <= 8) {
      setQuery(value)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setIsOpen(true)
    
    // Si el usuario borra todo, limpiar la selección
    if (!newQuery) {
      setSelectedAirport(null)
      onChange('')
    }
  }

  const handleAirportSelect = (airport: Airport) => {
    setSelectedAirport(airport)
    setQuery(`${airport.name} (${airport.iata_code})`)
    setIsOpen(false)
    onChange(airport.iata_code, airport)
  }

  const handleInputFocus = () => {
    setIsOpen(query.length >= 2 && airports.length > 0)
  }

  return (
    <div className="relative">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="relative mt-1">
        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          id={label.toLowerCase()}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`pl-10 rounded-full border-gray-300/60 bg-white/70 backdrop-blur-sm shadow-sm ${error ? 'border-red-500' : ''}`}
        />
        {selectedAirport && (
          <CheckIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* Dropdown de resultados */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Searching airports...
            </div>
          ) : airports.length > 0 ? (
            airports.map((airport) => (
              <button
                key={airport.id}
                onClick={() => handleAirportSelect(airport)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      {airport.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {airport.city_name}, {airport.country_name}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {airport.iata_code}
                  </div>
                </div>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No airports found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}