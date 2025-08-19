"use client"

import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { getPlacesFromClient } from './lib/get-places-from-client'
import { resolveCityImage } from '@/lib/utils'

interface Item { id: string; iata_code?: string; city_name?: string; name?: string }

interface Props {
  value: string
  onSelect: (item: Item) => void
  placeholder?: string
}

const cityThumbCache: Map<string, string> = new Map()

export default function PlacesLookup({ value, onSelect, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [items, setItems] = useState<Item[]>([])
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [loading, setLoading] = useState(false)

  const fetchPlaces = useCallback(async (q: string) => {
    const data = await getPlacesFromClient(q)
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
    if (!q) { setItems([]); setLoading(false); return }
    setLoading(true)
    const t = setTimeout(async () => {
      const data = await fetchPlaces(q)
      setItems(data)
      setLoading(false)
    }, 250)
    return () => { clearTimeout(t); }
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
    const key = city.toLowerCase()
    if (cityThumbCache.has(key)) return cityThumbCache.get(key) as string
    const url = resolveCityImage(city, { width: 96, height: 64, preferCdn: false, preferUnsplash: true })
    cityThumbCache.set(key, url)
    return url
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && items.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlight(h => Math.min(h + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (highlight >= 0 && items[highlight]) {
        e.preventDefault()
        select(items[highlight] as any)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div className="places">
      <Input value={query} onChange={e => { setQuery(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onKeyDown={handleKeyDown} placeholder={placeholder} className="bg-white text-gray-900 rounded-2xl" />
      {open && items.length > 0 && (
        <div className="places-panel">
          <div className="p-2">
            {loading && (
              <div className="px-3 py-2 text-xs text-gray-600">Searching…</div>
            )}
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
                          onError={(e) => { const el = e.currentTarget as HTMLImageElement; const fallback = 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&h=64&w=96'; el.src = fallback; if (city) cityThumbCache.set(city.toLowerCase(), fallback) }}
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

