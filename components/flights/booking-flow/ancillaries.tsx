"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AncillaryItem } from "@/types/duffel-ui"

interface Props {
  offerId: string
  onChange?: (selected: Record<string, AncillaryItem>) => void
}

export default function Ancillaries({ offerId, onChange }: Props) {
  const [items, setItems] = useState<AncillaryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Record<string, AncillaryItem>>({})

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL('/api/flights/duffel/ancillaries', window.location.origin)
        url.searchParams.set('offer_id', offerId)
        const res = await fetch(url.toString())
        const json = await res.json()
        const data: any[] = json?.data || []
        const mapped: AncillaryItem[] = data.map((a: any) => ({
          code: a?.id || a?.type || 'anc',
          title: a?.name || a?.type || 'Service',
          description: a?.description || '',
          price_amount: a?.total_amount || a?.amount || '0',
          price_currency: a?.currency || a?.total_currency || 'USD',
          passenger_id: a?.passenger_id,
          segment_id: a?.segment_id,
        }))
        setItems(mapped)
      } catch {}
      finally { setLoading(false) }
    }
    run()
  }, [offerId])

  const toggle = (item: AncillaryItem) => {
    setSelected(prev => {
      const next = { ...prev }
      if (next[item.code]) delete next[item.code]
      else next[item.code] = item
      onChange?.(next)
      return next
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-gray-900 text-base tracking-tighter">Extras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-600">No extras available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(it => (
              <div key={it.code} className={`rounded-xl border ${selected[it.code] ? 'border-black' : 'border-gray-200'} p-3 bg-gray-50`}> 
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{it.title}</div>
                    {it.description && <div className="text-xs text-gray-600 mt-0.5">{it.description}</div>}
                  </div>
                  <Badge className="rounded-2xl bg-white text-gray-900 border-gray-200">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: it.price_currency, maximumFractionDigits: 0 }).format(parseFloat(it.price_amount || '0'))}
                  </Badge>
                </div>
                <div className="mt-3">
                  <Button onClick={() => toggle(it)} className={`rounded-2xl ${selected[it.code] ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'}`}> 
                    {selected[it.code] ? 'Remove' : 'Add'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}