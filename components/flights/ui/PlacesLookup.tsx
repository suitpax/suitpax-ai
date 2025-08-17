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
    const data = Array.isArray(json?.data) ? json.data : []
    // Sort: City > IATA > Name
    const norm = (s: string) => (s || '').toString().trim().toLowerCase()
    data.sort((a: any, b: any) => {
      const ac = norm(a.city_name || a.city?.name); const bc = norm(b.city_name || b.city?.name)
      if (ac && bc && ac !== bc) return ac.localeCompare(bc)
      const ai = (a.iata_code || a.airport?.iata_code || '').toUpperCase(); const bi = (b.iata_code || b.airport?.iata_code || '').toUpperCase()
      if (ai && bi && ai !== bi) return ai.localeCompare(bi)
      const an = norm(a.name); const bn = norm(b.name)
      return an.localeCompare(bn)
    })
    return data
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

  const cityThumb = (city?: string) => {
    if (!city) return ''
    const q = encodeURIComponent(`${city} skyline`)
    // Primary Unsplash on-the-fly; fallback to a generic Pexels city image
    return `https://source.unsplash.com/96x64/?${q}`
  }

  return (
    <div className="places">
      <Input value={query} onChange={e => { setQuery(e.target.value.toUpperCase()); setOpen(true) }} placeholder={placeholder} className="bg-white text-gray-900 rounded-2xl" />
      {open && items.length > 0 && (
        <div className="places-panel">
          <div className="p-2">
            {items.slice(0, 8).map((p: any, idx: number) => {
              const city = (p.city_name || p.city?.name || '').toString()
              const name = p.name || city
              const iata = (p.iata_code || p.airport?.iata_code || '').toUpperCase()
              const thumb = cityThumb(city)
              return (
                <button key={p.id} type="button" onMouseDown={() => select(p)} onMouseEnter={() => setHighlight(idx)} className={`w-full text-left px-3 py-2 rounded-xl transition-soft ${idx === highlight ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={city || name}
                          className="h-10 w-16 rounded-lg object-cover border border-gray-200"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&h=64&w=96' }}
                        />
                      ) : (
                        <div className="h-10 w-16 rounded-lg border border-gray-200 bg-gray-50" />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 tracking-tighter truncate">{city || name}</div>
                        <div className="text-xs text-gray-600 truncate">{name}</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-2xl border border-gray-200 bg-white text-xs text-gray-800">{iata || '—'}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}