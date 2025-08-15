"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  MagnifyingGlassIcon,
  InboxIcon,
  PaperAirplaneIcon,
  StarIcon,
  TrashIcon,
  ArchiveBoxIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import MailList, { type MailItem } from "@/components/dashboard/mail/MailList"
import MailDetail from "@/components/dashboard/mail/MailDetail"
import ComposeDialog from "@/components/dashboard/mail/ComposeDialog"

const FOLDERS = [
  { id: "inbox", name: "Inbox", icon: InboxIcon, count: 0 },
  { id: "sent", name: "Sent", icon: PaperAirplaneIcon, count: 0 },
  { id: "starred", name: "Starred", icon: StarIcon, count: 0 },
  { id: "archive", name: "Archive", icon: ArchiveBoxIcon, count: 0 },
  { id: "trash", name: "Trash", icon: TrashIcon, count: 0 },
]

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
      data = data.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.from.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q),
      )
    }
    // folder handling real: Gmail labels en el futuro. Por ahora, no filtramos por folder si vienen de Gmail.
    setFiltered(data)
  }, [items, query, selectedFolder])

  const unreadCount = items.filter((e) => !e.read).length
  const starredCount = items.filter((e) => e.starred).length

  const onToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const onToggleStar = (id: string) => {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)))
  }

  const onBulkAction = (a: string) => {
    if (a === "delete") setItems((prev) => prev.filter((e) => !selectedIds.includes(e.id)))
    if (a === "read") setItems((prev) => prev.map((e) => (selectedIds.includes(e.id) ? { ...e, read: true } : e)))
    if (a === "archive") {
      /* map labels when implemented */
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm rounded-2xl p-4 md:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none mb-2">Mail</h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Manage your business communications</em>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {!token && (
                <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-4 py-2">Connect Gmail</Button>
              )}
              <Button
                onClick={() => setComposeOpen(true)}
                className="bg-black text-white hover:bg-gray-800 rounded-xl px-4 py-2"
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                Compose
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search emails..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 rounded-xl border-gray-200"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {FOLDERS.map((folder) => {
                const Icon = folder.icon
                const isActive = selectedFolder === folder.id
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-white/50 text-gray-600 hover:bg-white/70 border border-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{folder.name}</span>
                    {folder.id === "inbox" && unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                    {folder.id === "starred" && starredCount > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {starredCount}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-2xl font-medium tracking-tight">{items.length}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <InboxIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-medium tracking-tight">{unreadCount}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Starred</p>
                  <p className="text-2xl font-medium tracking-tight">{starredCount}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <StarIconSolid className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selected</p>
                  <p className="text-2xl font-medium tracking-tight">{selectedIds.length}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm rounded-2xl p-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedIds.length} email{selectedIds.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkAction("read")}
                  className="rounded-xl border-gray-200"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkAction("archive")}
                  className="rounded-xl border-gray-200"
                >
                  <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBulkAction("delete")}
                  className="rounded-xl border-gray-200 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])} className="rounded-xl">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm rounded-2xl overflow-hidden"
        >
          <div className="flex items-center px-4 md:px-6 py-4 bg-white/50 border-b border-gray-200">
            <Checkbox
              checked={selectedIds.length === filtered.length && filtered.length > 0}
              onCheckedChange={(checked) => setSelectedIds(checked ? filtered.map((e) => e.id) : [])}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              {filtered.length} email{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {filtered.length > 0 ? (
              <MailList
                items={filtered}
                selectedIds={selectedIds}
                onToggleSelect={onToggleSelect}
                onToggleStar={onToggleStar}
                onOpen={(m) => setSelected(m)}
              />
            ) : (
              <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <InboxIcon className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">
                  {query ? "No emails found" : "No emails in this folder"}
                </h3>
                <p className="text-gray-600 font-light mb-6 max-w-md mx-auto">
                  <em className="font-serif italic">
                    {query
                      ? "Try adjusting your search terms to find emails."
                      : !token
                        ? "Connect your Gmail account to start managing emails."
                        : "This folder is empty."}
                  </em>
                </p>
                {!token && <Button className="bg-black text-white hover:bg-gray-800 rounded-xl">Connect Gmail</Button>}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {selected && <MailDetail email={selected} onClose={() => setSelected(null)} />}

      <ComposeDialog open={composeOpen} onClose={() => setComposeOpen(false)} onSend={onSend} />
    </div>
  )
}
