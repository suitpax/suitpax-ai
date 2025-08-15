"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  PiCheckCircleBold,
  PiPlusBold,
  PiUsersBold,
  PiChartLineUpBold,
  PiChatCircleBold,
  PiPaperPlaneTiltBold,
  PiHashBold,
  PiClockBold,
  PiChartBarBold,
  PiFileTextBold,
  PiCalendarCheck,
} from "react-icons/pi"

// Sample task data
const sampleTasks = [
  {
    id: 1,
    title: "Q2 Business Trip to San Francisco",
    status: "In Progress",
    priority: "High",
    dueDate: "May 15, 2025",
    assignee: {
      name: "Alex Morgan",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    tags: ["Travel", "Meeting", "Q2"],
    progress: 65,
  },
  {
    id: 2,
    title: "Prepare expense report for Acme Corp visit",
    status: "To Do",
    priority: "Medium",
    dueDate: "May 20, 2025",
    assignee: {
      name: "Emma Chen",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    tags: ["Finance", "Report"],
    progress: 0,
  },
  {
    id: 3,
    title: "Book team dinner in New York",
    status: "Completed",
    priority: "Low",
    dueDate: "April 30, 2025",
    assignee: {
      name: "Marcus Lee",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    tags: ["Team", "Social"],
    progress: 100,
  },
  {
    id: 4,
    title: "Finalize Q3 travel budget",
    status: "In Progress",
    priority: "High",
    dueDate: "May 25, 2025",
    assignee: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    tags: ["Finance", "Planning", "Q3"],
    progress: 40,
  },
]

// Datos de ejemplo para proyectos completados
const completedProjects = [
  {
    id: 1,
    name: "Q1 Business Trip Planning",
    completedDate: "Apr 5, 2025",
    duration: "3 weeks",
    tasks: 12,
    files: 8,
    team: [
      {
        name: "Alex Morgan",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Emma Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Marcus Lee",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
  },
  {
    id: 2,
    name: "Tokyo Conference Logistics",
    completedDate: "Mar 28, 2025",
    duration: "2 weeks",
    tasks: 8,
    files: 5,
    team: [
      {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
  },
]

// Sample channels data
const channels = [
  { id: 1, name: "business-travel", unread: 3, mentions: 1 },
  { id: 2, name: "sf-trip-planning", unread: 0, mentions: 0 },
  { id: 3, name: "expense-reports", unread: 5, mentions: 2 },
]

// Sample messages for the active channel
const sampleMessages = [
  {
    id: 1,
    user: {
      name: "Alex Morgan",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    text: "Just closed the Q1 trip planning project. All tasks completed!",
    time: "10:32 AM",
    reactions: [{ emoji: "🎉", count: 3 }],
  },
  {
    id: 2,
    user: {
      name: "Emma Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    text: "Great work team! The expense reports are all submitted.",
    time: "10:35 AM",
    reactions: [],
  },
  {
    id: 3,
    user: {
      name: "Maya",
      avatar: "/agents/agent-1.png",
    },
    text: "I've archived all the project files and created a summary report. Would you like me to share it with the finance team?",
    time: "10:38 AM",
    reactions: [{ emoji: "👍", count: 2 }],
    isAI: true,
  },
]

// Componente para mostrar un proyecto completado
const CompletedProjectCard = ({ project }) => (
  <motion.div
    className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-2 shadow-sm"
    whileHover={{ y: -1 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-lg bg-emerald-950/30 flex items-center justify-center border border-emerald-500/30">
          <PiCheckCircleBold className="h-2.5 w-2.5 text-emerald-500" />
        </div>
        <h4 className="text-[10px] font-medium text-white truncate">{project.name}</h4>
      </div>
      <span className="text-[8px] text-white/50">{project.completedDate}</span>
    </div>

    <div className="flex items-center justify-between mb-1.5">
      <div className="flex -space-x-1">
        {project.team.slice(0, 2).map((member, i) => (
          <div key={i} className="w-4 h-4 rounded-full border border-white/20 overflow-hidden">
            <Image
              src={member.avatar || "/placeholder.svg"}
              alt={member.name}
              width={16}
              height={16}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {project.team.length > 2 && (
          <div className="w-4 h-4 rounded-full border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center text-[7px] font-medium text-white/70">
            +{project.team.length - 2}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <PiFileTextBold className="h-2 w-2 text-white/50" />
        <span className="text-[8px] text-white/50">{project.files} files</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-[8px] text-white/50">
      <div className="flex items-center gap-1">
        <PiClockBold className="h-2 w-2" />
        <span>{project.duration}</span>
      </div>
      <div className="flex items-center gap-1">
        <PiChartBarBold className="h-2 w-2" />
        <span>{project.tasks} tasks</span>
      </div>
    </div>
  </motion.div>
)

export const UnifiedWorkspace = () => {
  const [activeTab, setActiveTab] = useState("tasks")
  const [activeChannel, setActiveChannel] = useState("business-travel")
  const [messageInput, setMessageInput] = useState("")

  return (
    <motion.div
      key="unified-workspace"
      className="content-workspace space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-black">Workspace</h3>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-xl bg-gray-50 border border-gray-200 px-3 py-1 text-[10px] font-medium text-gray-700 tracking-wide">
            <div className="w-4 h-4 rounded-md bg-black flex items-center justify-center text-white mr-2">
              <PiUsersBold className="h-2.5 w-2.5" />
            </div>
            TEAM WORKSPACE
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`inline-flex items-center rounded-xl px-3 py-1 text-[10px] font-medium tracking-wide border ${
            activeTab === "tasks"
              ? "bg-emerald-950/10 text-emerald-950 border-emerald-950/30"
              : "bg-white/10 text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <PiCheckCircleBold className="h-2.5 w-2.5 mr-1.5" />
          Tasks
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`inline-flex items-center rounded-xl px-3 py-1 text-[10px] font-medium tracking-wide border ${
            activeTab === "projects"
              ? "bg-emerald-950/10 text-emerald-950 border-emerald-950/30"
              : "bg-white/10 text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <PiChartLineUpBold className="h-2.5 w-2.5 mr-1.5" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`inline-flex items-center rounded-xl px-3 py-1 text-[10px] font-medium tracking-wide border ${
            activeTab === "chat"
              ? "bg-emerald-950/10 text-emerald-950 border-emerald-950/30"
              : "bg-white/10 text-gray-700 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <PiChatCircleBold className="h-2.5 w-2.5 mr-1.5" />
          Team Chat
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-xl bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5" />
                Travel Tasks
              </span>
            </div>
            <button className="bg-gray-50 text-gray-700 text-[10px] rounded-xl px-2 py-1 flex items-center gap-1 shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors">
              <PiPlusBold className="h-2.5 w-2.5" />
              New Task
            </button>
          </div>

          {/* Task filters */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
            <span className="inline-flex items-center rounded-xl bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-700 whitespace-nowrap">
              All Tasks
            </span>
            <span className="inline-flex items-center rounded-xl bg-white px-2 py-0.5 text-[9px] font-medium text-gray-700 whitespace-nowrap border border-gray-200">
              My Tasks
            </span>
            <span className="inline-flex items-center rounded-xl bg-white px-2 py-0.5 text-[9px] font-medium text-gray-700 whitespace-nowrap border border-gray-200">
              High Priority
            </span>
            <span className="inline-flex items-center rounded-xl bg-white px-2 py-0.5 text-[9px] font-medium text-gray-700 whitespace-nowrap border border-gray-200">
              Due Soon
            </span>
          </div>

          {/* Task list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
            {sampleTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="bg-white rounded-xl border border-gray-200 p-2 hover:shadow-sm transition-shadow flex flex-col"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-start gap-1.5 mb-1.5">
                  <div className="mt-0.5">
                    {task.status === "Completed" ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                        <PiCheckCircleBold className="h-2 w-2 text-emerald-800" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-[10px] font-medium tracking-tight ${task.status === "Completed" ? "line-through text-gray-500" : "text-black"} truncate`}
                    >
                      {task.title}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-1.5">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-xl bg-gray-100 px-1.5 py-0.5 text-[7px] font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <span
                    className={`text-[7px] font-medium px-1.5 py-0.5 rounded-xl ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7px] text-gray-500">{task.dueDate}</span>
                    <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden border border-gray-200">
                      <Image
                        src={task.assignee.avatar || "/placeholder.svg"}
                        alt={task.assignee.name}
                        width={14}
                        height={14}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 w-full bg-gray-200 rounded-full h-0.5">
                  <motion.div
                    className="bg-emerald-500 h-0.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Assistant badge */}
          <div className="mt-4 flex justify-center">
            <motion.div
              className="bg-white/50 backdrop-blur-sm rounded-xl px-2 py-1.5 flex items-center gap-1.5 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                  src="/agents/agent-5.png"
                  alt="Suitpax AI Agent"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-medium tracking-tight text-black">Olivia suggests:</p>
                <p className="text-[8px] font-medium tracking-tight text-gray-600">
                  "I've prioritized your San Francisco trip tasks based on upcoming deadlines."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-xl bg-gray-50 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5" />
                Project Management
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="bg-white text-gray-700 text-[10px] rounded-xl px-2 py-1 flex items-center gap-1 shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors">
                <PiPlusBold className="h-2.5 w-2.5" />
                New Project
              </button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-black">Project Dashboard</h4>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-xl bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-500">
                  <PiCalendarCheck className="h-2 w-2 mr-0.5" />
                  Q2 2025
                </span>
                <span className="inline-flex items-center rounded-xl bg-emerald-100 px-1.5 py-0.5 text-[8px] font-medium text-emerald-800">
                  <PiCheckCircleBold className="h-2 w-2 mr-0.5" />2 Done
                </span>
              </div>
            </div>

            {/* Project completion cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
              {completedProjects.map((project) => (
                <CompletedProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Project completion visualization */}
            <div className="bg-gray-50 rounded-xl p-2 border border-gray-200">
              <div className="flex items-center justify-between mb-1.5">
                <h5 className="text-[9px] font-medium text-gray-700">Project Completion Rate</h5>
                <span className="text-[8px] text-gray-500">Last 30 days</span>
              </div>
              <div className="flex items-end h-8 gap-0.5">
                {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                  <motion.div
                    key={i}
                    className="bg-emerald-500 h-full rounded-sm flex-1"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[7px] text-gray-500">Mar 28</span>
                <span className="text-[7px] text-gray-500">Apr 5</span>
              </div>
            </div>
          </div>

          {/* Compact chat interface */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-1.5 flex items-center justify-between">
              <div className="flex items-center">
                <PiHashBold className="h-2.5 w-2.5 mr-1 text-gray-500" />
                <h4 className="text-[10px] font-medium text-gray-700">{activeChannel}</h4>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="text-gray-500 hover:text-gray-700 p-0.5 rounded-md hover:bg-gray-100">
                  <PiUsersBold className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="h-32 sm:h-40 overflow-y-auto p-2 space-y-2 bg-gray-50 relative">
              {sampleMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex gap-1.5"
                >
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                      <Image
                        src={message.user.avatar || "/placeholder.svg"}
                        alt={message.user.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] font-medium text-gray-700">{message.user.name}</span>
                      {message.isAI && (
                        <span className="bg-emerald-100 text-emerald-800 text-[7px] rounded-sm px-1 py-0.5 flex items-center border border-emerald-200">
                          <span className="w-0.5 h-0.5 rounded-full bg-emerald-500 mr-0.5"></span>
                          AI
                        </span>
                      )}
                      <span className="text-[7px] text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-800 break-words leading-tight">{message.text}</p>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-0.5">
                        {message.reactions.map((reaction, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            className="inline-flex items-center rounded-full bg-gray-100 shadow-sm border border-gray-200 px-1 py-0.5 text-[7px] text-gray-700 cursor-pointer"
                          >
                            {reaction.emoji} {reaction.count}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input area */}
            <div className="p-1.5 border-t border-gray-200">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1">
                <input
                  type="text"
                  className="flex-1 text-[10px] border-none outline-none focus:ring-0 bg-transparent text-gray-700 placeholder-gray-400"
                  placeholder={`Message #${activeChannel}`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  aria-label="Type a message"
                />
                <button className="text-gray-700 hover:text-gray-900 p-0.5 rounded-md" aria-label="Send message">
                  <PiPaperPlaneTiltBold className="h-3 w-3" />
                </button>
              </div>
              <div className="flex justify-between mt-1">
                <div className="flex gap-1">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.name)}
                      className={`text-[7px] px-1 py-0.5 rounded-md ${
                        activeChannel === channel.name
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      #{channel.name}
                      {channel.unread > 0 && (
                        <span className="ml-0.5 bg-emerald-500 text-white rounded-full px-0.5 text-[6px]">
                          {channel.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant badge */}
      <div className="mt-4 flex justify-center">
        <motion.div
          className="bg-white/50 backdrop-blur-sm rounded-xl px-2 py-1.5 flex items-center gap-1.5 border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
            <Image
              src="/agents/agent-3.png"
              alt="Suitpax AI Agent"
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-medium tracking-tight text-gray-700">Sophia suggests:</p>
            <p className="text-[8px] font-medium tracking-tight text-gray-600">
              "I've updated your workspace with the latest project information."
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UnifiedWorkspace
