"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskEditor } from "./task-editor"
import { Calendar, Clock, Flag, Paperclip, MessageSquare, User } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  notes?: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: string
  dueDate?: string
  tags: string[]
  estimatedHours?: number
  actualHours?: number
  completionPercentage?: number
}

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
}

export function TaskDetailModal({ task, isOpen, onClose, onSave }: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task)

  if (!task || !editedTask) return null

  const handleSave = () => {
    onSave(editedTask)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Task Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                value={editedTask.description || ""}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="mt-1"
                placeholder="Brief description of the task"
              />
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Notes</Label>
              <TaskEditor
                content={editedTask.notes || ""}
                onChange={(content) => setEditedTask({ ...editedTask, notes: content })}
                placeholder="Add detailed notes, requirements, or updates..."
              />
            </div>

            {/* Comments Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4" />
                <Label className="text-sm font-medium">Comments</Label>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Updated the budget analysis section with Q4 data.</p>
                  </div>
                </div>
                <TaskEditor placeholder="Add a comment..." className="min-h-[80px]" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value: any) => setEditedTask({ ...editedTask, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value: any) => setEditedTask({ ...editedTask, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`mt-2 ${priorityColors[editedTask.priority]}`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {editedTask.priority}
                </Badge>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignee
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {editedTask.assignee
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{editedTask.assignee || "Unassigned"}</span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              <Input
                type="date"
                value={editedTask.dueDate || ""}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Time Tracking */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Tracking
              </Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Estimated:</span>
                  <span>{editedTask.estimatedHours || 0}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Actual:</span>
                  <span>{editedTask.actualHours || 0}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Progress:</span>
                  <span>{editedTask.completionPercentage || 0}%</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="mt-2 flex flex-wrap gap-1">
                {editedTask.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </Label>
              <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
                Add Attachment
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
