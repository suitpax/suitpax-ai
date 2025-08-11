"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import MailSidebar from "@/components/dashboard/mail/MailSidebar"
import MailList, { MailItem } from "@/components/dashboard/mail/MailList"
import MailDetail from "@/components/dashboard/mail/MailDetail"
import MailToolbar from "@/components/dashboard/mail/MailToolbar"
import ComposeDialog from "@/components/dashboard/mail/ComposeDialog"
import { Button } from "@/components/ui/button"

export default function MailPage() {
  const [items, setItems] = useState<MailItem[]>([])
  const [filtered, setFiltered] = useState<MailItem[]>([])
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<MailItem | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // TODO: obtener token OAuth de Google de la sesión del usuario una vez esté creada la API de Google Cloud
  useEffect(() => {
    // Placeholder: sin token -> CTA de conectar
    setToken(null)
  }, [])

  // Cargar desde Gmail si hay token
  useEffect(() => {
    const load = async () => {
      if (!token) return
      const res = await fetch("/api/mail/gmail/list", { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const { messages } = await res.json()
        setItems(messages)
      }
    }
    load()
  }, [token])

  useEffect(() => {
    let data = items
    if (query) {
      const q = query.toLowerCase()
      data = data.filter((m) => m.subject.toLowerCase().includes(q) || m.from.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q))
    }
    // folder handling real: Gmail labels en el futuro. Por ahora, no filtramos por folder si vienen de Gmail.
    setFiltered(data)
  }, [items, query, selectedFolder])

  const unreadCount = items.filter((e) => !e.read).length

  const onToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const onToggleStar = (id: string) => {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)))
  }

  const onBulkAction = (a: string) => {
    if (a === "delete") setItems((prev) => prev.filter((e) => !selectedIds.includes(e.id)))
    if (a === "read") setItems((prev) => prev.map((e) => (selectedIds.includes(e.id) ? { ...e, read: true } : e)))
    if (a === "archive") {/* map labels when implemented */}
    setSelectedIds([])
  }

  const onSend = async (to: string, subject: string, body: string) => {
    if (!token) return
    await fetch("/api/mail/gmail/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ to, subject, body }),
    })
    setComposeOpen(false)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      <MailSidebar selectedFolder={selectedFolder} onSelect={setSelectedFolder} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/50 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">Mail</h1>
            {!token && (
              <Button className="bg-black text-white hover:bg-gray-800">Connect Gmail</Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="text" placeholder="Search emails..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div className="mt-4">
            <MailToolbar selectedCount={selectedIds.length} onBulkAction={onBulkAction} onCompose={() => setComposeOpen(true)} />
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center px-4 py-3 bg-gray-50/50">
            <Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} onCheckedChange={(checked) => setSelectedIds(checked ? filtered.map((e) => e.id) : [])} />
            <span className="ml-3 text-sm text-gray-600">{filtered.length} emails</span>
          </div>

          <MailList items={filtered} selectedIds={selectedIds} onToggleSelect={onToggleSelect} onToggleStar={onToggleStar} onOpen={(m)=>{ setSelected(m); }} />
        </div>
      </div>

      {selected && <MailDetail email={selected} onClose={() => setSelected(null)} />}
      <ComposeDialog open={composeOpen} onClose={()=>setComposeOpen(false)} onSend={onSend} />
    </div>
  )
}
