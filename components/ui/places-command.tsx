"use client"

import { useEffect, useMemo, useState } from "react"
import Popover from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getPlacesFromClient } from "@/components/places-lookup/lib/get-places-from-client"

export interface PlaceOption { id: string; iata_code?: string; city_name?: string; name?: string; icao_code?: string; iata_country_code?: string; iata_city_code?: string }

export default function PlacesCommand({ value, onSelect, placeholder = "Search city or airport" }: { value?: string; onSelect: (item: PlaceOption) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || "")
  const [results, setResults] = useState<PlaceOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      const data = await getPlacesFromClient(q)
      setResults(data)
      setLoading(false)
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  const label = useMemo(() => value || placeholder, [value, placeholder])

  return (
    <Popover
      align="start"
      trigger={
        <Button
          variant="outline"
          className="w-full justify-between rounded-2xl bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
          onClick={() => setOpen(!open)}
        >
          <span className="truncate">{label}</span>
          <svg className="h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
        </Button>
      }
      className="p-0 w-[360px]"
    >
      <Command shouldFilter={false} className="rounded-2xl">
        <CommandInput value={query} onValueChange={setQuery} placeholder={placeholder} />
        <CommandList>
          {loading && <CommandEmpty>Searching…</CommandEmpty>}
          {!loading && results.length === 0 && <CommandEmpty>No results.</CommandEmpty>}
          <CommandGroup heading="Results">
            {results.map((p) => {
              const city = (p.city_name || (p as any).city?.name || '').toString()
              const name = p.name || city
              const iata = (p.iata_code || (p as any).airport?.iata_code || '').toUpperCase()
              return (
                <CommandItem key={p.id} value={`${city} ${name} ${iata}`} onSelect={() => { setOpen(false); onSelect(p) }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{city || name}</span>
                    <span className="text-xs text-gray-500">{name !== city ? name : ''}</span>
                  </div>
                  <span className="ml-auto text-xs text-gray-600">{iata || '—'}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </Popover>
  )
}

