"use client"

import { Badge } from "@/components/ui/badge"
import { InboxIcon, PaperAirplaneIcon, StarIcon, ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/outline"

interface Folder { id: string; name: string; icon: any; count?: number }

export default function MailSidebar({ selectedFolder, onSelect, unreadCount }: { selectedFolder: string; onSelect: (id: string)=>void; unreadCount: number }) {
  const folders: Folder[] = [
    { id: "inbox", name: "Inbox", icon: InboxIcon, count: unreadCount },
    { id: "sent", name: "Sent", icon: PaperAirplaneIcon },
    { id: "starred", name: "Starred", icon: StarIcon },
    { id: "archive", name: "Archive", icon: ArchiveBoxIcon },
    { id: "trash", name: "Trash", icon: TrashIcon },
  ]

  return (
    <aside className="w-64 bg-white/50 backdrop-blur-sm border-r border-gray-200 p-4">
      <div className="space-y-2">
        {folders.map((folder) => {
          const Icon = folder.icon
          const isActive = selectedFolder === folder.id
          const count = folder.id === "inbox" ? unreadCount : folder.count || 0
          return (
            <button key={folder.id} onClick={() => onSelect(folder.id)} className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span className="tracking-tight">{folder.name}</span>
              </div>
              {count > 0 && (
                <Badge variant="secondary" className={`text-xs ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
                  {count}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}