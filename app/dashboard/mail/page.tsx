"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  EnvelopeIcon,
  InboxIcon,
  PaperAirplaneIcon,
  StarIcon,
  TrashIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  TagIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Email {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  category: "travel" | "expense" | "meeting" | "booking" | "general"
  folder: "inbox" | "sent" | "starred" | "archive" | "trash"
  attachments?: number
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: "Delta Airlines",
    fromEmail: "noreply@delta.com",
    subject: "Flight Confirmation - DL1234 to NYC",
    preview: "Your flight from LAX to JFK has been confirmed for December 15, 2024...",
    date: "2024-02-14T10:30:00Z",
    read: false,
    starred: true,
    category: "booking",
    folder: "inbox",
    attachments: 1,
  },
  {
    id: "2",
    from: "Expense Team",
    fromEmail: "expenses@company.com",
    subject: "Expense Report Approved - $1,250.00",
    preview: "Your expense report for business trip to San Francisco has been approved...",
    date: "2024-02-14T09:15:00Z",
    read: true,
    starred: false,
    category: "expense",
    folder: "inbox",
  },
  {
    id: "3",
    from: "John Smith",
    fromEmail: "john.smith@company.com",
    subject: "Meeting Request: Q4 Travel Budget Review",
    preview: "Hi team, I would like to schedule a meeting to review our Q4 travel budget...",
    date: "2024-02-13T16:45:00Z",
    read: true,
    starred: false,
    category: "meeting",
    folder: "inbox",
  },
  {
    id: "4",
    from: "Hilton Hotels",
    fromEmail: "reservations@hilton.com",
    subject: "Hotel Reservation Confirmation",
    preview: "Thank you for choosing Hilton. Your reservation at Hilton San Francisco...",
    date: "2024-02-13T14:20:00Z",
    read: true,
    starred: false,
    category: "booking",
    folder: "inbox",
  },
  {
    id: "5",
    from: "Travel Policy Team",
    fromEmail: "policy@company.com",
    subject: "Updated Travel Policy - Effective March 1st",
    preview: "Please review the updated company travel policy that will take effect...",
    date: "2024-02-12T11:00:00Z",
    read: false,
    starred: false,
    category: "travel",
    folder: "inbox",
  },
]

const folders = [
  { id: "inbox", name: "Inbox", icon: InboxIcon, count: 5 },
  { id: "sent", name: "Sent", icon: PaperAirplaneIcon, count: 12 },
  { id: "starred", name: "Starred", icon: StarIcon, count: 1 },
  { id: "archive", name: "Archive", icon: ArchiveBoxIcon, count: 23 },
  { id: "trash", name: "Trash", icon: TrashIcon, count: 3 },
]

