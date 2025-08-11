"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MailDetail({ email, onClose }: { email: any; onClose: ()=>void }) {
  if (!email) return null
  return (
    <aside className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200 capitalize">
          {email.category || "general"}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900 tracking-tight mb-2">{email.subject}</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">{email.from}</span>
            <span>•</span>
            <span>{new Date(email.date).toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">{email.preview}</p>
        </div>

        <div className="pt-4 space-y-2">
          <Button className="w-full bg-black text-white hover:bg-gray-800">Reply</Button>
          <Button variant="outline" className="w-full bg-transparent">Forward</Button>
        </div>
      </div>
    </aside>
  )
}