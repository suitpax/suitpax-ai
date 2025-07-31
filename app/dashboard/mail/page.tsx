"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  EnvelopeIcon,
  PlusIcon,
  InboxIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  TrashIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockEmails = [
  {
    id: 1,
    from: "john.smith@acmecorp.com",
    fromName: "John Smith",
    subject: "Travel Approval Request - London Trip",
    preview: "Hi team, I need approval for my upcoming business trip to London scheduled for next month...",
    date: "2024-03-20",
    time: "10:30 AM",
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    category: "travel",
  },
  {
    id: 2,
    from: "sarah.johnson@techcorp.com",
    fromName: "Sarah Johnson",
    subject: "Expense Report - Q1 2024",
    preview: "Please find attached my expense report for Q1 2024. Total expenses amount to $3,245.50...",
    date: "2024-03-19",
    time: "2:15 PM",
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    category: "expense",
  },
  {
    id: 3,
    from: "mike.wilson@globalltd.com",
    fromName: "Mike Wilson",
    subject: "Meeting Confirmation - Client Presentation",
    preview: "This is to confirm our meeting scheduled for tomorrow at 3:00 PM. The presentation materials...",
    date: "2024-03-19",
    time: "11:45 AM",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    category: "meeting",
  },
  {
    id: 4,
    from: "notifications@suitpax.com",
    fromName: "Suitpax",
    subject: "Your flight booking confirmation",
    preview: "Your flight from NYC to London has been confirmed. Flight details: BA 178, March 25th...",
    date: "2024-03-18",
    time: "4:20 PM",
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    category: "booking",
  },
]

const folders = [
  { name: "Inbox", icon: InboxIcon, count: 4, active: true },
  { name: "Sent", icon: PaperAirplaneIcon, count: 12, active: false },
  { name: "Starred", icon: StarIcon, count: 1, active: false },
  { name: "Archive", icon: ArchiveBoxIcon, count: 23, active: false },
  { name: "Trash", icon: TrashIcon, count: 3, active: false },
]

export default function MailPage() {
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)

  const toggleEmailSelection = (emailId: number) => {
    setSelectedEmails((prev) => (prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]))
  }

  const toggleStar = (emailId: number) => {
    // In a real app, this would update the email's starred status
    console.log("Toggle star for email:", emailId)
  }

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <EnvelopeIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
      <p className="text-gray-500 mb-6">Your inbox is empty or no emails match your search.</p>
    </motion.div>
  )

  const filteredEmails = mockEmails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            <PlusIcon className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>

        {/* Folders */}
        <nav className="flex-1 p-4 space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                folder.active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <folder.icon className="mr-3 h-5 w-5" />
                {folder.name}
              </div>
              {folder.count > 0 && (
                <Badge className={`text-xs ${folder.active ? "bg-white text-black" : "bg-gray-200 text-gray-700"}`}>
                  {folder.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-medium tracking-tighter">Inbox</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          {selectedEmails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 mt-4 p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-600">{selectedEmails.length} selected</span>
              <Button size="sm" variant="outline">
                <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                Archive
              </Button>
              <Button size="sm" variant="outline">
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button size="sm" variant="outline">
                <StarIcon className="h-4 w-4 mr-1" />
                Star
              </Button>
            </motion.div>
          )}
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEmails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !email.isRead ? "bg-blue-50/30" : ""
                  } ${selectedEmails.includes(email.id) ? "bg-blue-100" : ""}`}
                  onClick={() => setSelectedEmail(email.id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleEmailSelection(email.id)
                      }}
                      className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {email.fromName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Email Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p
                            className={`text-sm truncate ${
                              !email.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                            }`}
                          >
                            {email.fromName}
                          </p>
                          <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">{email.category}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{email.time}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStar(email.id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {email.isStarred ? (
                              <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-4 w-4 text-gray-400 hover:text-yellow-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className={`text-sm mt-1 ${!email.isRead ? "font-medium text-gray-900" : "text-gray-700"}`}>
                        {email.subject}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{email.preview}</p>

                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-gray-400">{email.date}</span>
                        {email.hasAttachment && (
                          <div className="flex items-center text-xs text-gray-400">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            Attachment
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
