"use client"

import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { TagIcon, StarIcon as StarOutline } from "@heroicons/react/24/outline"
import { StarIcon as StarSolid } from "@heroicons/react/24/solid"

export interface MailItem {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  category?: string
  attachments?: number
}

export default function MailList({
  items,
  selectedIds,
  onToggleSelect,
  onToggleStar,
  onOpen,
}: {
  items: MailItem[]
  selectedIds: string[]
  onToggleSelect: (id: string, checked: boolean) => void
  onToggleStar: (id: string) => void
  onOpen: (item: MailItem) => void
}) {
  return (
    <div className="divide-y divide-gray-200">
      {/* Select All header se renderiza fuera */}
      {items.map((email, index) => (
        <motion.div
          key={email.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={`flex items-center px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${!email.read ? "bg-blue-50/30" : ""} ${selectedIds.includes(email.id) ? "bg-blue-100" : ""}`}
          onClick={() => onOpen(email)}
        >
          <Checkbox
            checked={selectedIds.includes(email.id)}
            onCheckedChange={(checked) => onToggleSelect(email.id, checked as boolean)}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); onToggleStar(email.id) }}
            className="ml-3 p-1 hover:bg-gray-200 rounded"
          >
            {email.starred ? (
              <StarSolid className="h-4 w-4 text-yellow-500" />
            ) : (
              <StarOutline className="h-4 w-4 text-gray-400" />
            )}
          </button>

          <div className="ml-4 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${!email.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"} tracking-tight`}>
                  {email.from}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {email.attachments && (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <TagIcon className="h-3 w-3" />
                    <span className="text-xs">{email.attachments}</span>
                  </div>
                )}
                <span className="text-xs text-gray-500">{new Date(email.date).toLocaleDateString()}</span>
              </div>
            </div>

            <h3 className={`text-sm mb-1 ${!email.read ? "font-semibold text-gray-900" : "text-gray-800"} tracking-tight`}>
              {email.subject}
            </h3>
            <p className="text-sm text-gray-600 truncate font-light">{email.preview}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
