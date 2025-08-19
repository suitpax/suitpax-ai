"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function EventsPage() {
  const [title, setTitle] = useState("")
  const [city, setCity] = useState("")
  const [attendees, setAttendees] = useState(30)
  const [notes, setNotes] = useState("")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tighter">Events</h1>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-700">Event title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="NYC roadshow" className="mt-1 rounded-xl" />
            </div>
            <div>
              <label className="text-sm text-gray-700">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="New York" className="mt-1 rounded-xl" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Attendees</label>
              <Input type="number" value={attendees} onChange={(e) => setAttendees(parseInt(e.target.value || '0'))} className="mt-1 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Requirements</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Hotel specs, neighborhood, board plan, budget, visas..." className="mt-1 rounded-xl" />
          </div>
          <div className="flex justify-end">
            <Button className="rounded-2xl">Ask AI to organize</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

