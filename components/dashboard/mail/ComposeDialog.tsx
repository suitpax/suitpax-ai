"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ComposeDialog({ open, onClose, onSend }: { open: boolean; onClose: ()=>void; onSend: (to:string, subject:string, body:string)=>void }) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium tracking-tighter">Compose</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <div className="space-y-3">
          <Input placeholder="To" value={to} onChange={(e)=>setTo(e.target.value)} />
          <Input placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
          <Textarea rows={8} placeholder="Message" value={body} onChange={(e)=>setBody(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={()=>onSend(to, subject, body)}>Send</Button>
        </div>
      </div>
    </div>
  )
}