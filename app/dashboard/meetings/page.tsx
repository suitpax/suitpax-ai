"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  VideoCameraIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  VideoCameraSlashIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockMeetings = [
  {
    id: 1,
    title: "Q1 Business Review",
    date: "2024-03-20",
    time: "10:00 AM",
    duration: "60 min",
    attendees: 8,
    status: "upcoming",
    type: "video",
    location: "Conference Room A",
  },
  {
    id: 2,
    title: "Client Presentation - London Office",
    date: "2024-03-21",
    time: "2:00 PM",
    duration: "45 min",
    attendees: 5,
    status: "upcoming",
    type: "video",
    location: "Virtual",
  },
  {
    id: 3,
    title: "Team Standup",
    date: "2024-03-19",
    time: "9:00 AM",
    duration: "30 min",
    attendees: 12,
    status: "completed",
    type: "video",
    location: "Virtual",
  },
  {
    id: 4,
    title: "Travel Policy Discussion",
    date: "2024-03-18",
    time: "3:30 PM",
    duration: "90 min",
    attendees: 6,
    status: "completed",
    type: "phone",
    location: "Conference Call",
  },
]

const upcomingMeetings = mockMeetings.filter((m) => m.status === "upcoming")
const completedMeetings = mockMeetings.filter((m) => m.status === "completed")

export default function MeetingsPage() {
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "60",
    attendees: "",
    type: "video",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Meeting scheduled:", formData)
    setShowScheduleForm(false)
    setFormData({
      title: "",
      date: "",
      time: "",
      duration: "60",
      attendees: "",
      type: "video",
      location: "",
    })
  }

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <VideoCameraIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
      <p className="text-gray-500 mb-6">Get started by scheduling your first business meeting.</p>
      <Button onClick={() => setShowScheduleForm(true)} className="bg-black text-white hover:bg-gray-800">
        <PlusIcon className="h-4 w-4 mr-2" />
        Schedule Meeting
      </Button>
    </motion.div>
  )

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Meetings</h1>
          <p className="text-gray-600 font-light">Manage your business meetings and video conferences</p>
        </div>
        <Button onClick={() => setShowScheduleForm(true)} className="bg-black text-white hover:bg-gray-800">
          <PlusIcon className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
                <p className="text-2xl font-medium tracking-tighter">{upcomingMeetings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-medium tracking-tighter">
                  {mockMeetings.filter((m) => m.status === "upcoming").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-2xl font-medium tracking-tighter">
                  {mockMeetings.reduce((sum, meeting) => sum + meeting.attendees, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Schedule Meeting Form */}
      {showScheduleForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium tracking-tighter">Schedule New Meeting</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter meeting title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <select
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="type">Meeting Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="video">Video Conference</option>
                      <option value="phone">Phone Call</option>
                      <option value="in-person">In Person</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="attendees">Attendees (emails)</Label>
                    <Input
                      id="attendees"
                      value={formData.attendees}
                      onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                      placeholder="email1@company.com, email2@company.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Conference room or virtual link"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                  Schedule Meeting
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Meetings List */}
      {mockMeetings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          {upcomingMeetings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium tracking-tighter">Upcoming Meetings</h2>
                <Badge className="bg-gray-200 text-gray-700 border-gray-200">{upcomingMeetings.length} meetings</Badge>
              </div>

              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                              {meeting.type === "video" ? (
                                <VideoCameraIcon className="h-6 w-6 text-gray-600" />
                              ) : meeting.type === "phone" ? (
                                <PhoneIcon className="h-6 w-6 text-gray-600" />
                              ) : (
                                <UserGroupIcon className="h-6 w-6 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge className="bg-gray-200 text-gray-700 border-gray-200 text-xs">
                                  {meeting.date}
                                </Badge>
                                <span className="text-sm text-gray-500">{meeting.time}</span>
                                <span className="text-sm text-gray-500">{meeting.duration}</span>
                                <div className="flex items-center text-xs text-gray-500">
                                  <UserGroupIcon className="h-3 w-3 mr-1" />
                                  {meeting.attendees} attendees
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{meeting.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                              Join Meeting
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Meetings */}
          {completedMeetings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium tracking-tighter">Recent Meetings</h2>
                <Badge className="bg-gray-200 text-gray-700 border-gray-200">
                  {completedMeetings.length} completed
                </Badge>
              </div>

              <div className="space-y-4">
                {completedMeetings.map((meeting, index) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm opacity-75">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              {meeting.type === "video" ? (
                                <VideoCameraSlashIcon className="h-6 w-6 text-gray-400" />
                              ) : meeting.type === "phone" ? (
                                <PhoneIcon className="h-6 w-6 text-gray-400" />
                              ) : (
                                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-700">{meeting.title}</h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <Badge className="bg-gray-100 text-gray-600 border-gray-100 text-xs">
                                  {meeting.date}
                                </Badge>
                                <span className="text-sm text-gray-400">{meeting.time}</span>
                                <span className="text-sm text-gray-400">{meeting.duration}</span>
                                <div className="flex items-center text-xs text-gray-400">
                                  <UserGroupIcon className="h-3 w-3 mr-1" />
                                  {meeting.attendees} attendees
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{meeting.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="text-gray-500 bg-transparent">
                              <DocumentTextIcon className="h-4 w-4 mr-1" />
                              Notes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
