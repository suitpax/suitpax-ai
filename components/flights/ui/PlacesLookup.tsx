"use client"

import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'

interface Item { id: string; iata_code?: string; city_name?: string; name?: string }

interface Props {
  value: string
  onSelect: (item: Item) => void
  placeholder?: string
}

export default function PlacesLookup({ value, onSelect, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [items, setItems] = useState<Item[]>([])
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)

  const fetchPlaces = useCallback(async (q: string) => {
    const res = await fetch(`/api/flights/duffel/places/suggestions?query=${encodeURIComponent(q)}`)
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (!q) { setItems([]); return }
    const t = setTimeout(async () => {
      const data = await fetchPlaces(q)
      setItems(data)
    }, 200)
    return () => clearTimeout(t)
  }, [query, fetchPlaces])

  const select = (p: any) => {
    const city = (p.city_name || p.city?.name || '').toString()
    const name = p.name || city
    const iata = (p.iata_code || p.airport?.iata_code || '').toUpperCase()
    setQuery(`${city || name} (${iata})`)
    setOpen(false)
    onSelect({ id: p.id, iata_code: iata, city_name: city, name })
  }

  return (
    <div className="places">
      <Input value={query} onChange={e => { setQuery(e.target.value.toUpperCase()); setOpen(true) }} placeholder={placeholder} className="bg-white text-gray-900 rounded-2xl" />
      {open && items.length > 0 && (
        <div className="places-panel">
          {items.slice(0, 8).map((p: any, idx: number) => {
            const city = (p.city_name || p.city?.name || '').toString()
            const name = p.name || city
            const iata = (p.iata_code || p.airport?.iata_code || '').toUpperCase()
            return (
              <button key={p.id} type="button" onMouseDown={() => select(p)} onMouseEnter={() => setHighlight(idx)} className={`places-item ${idx === highlight ? 'places-item-active' : ''}`}>
                <div className="text-sm text-gray-900">{city || name} ({iata})</div>
                <div className="text-xs text-gray-600">{name}</div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}