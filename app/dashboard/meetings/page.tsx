"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  PlayIcon,
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface Meeting {
  id: string
  title: string
  type: "video" | "phone" | "in-person"
  status: "upcoming" | "completed" | "cancelled"
  date: string
  time: string
  duration: number
  attendees: string[]
  location?: string
  description?: string
  meetingUrl?: string
}

const mockMeetings: Meeting[] = []

const TEMPLATES = [
  {
    title: "Quarterly Travel Strategy",
    description: "Review performance, budgets and policy updates for next quarter",
    duration: 60,
    type: "video" as const,
  },
  {
    title: "Client Onboarding - Travel Program",
    description: "Kick-off with client to configure policies, roles and integrations",
    duration: 45,
    type: "video" as const,
  },
  {
    title: "Expense Policy Deep Dive",
    description: "Walk through expense categories and compliance workflow",
    duration: 30,
    type: "video" as const,
  },
]

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings)
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>(mockMeetings)
  const [searchQuery, setSearchQuery] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    type: "video" as Meeting["type"],
    date: "",
    time: "",
    duration: 60,
    attendees: "",
    location: "",
    description: "",
    meetingUrl: "",
  })

  // Load/save per-user meetings in localStorage
  useEffect(() => {
    const supabase = createClient()
    const init = async () => {
      const { data: session } = await supabase.auth.getSession()
      const uid = session.session?.user?.id || null
      setUserId(uid)
      const key = uid ? `meetings:${uid}` : `meetings`
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
      const parsed: Meeting[] = raw ? JSON.parse(raw) : mockMeetings
      setMeetings(parsed)
    }
    init()
  }, [])

  useEffect(() => {
    let filtered = meetings

    if (searchQuery) {
      filtered = filtered.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meeting.attendees.some((attendee) => attendee.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((meeting) => meeting.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((meeting) => meeting.type === typeFilter)
    }

    setFilteredMeetings(filtered)
  }, [meetings, searchQuery, statusFilter, typeFilter])

  const persist = (items: Meeting[]) => {
    const key = userId ? `meetings:${userId}` : `meetings`
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(items))
    }
  }

  const updateMeetingStatus = (id: string, status: Meeting["status"]) => {
    setMeetings((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, status } : m))
      persist(updated)
      return updated
    })
  }

  const handleCreateMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      type: newMeeting.type,
      status: "upcoming",
      date: newMeeting.date,
      time: newMeeting.time,
      duration: newMeeting.duration,
      attendees: newMeeting.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      location: newMeeting.location || undefined,
      description: newMeeting.description || undefined,
      meetingUrl: newMeeting.type === "video" ? `https://meet.suitpax.com/${Date.now()}` : undefined,
    }

    const updated = [meeting, ...meetings]
    setMeetings(updated)
    persist(updated)
    setShowNewMeetingModal(false)
    setNewMeeting({
      title: "",
      type: "video",
      date: "",
      time: "",
      duration: 60,
      attendees: "",
      location: "",
      description: "",
      meetingUrl: "",
    })
  }

  const getTypeIcon = (type: Meeting["type"]) => {
    switch (type) {
      case "video":
        return VideoCameraIcon
      case "phone":
        return PhoneIcon
      case "in-person":
        return MapPinIcon
      default:
        return VideoCameraIcon
    }
  }

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming").length
  const completedMeetings = meetings.filter((m) => m.status === "completed").length
  const totalDuration = meetings.reduce((acc, m) => acc + m.duration, 0)
  const isEmpty = meetings.length === 0

  // Construir agenda compacta de los próximos 7 días
  const compactAgenda = (() => {
    const today = new Date()
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      return { key, label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) }
    })

    const map: Record<string, Meeting[]> = {}
    for (const day of days) map[day.key] = []
    for (const m of meetings) {
      const key = m.date
      if (key in map) map[key].push(m)
    }
    return { days, map }
  })()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Meetings</h1>
            <p className="text-gray-600 font-light">Manage your business meetings and video calls</p>
          </div>

          <Dialog open={showNewMeetingModal} onOpenChange={setShowNewMeetingModal}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input id="title" value={newMeeting.title} onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })} placeholder="Enter meeting title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Meeting Type</Label>
                    <Select value={newMeeting.type} onValueChange={(value: Meeting["type"]) => setNewMeeting({ ...newMeeting, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input id="duration" type="number" value={newMeeting.duration} onChange={(e) => setNewMeeting({ ...newMeeting, duration: Number.parseInt(e.target.value) || 60 })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={newMeeting.date} onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" value={newMeeting.time} onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="attendees">Attendees (comma separated)</Label>
                  <Input id="attendees" value={newMeeting.attendees} onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })} placeholder="john@example.com, sarah@example.com" />
                </div>

                {newMeeting.type === "in-person" && (
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={newMeeting.location} onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })} placeholder="Enter meeting location" />
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={newMeeting.description} onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })} placeholder="Meeting agenda or description" rows={3} />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowNewMeetingModal(false)}>Cancel</Button>
                  <Button onClick={handleCreateMeeting} disabled={!newMeeting.title || !newMeeting.date || !newMeeting.time}>Schedule Meeting</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">{upcomingMeetings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">{completedMeetings}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-3xl font-medium tracking-tighter text-gray-900 mt-1">{Math.round(totalDuration / 60)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Templates + Compact agenda */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">Meeting templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.title}
                  className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
                  onClick={() => {
                    setShowNewMeetingModal(true)
                    setNewMeeting((prev) => ({ ...prev, title: t.title, description: t.description, duration: t.duration, type: t.type }))
                  }}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg tracking-tight">Next 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {compactAgenda.days.map((d) => (
                <div key={d.key} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">{d.label}</div>
                  <div className="space-y-2">
                    {compactAgenda.map[d.key].length === 0 ? (
                      <div className="text-[11px] text-gray-500">No meetings</div>
                    ) : (
                      compactAgenda.map[d.key].map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium">{m.time}</span>
                            <span className="text-gray-600">{m.title}</span>
                          </div>
                          <span className="text-gray-500">{m.duration}m</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-20 z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="text" placeholder="Search meetings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-64" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Meetings List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting, index) => {
            const TypeIcon = getTypeIcon(meeting.type)
            return (
              <motion.div key={meeting.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-gray-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium tracking-tight text-gray-900">{meeting.title}</h3>
                        <Badge className={getStatusColor(meeting.status)}>{meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}</Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(meeting.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {meeting.time} ({meeting.duration}min)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>{meeting.attendees.length} attendees</span>
                        </div>
                      </div>

                      {meeting.description && <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>}

                      {meeting.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{meeting.location}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        {meeting.attendees.slice(0, 3).map((attendee, i) => (
                          <div key={i} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">{attendee.charAt(0).toUpperCase()}</span>
                          </div>
                        ))}
                        {meeting.attendees.length > 3 && (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">+{meeting.attendees.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {meeting.status === "upcoming" && meeting.meetingUrl && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    )}
                    {meeting.status === "upcoming" && (
                      <Button size="sm" variant="outline" onClick={() => updateMeetingStatus(meeting.id, "completed")}>Mark done</Button>
                    )}
                    {meeting.status !== "cancelled" && (
                      <Button size="sm" variant="outline" onClick={() => updateMeetingStatus(meeting.id, "cancelled")}>Cancel</Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
            <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all" ? "No meetings found" : "No meetings scheduled"}
            </h3>
            <p className="text-gray-600 font-light mb-6">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filters to find meetings."
                : "Schedule your first meeting to get started with team collaboration."}
            </p>
            {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
              <Button onClick={() => setShowNewMeetingModal(true)} className="bg-black text-white hover:bg-gray-800">
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