export default function MailPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(mockEmails)
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    let filtered = emails.filter((email) => email.folder === selectedFolder)

    if (searchQuery) {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.preview.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((email) => email.category === categoryFilter)
    }

    setFilteredEmails(filtered)
  }, [emails, selectedFolder, searchQuery, categoryFilter])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(filteredEmails.map((email) => email.id))
    } else {
      setSelectedEmails([])
    }
  }

  const handleSelectEmail = (emailId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails([...selectedEmails, emailId])
    } else {
      setSelectedEmails(selectedEmails.filter((id) => id !== emailId))
    }
  }

  const handleStarEmail = (emailId: string) => {
    setEmails(emails.map((email) => (email.id === emailId ? { ...email, starred: !email.starred } : email)))
  }

  const handleMarkAsRead = (emailId: string) => {
    setEmails(emails.map((email) => (email.id === emailId ? { ...email, read: true } : email)))
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "read":
        setEmails(emails.map((email) => (selectedEmails.includes(email.id) ? { ...email, read: true } : email)))
        break
      case "unread":
        setEmails(emails.map((email) => (selectedEmails.includes(email.id) ? { ...email, read: false } : email)))
        break
      case "star":
        setEmails(emails.map((email) => (selectedEmails.includes(email.id) ? { ...email, starred: true } : email)))
        break
      case "archive":
        setEmails(emails.map((email) => (selectedEmails.includes(email.id) ? { ...email, folder: "archive" } : email)))
        break
      case "delete":
        setEmails(emails.map((email) => (selectedEmails.includes(email.id) ? { ...email, folder: "trash" } : email)))
        break
    }
    setSelectedEmails([])
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "travel":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "expense":
        return "bg-green-100 text-green-800 border-green-200"
      case "meeting":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "booking":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "travel":
        return "✈️"
      case "expense":
        return "💳"
      case "meeting":
        return "📅"
      case "booking":
        return "🏨"
      default:
        return "📧"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const unreadCount = emails.filter((email) => !email.read && email.folder === "inbox").length

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-64 bg-white/50 backdrop-blur-sm border-r border-gray-200 p-4"
      >
        <div className="space-y-2">
          {folders.map((folder) => {
            const Icon = folder.icon
            const isActive = selectedFolder === folder.id
            const count = folder.id === "inbox" ? unreadCount : folder.count

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span className="tracking-tight">{folder.name}</span>
                </div>
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}
                  >
                    {count}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
          <div className="space-y-1">
            {["travel", "expense", "meeting", "booking"].map((category) => (
              <div key={category} className="flex items-center space-x-2 px-3 py-1">
                <span className="text-sm">{getCategoryIcon(category)}</span>
                <span className="text-sm text-gray-600 capitalize tracking-tight">{category}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {emails.filter((e) => e.category === category).length}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/50 backdrop-blur-sm border-b border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-medium tracking-tighter">
              <em className="font-serif italic">{folders.find((f) => f.id === selectedFolder)?.name || "Mail"}</em>
            </h1>
            <Button className="bg-black text-white hover:bg-gray-800">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedEmails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <span className="text-sm font-medium text-blue-900">{selectedEmails.length} selected</span>
              <div className="flex items-center space-x-1">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("read")}>
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("star")}>
                  Star
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                  Archive
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {/* Select All Header */}
              <div className="flex items-center px-4 py-3 bg-gray-50/50">
                <Checkbox
                  checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="ml-3 text-sm text-gray-600">{filteredEmails.length} emails</span>
              </div>

              {filteredEmails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex items-center px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !email.read ? "bg-blue-50/30" : ""
                  } ${selectedEmails.includes(email.id) ? "bg-blue-100" : ""}`}
                  onClick={() => {
                    setSelectedEmail(email)
                    handleMarkAsRead(email.id)
                  }}
                >
                  <Checkbox
                    checked={selectedEmails.includes(email.id)}
                    onCheckedChange={(checked) => handleSelectEmail(email.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStarEmail(email.id)
                    }}
                    className="ml-3 p-1 hover:bg-gray-200 rounded"
                  >
                    {email.starred ? (
                      <StarIconSolid className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-sm ${!email.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"} tracking-tight`}
                        >
                          {email.from}
                        </span>
                        <Badge className={`text-xs ${getCategoryColor(email.category)}`}>
                          {getCategoryIcon(email.category)} {email.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {email.attachments && (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <TagIcon className="h-3 w-3" />
                            <span className="text-xs">{email.attachments}</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{formatDate(email.date)}</span>
                      </div>
                    </div>

                    <h3
                      className={`text-sm mb-1 ${!email.read ? "font-semibold text-gray-900" : "text-gray-800"} tracking-tight`}
                    >
                      {email.subject}
                    </h3>

                    <p className="text-sm text-gray-600 truncate font-light">{email.preview}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center h-full p-12 text-center"
            >
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">
                {searchQuery || categoryFilter !== "all"
                  ? "No emails found"
                  : `No emails in ${folders.find((f) => f.id === selectedFolder)?.name.toLowerCase()}`}
              </h3>
              <p className="text-gray-600 font-light">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your search or filters to find emails."
                  : `Your ${folders.find((f) => f.id === selectedFolder)?.name.toLowerCase()} is empty.`}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Email Detail Panel */}
      {selectedEmail && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <Badge className={getCategoryColor(selectedEmail.category)}>
              {getCategoryIcon(selectedEmail.category)} {selectedEmail.category}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setSelectedEmail(null)}>
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900 tracking-tight mb-2">{selectedEmail.subject}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">{selectedEmail.from}</span>
                <span>•</span>
                <span>{formatDate(selectedEmail.date)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed font-light">{selectedEmail.preview}</p>
            </div>

            {selectedEmail.attachments && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {Array.from({ length: selectedEmail.attachments }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">document_{i + 1}.pdf</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <Button className="w-full bg-black text-white hover:bg-gray-800">Reply</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Forward
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
