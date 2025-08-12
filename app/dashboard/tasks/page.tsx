"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, MoreHorizontal, Calendar, Flag, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: string
  dueDate?: string
  tags: string[]
  createdAt: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Q4 Travel Budget",
    description: "Analyze travel expenses and prepare budget recommendations",
    status: "todo",
    priority: "high",
    assignee: "John Doe",
    dueDate: "2024-01-15",
    tags: ["finance", "travel"],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Update Company Travel Policy",
    description: "Revise travel policy to include new sustainability guidelines",
    status: "in-progress",
    priority: "medium",
    assignee: "Jane Smith",
    dueDate: "2024-01-20",
    tags: ["policy", "sustainability"],
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    title: "Negotiate Hotel Contracts",
    description: "Renew contracts with preferred hotel partners",
    status: "review",
    priority: "urgent",
    assignee: "Mike Johnson",
    dueDate: "2024-01-10",
    tags: ["contracts", "hotels"],
    createdAt: "2024-01-03",
  },
]

const columns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "review", title: "Review", color: "bg-yellow-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newTasks = [...tasks]
    const taskIndex = newTasks.findIndex((task) => task.id === result.draggableId)

    if (taskIndex !== -1) {
      newTasks[taskIndex].status = destination.droppableId as Task["status"]
      setTasks(newTasks)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Task Management</h1>
              <p className="text-gray-600 mt-1">Organize and track your business travel tasks</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-white/20 rounded-xl"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48 bg-white/70 backdrop-blur-sm border-white/20 rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {columns.map((column) => {
              const count = getTasksByStatus(column.id).length
              return (
                <Card key={column.id} className="bg-white/70 backdrop-blur-sm border-white/20 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{column.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{count}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <Badge variant="secondary" className="rounded-xl">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 transition-all ${
                                snapshot.isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>

                              {task.description && (
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                              )}

                              <div className="flex items-center gap-2 mb-3">
                                <Badge className={`text-xs px-2 py-1 rounded-lg ${priorityColors[task.priority]}`}>
                                  <Flag className="h-3 w-3 mr-1" />
                                  {task.priority}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {task.assignee && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src="/placeholder.svg" />
                                      <AvatarFallback className="text-xs">
                                        {task.assignee
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>

                              {task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {task.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5 rounded-md">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
