"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Pax = { id: string; name: string; email: string; role: "admin" | "member"; department?: string }

const MOCK_PAX: Pax[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@acme.com", role: "admin", department: "Operations" },
  { id: "2", name: "Mike Chen", email: "mike@acme.com", role: "member", department: "Finance" },
  { id: "3", name: "Ana Pérez", email: "ana@acme.com", role: "member", department: "Sales" },
]

export default function PaxPage() {
  const [search, setSearch] = useState("")
  const pax = MOCK_PAX
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return pax
    return pax.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || (p.department || "").toLowerCase().includes(q))
  }, [pax, search])

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Pax</h1>
            <p className="text-gray-600 font-light">Manage company users and employees</p>
          </div>
          <Button className="rounded-xl bg-gray-900 text-white hover:bg-black">Invite</Button>
        </div>
      </motion.div>

      <div className="max-w-sm">
        <Input placeholder="Search by name, email or department" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="grid grid-cols-12 items-center text-xs text-gray-600 bg-gray-100 px-4 py-2">
            <div className="col-span-4">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2 text-right">Department</div>
          </div>
          {filtered.map((p) => (
            <div key={p.id} className="grid grid-cols-12 items-center px-4 py-3 border-t border-gray-100">
              <div className="col-span-4 text-sm text-gray-900">{p.name}</div>
              <div className="col-span-4 text-sm text-gray-700">{p.email}</div>
              <div className="col-span-2 text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border border-gray-200 {p.role === 'admin' ? 'bg-black text-white' : 'bg-white text-gray-900'}">
                  {p.role}
                </span>
              </div>
              <div className="col-span-2 text-right text-sm text-gray-700">{p.department || "—"}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-sm text-gray-600">No users found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

