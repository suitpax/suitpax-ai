"use client"

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoyaltyPage() {
  const [items, setItems] = useState<any[]>([])
  const [airline, setAirline] = useState('')
  const [account, setAccount] = useState('')

  const reload = async () => {
    const res = await fetch('/api/flights/duffel/loyalty')
    const json = await res.json()
    setItems(Array.isArray(json?.data) ? json.data : [])
  }

  useEffect(() => { reload() }, [])

  const add = async () => {
    if (!airline || !account) return
    await fetch('/api/flights/duffel/loyalty', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programme: { airline_iata_code: airline.toUpperCase(), account_number: account } })
    })
    setAirline(''); setAccount(''); reload()
  }

  const remove = async (iata: string) => {
    await fetch(`/api/flights/duffel/loyalty?airline_iata_code=${encodeURIComponent(iata)}`, { method: 'DELETE' })
    reload()
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Loyalty Programmes</h2>
      <div className="flex gap-2">
        <Input placeholder="IATA (e.g. IB)" value={airline} onChange={e => setAirline(e.target.value)} className="w-32" />
        <Input placeholder="Account number" value={account} onChange={e => setAccount(e.target.value)} className="w-64" />
        <Button onClick={add}>Add</Button>
      </div>
      <div className="space-y-2">
        {items.map((p) => (
          <div key={p.airline_iata_code} className="flex items-center justify-between rounded-xl border p-3">
            <div className="text-sm">{p.airline_iata_code} · {p.account_number}</div>
            <Button variant="secondary" onClick={() => remove(p.airline_iata_code)}>Remove</Button>
          </div>
        ))}
      </div>
    </div>
  )
}