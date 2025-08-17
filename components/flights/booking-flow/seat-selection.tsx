"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Props {
  offerId: string
  onSelect?: (seat: { designator: string; deck?: string; cabin?: string }) => void
}

interface DuffelSeatElement {
  type: string
  designator?: string
  available?: boolean
  characteristics?: string[]
}

interface DuffelSeatRow {
  number?: string
  elements: DuffelSeatElement[]
}

export default function SeatSelection({ offerId, onSelect }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<DuffelSeatRow[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true); setError(null)
      try {
        const url = new URL('/api/flights/duffel/seat-maps', window.location.origin)
        url.searchParams.set('offer_id', offerId)
        const res = await fetch(url.toString())
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load seat map')
        const data = json?.data || json
        const first = Array.isArray(data?.data) ? data.data[0] : (Array.isArray(data) ? data[0] : data)
        // Try to normalize basic shape: cabins[0].rows -> elements
        const normalized: DuffelSeatRow[] = first?.cabins?.[0]?.rows?.map((r: any) => ({
          number: r?.number || r?.row_number || '',
          elements: (r?.elements || []).map((e: any) => ({
            type: e?.type,
            designator: e?.designator || e?.seat_number,
            available: e?.available ?? e?.is_available ?? true,
            characteristics: e?.characteristics || [],
          }))
        })) || []
        setRows(normalized)
      } catch (e: any) {
        setError(e?.message || 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [offerId])

  const totalAvailable = useMemo(() => rows.reduce((acc, r) => acc + r.elements.filter(e => e.type === 'seat' && e.available).length, 0), [rows])

  const choose = (s: string) => {
    setSelected(s)
    onSelect?.({ designator: s })
  }

  return (
    <Card className="border-gray-200 bg-white rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 text-base tracking-tighter">Seat selection</CardTitle>
          <Badge className="rounded-2xl bg-gray-100 text-gray-700 border-gray-200">{totalAvailable} available</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <div className="text-sm text-gray-600">Loading seat map…</div>}
        {error && !loading && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && rows.length === 0 && (
          <div className="text-sm text-gray-600">No seat map available for this offer</div>
        )}
        {!loading && !error && rows.length > 0 && (
          <div className="seat-map rounded-2xl border border-gray-200 p-3 bg-gray-50">
            <div className="text-xs text-gray-600 mb-2">Tap a seat to select</div>
            <div className="space-y-2">
              {rows.map((row, idx) => (
                <div key={idx} className="row flex items-center gap-2">
                  <div className="w-8 text-xs text-gray-500 text-right">{row.number}</div>
                  <div className="flex gap-1">
                    {row.elements.map((el, i) => {
                      if (el.type !== 'seat') return <div key={i} className="w-2" />
                      const isSelected = selected === el.designator
                      const base = 'seat inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs transition-soft'
                      const cls = !el.available
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-black text-white hover:bg-gray-900 cursor-pointer'
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 cursor-pointer'
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={!el.available}
                          onClick={() => el.designator && choose(el.designator)}
                          className={`${base} ${cls}`}
                          title={el.designator || ''}
                        >
                          {el.designator?.replace(/[^A-Z0-9]/g, '')?.slice(-2) || '•'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            {selected && (
              <div className="mt-3 text-sm text-gray-800">
                Selected seat: <span className="font-medium">{selected}</span>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">Legend: <span className="inline-block h-3 w-3 bg-white border border-gray-300 align-middle rounded-sm mr-1"></span> Available <span className="inline-block h-3 w-3 bg-gray-200 align-middle rounded-sm mx-2"></span> Unavailable <span className="inline-block h-3 w-3 bg-black align-middle rounded-sm mx-2"></span> Selected</div>
          </div>
        )}
        <div className="flex justify-end">
          <Button disabled={!selected} className="rounded-2xl bg-black text-white hover:bg-gray-900">Confirm seat</Button>
        </div>
      </CardContent>
    </Card>
  )
}