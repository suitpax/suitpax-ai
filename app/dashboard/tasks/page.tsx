"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, MoreHorizontal, Calendar, Flag, Search, Filter, Clock, Paperclip, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useDropzone } from "react-dropzone"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

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
  { id: "todo", title: "To Do", color: "bg-gray-200" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-200" },
  { id: "review", title: "Review", color: "bg-yellow-200" },
  { id: "done", title: "Done", color: "bg-green-200" },
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    assignee: "",
    dueDate: "",
    tags: [] as string[],
  })

  const supabase = createClient()

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3 rounded-lg border",
      },
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/*": [],
    },
    onDrop: (acceptedFiles) => {
      console.log("Files dropped:", acceptedFiles)
    },
  })

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

  const createTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: editor?.getHTML() || newTask.description,
      status: "todo",
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      tags: newTask.tags,
      createdAt: new Date().toISOString(),
    }

    setTasks([...tasks, task])
    setIsCreateDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      dueDate: "",
      tags: [],
    })
    editor?.commands.clearContent()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-medium tracking-tighter text-gray-900">Task Management</h1>
              <p className="text-gray-600 mt-2 font-light">Organize and track your business travel tasks efficiently</p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-6 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-sm border-gray-200 rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-medium tracking-tight">Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Task Title
                    </Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="mt-1 rounded-xl border-gray-200"
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <div className="mt-1 border border-gray-200 rounded-xl overflow-hidden">
                      <EditorContent editor={editor} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger className="mt-1 rounded-xl border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="mt-1 rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Attachments</Label>
                    <div
                      {...getRootProps()}
                      className={`mt-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {isDragActive ? "Drop files here..." : "Drag & drop files or click to browse"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button onClick={createTask} className="bg-black hover:bg-gray-800 text-white rounded-xl">
                      Create Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl shadow-sm"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl shadow-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {columns.map((column) => {
              const count = getTasksByStatus(column.id).length
              return (
                <Card
                  key={column.id}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{column.title}</p>
                        <p className="text-3xl font-medium tracking-tight text-gray-900 mt-1">{count}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${column.color.replace("100", "200")}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-gray-900 tracking-tight">{column.title}</h3>
                  <Badge variant="secondary" className="rounded-xl bg-gray-100 text-gray-700">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-[300px] p-3 rounded-xl transition-colors ${
                        snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                      }`}
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${
                                snapshot.isDragging ? "shadow-lg rotate-1 scale-105" : ""
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">{task.title}</h4>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>

                                {task.description && (
                                  <div
                                    className="text-xs text-gray-600 mb-3 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: task.description }}
                                  />
                                )}

                                <div className="flex items-center gap-2 mb-4">
                                  <Badge className={`text-xs px-2 py-1 rounded-lg ${priorityColors[task.priority]}`}>
                                    <Flag className="h-3 w-3 mr-1" />
                                    {task.priority}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    {task.assignee && (
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src="/placeholder.svg" />
                                        <AvatarFallback className="text-xs bg-gray-100">
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

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                      <MessageSquare className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                      <Paperclip className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(task.createdAt).toLocaleDateString()}
                                  </div>
                                </div>

                                {task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {task.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs px-2 py-0.5 rounded-md border-gray-200"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
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
