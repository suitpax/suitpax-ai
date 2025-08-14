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
  const [googleToken, setGoogleToken] = useState<string | null>(null)
  const supabase = createClient()

  const loadFromSupabase = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", uid)
        .order("starts_at", { ascending: false })
      if (!error && Array.isArray(data)) {
        const mapped: Meeting[] = data.map((m: any) => ({
          id: m.id,
          title: m.title,
          type: m.type,
          status: m.status,
          date: new Date(m.starts_at).toISOString().slice(0, 10),
          time: new Date(m.starts_at).toTimeString().slice(0, 5),
          duration:
            m.duration_minutes ||
            Math.max(15, Math.round((new Date(m.ends_at).getTime() - new Date(m.starts_at).getTime()) / 60000)),
          attendees: m.attendees || [],
          location: m.location || undefined,
          description: m.description || undefined,
          meetingUrl: m.meeting_url || undefined,
        }))
        setMeetings(mapped)
      }
    } catch {}
  }

  // Load/save per-user meetings in localStorage when no Google token
  useEffect(() => {
    const init = async () => {
      const { data: session } = await supabase.auth.getSession()
      const uid = session.session?.user?.id || null
      setUserId(uid)
      // TODO: en el futuro, obtener token OAuth Google y guardarlo en sesión/BD
      setGoogleToken(null)
      if (!googleToken) {
        if (uid) {
          await loadFromSupabase(uid)
        } else {
          const key = uid ? `meetings:${uid}` : `meetings`
          const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
          const parsed: Meeting[] = raw ? JSON.parse(raw) : mockMeetings
          setMeetings(parsed)
        }
      }
    }
    init()
  }, [googleToken])

  // Cargar desde Google Calendar si hay token
  useEffect(() => {
    const loadGoogle = async () => {
      if (!googleToken) return
      const res = await fetch("/api/meetings/google/list", { headers: { Authorization: `Bearer ${googleToken}` } })
      if (!res.ok) return
      const { events } = await res.json()
      const mapped: Meeting[] = (events || []).map((e: any) => {
        const start = new Date(e.start)
        const end = new Date(e.end)
        const duration = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
        const type: Meeting["type"] = e.hangoutLink ? "video" : e.location ? "in-person" : "phone"
        return {
          id: e.id || String(start.getTime()),
          title: e.title || "Untitled",
          type,
          status: "upcoming",
          date: start.toISOString().slice(0, 10),
          time: start.toTimeString().slice(0, 5),
          duration: duration || 30,
          attendees: e.attendees || [],
          location: e.location || undefined,
          description: e.description || undefined,
          meetingUrl: e.hangoutLink || undefined,
        }
      })
      setMeetings(mapped)
    }
    loadGoogle()
  }, [googleToken])

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

  const persist = async (items: Meeting[]) => {
    if (googleToken) return
    if (userId) {
      // Sync to Supabase in background
      try {
        // naive sync: delete all and reinsert would be heavy; instead ignore
      } catch {}
    } else {
      const key = userId ? `meetings:${userId}` : `meetings`
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(items))
      }
    }
  }

  const updateMeetingStatus = async (id: string, status: Meeting["status"]) => {
    setMeetings((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, status } : m))
      return updated
    })
    try {
      if (userId) {
        await supabase.from("meetings").update({ status }).eq("id", id).eq("user_id", userId)
      } else {
        persist(meetings)
      }
    } catch {}
  }

  const handleCreateMeeting = async () => {
    if (googleToken) {
      const startISO = `${newMeeting.date}T${newMeeting.time}:00`
      const endDate = new Date(startISO)
      endDate.setMinutes(endDate.getMinutes() + (newMeeting.duration || 30))
      const endISO = endDate.toISOString()
      const attendees = newMeeting.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
      const res = await fetch("/api/meetings/google/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${googleToken}` },
        body: JSON.stringify({
          title: newMeeting.title,
          description: newMeeting.description,
          start: startISO,
          end: endISO,
          attendees,
          location: newMeeting.location || undefined,
        }),
      })
      if (res.ok) {
        // reload
        const list = await fetch("/api/meetings/google/list", { headers: { Authorization: `Bearer ${googleToken}` } })
        if (list.ok) {
          const { events } = await list.json()
          const mapped: Meeting[] = (events || []).map((e: any) => {
            const start = new Date(e.start)
            const end = new Date(e.end)
            const duration = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
            const type: Meeting["type"] = e.hangoutLink ? "video" : e.location ? "in-person" : "phone"
            return {
              id: e.id || String(start.getTime()),
              title: e.title || "Untitled",
              type,
              status: "upcoming",
              date: start.toISOString().slice(0, 10),
              time: start.toTimeString().slice(0, 5),
              duration: duration || 30,
              attendees: e.attendees || [],
              location: e.location || undefined,
              description: e.description || undefined,
              meetingUrl: e.hangoutLink || undefined,
            }
          })
          setMeetings(mapped)
        }
      }
    } else {
      const attendees = newMeeting.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
      if (userId) {
        const startISO = `${newMeeting.date}T${newMeeting.time}:00`
        const endDate = new Date(startISO)
        endDate.setMinutes(endDate.getMinutes() + (newMeeting.duration || 30))
        const { data, error } = await supabase
          .from("meetings")
          .insert({
            user_id: userId,
            title: newMeeting.title,
            type: newMeeting.type,
            status: "upcoming",
            starts_at: new Date(startISO).toISOString(),
            ends_at: endDate.toISOString(),
            attendees,
            location: newMeeting.location || null,
            description: newMeeting.description || null,
            meeting_url: newMeeting.type === "video" ? `https://meet.suitpax.com/${Date.now()}` : null,
          })
          .select()
          .single()
        if (!error && data) {
          await loadFromSupabase(userId)
        }
      } else {
        const meeting: Meeting = {
          id: Date.now().toString(),
          title: newMeeting.title,
          type: newMeeting.type,
          status: "upcoming",
          date: newMeeting.date,
          time: newMeeting.time,
          duration: newMeeting.duration,
          attendees,
          location: newMeeting.location || undefined,
          description: newMeeting.description || undefined,
          meetingUrl: newMeeting.type === "video" ? `https://meet.suitpax.com/${Date.now()}` : undefined,
        }
        const updated = [meeting, ...meetings]
        setMeetings(updated)
        persist(updated)
      }
    }

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

    const thisWeekCount = Object.values(map).reduce((acc, meetings) => acc + meetings.length, 0)
    return { days, map, thisWeekCount }
  })()

  return (
    <div className="min-h-screen p-0">
      <div className="px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none mb-2">
                Meetings
              </h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Manage your business meetings and video calls</em>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {!googleToken && (
                <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-4 py-2">
                  Connect Google Calendar
                </Button>
              )}
              <Dialog open={showNewMeetingModal} onOpenChange={setShowNewMeetingModal}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-4 py-2">
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
                      <Input
                        id="title"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                        placeholder="Enter meeting title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Meeting Type</Label>
                        <Select
                          value={newMeeting.type}
                          onValueChange={(value: Meeting["type"]) => setNewMeeting({ ...newMeeting, type: value })}
                        >
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
                        <Input
                          id="duration"
                          type="number"
                          value={newMeeting.duration}
                          onChange={(e) =>
                            setNewMeeting({ ...newMeeting, duration: Number.parseInt(e.target.value) || 60 })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newMeeting.date}
                          onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newMeeting.time}
                          onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="attendees">Attendees (comma separated)</Label>
                      <Input
                        id="attendees"
                        value={newMeeting.attendees}
                        onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                        placeholder="john@example.com, sarah@example.com"
                      />
                    </div>

                    {newMeeting.type === "in-person" && (
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newMeeting.location}
                          onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                          placeholder="Enter meeting location"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newMeeting.description}
                        onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                        placeholder="Meeting agenda or description"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setShowNewMeetingModal(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateMeeting}
                        disabled={!newMeeting.title || !newMeeting.date || !newMeeting.time}
                      >
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - New responsive section */}
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
                  <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                  <p className="text-2xl font-medium tracking-tight">{meetings.length}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <VideoCameraIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-medium tracking-tight">{upcomingMeetings}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-medium tracking-tight">{compactAgenda.thisWeekCount}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-medium tracking-tight">{completedMeetings}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Templates + Compact agenda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Meeting Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.title}
                    className="text-left p-4 rounded-xl border border-gray-200 hover:bg-white/50 backdrop-blur-sm transition-all hover:shadow-sm"
                    onClick={() => {
                      setShowNewMeetingModal(true)
                      setNewMeeting((prev) => ({
                        ...prev,
                        title: t.title,
                        description: t.description,
                        duration: t.duration,
                        type: t.type,
                      }))
                    }}
                  >
                    <div className="font-medium text-sm mb-1">{t.title}</div>
                    <div className="text-xs text-gray-600 mb-2">{t.description}</div>
                    <div className="text-xs text-gray-500">
                      {t.duration} minutes • {t.type}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium tracking-tight">Next 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compactAgenda.days.map((d) => (
                  <div key={d.key} className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">{d.label}</div>
                    <div className="space-y-2">
                      {compactAgenda.map[d.key].length === 0 ? (
                        <div className="text-xs text-gray-500">No meetings</div>
                      ) : (
                        compactAgenda.map[d.key].map((m) => (
                          <div key={m.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900 font-medium">{m.time}</span>
                              <span className="text-gray-600 truncate">{m.title}</span>
                            </div>
                            <span className="text-gray-500 text-xs">{m.duration}m</span>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/20 shadow-sm sticky top-4 z-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:flex-initial sm:w-80">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40 rounded-xl">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Meetings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting, index) => {
              const TypeIcon = getTypeIcon(meeting.type)
              return (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="h-6 w-6 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                          <h3 className="text-lg font-medium tracking-tight text-gray-900 truncate">{meeting.title}</h3>
                          <Badge className={getStatusColor(meeting.status)}>
                            {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
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

                        {meeting.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meeting.description}</p>
                        )}

                        {meeting.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                            <MapPinIcon className="h-4 w-4" />
                            <span className="truncate">{meeting.location}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          {meeting.attendees.slice(0, 3).map((attendee, i) => (
                            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {attendee.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          ))}
                          {meeting.attendees.length > 3 && (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">+{meeting.attendees.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {meeting.status === "upcoming" && meeting.meetingUrl && (
                        <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-xl">
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Join
                        </Button>
                      )}
                      {meeting.status === "upcoming" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMeetingStatus(meeting.id, "completed")}
                          className="rounded-xl border-gray-200"
                        >
                          Mark Done
                        </Button>
                      )}
                      {meeting.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMeetingStatus(meeting.id, "cancelled")}
                          className="rounded-xl border-gray-200"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-white/20 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <VideoCameraIcon className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tight">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "No meetings found"
                  : "No meetings scheduled"}
              </h3>
              <p className="text-gray-600 font-light mb-6 max-w-md mx-auto">
                <em className="font-serif italic">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search or filters to find meetings."
                    : "Schedule your first meeting to get started with team collaboration."}
                </em>
              </p>
              {!searchQuery && statusFilter === "all" && typeFilter === "all" && (
                <Button
                  onClick={() => setShowNewMeetingModal(true)}
                  className="bg-black text-white hover:bg-gray-800 rounded-xl"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
