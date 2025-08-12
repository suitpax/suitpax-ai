"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { GripVertical } from "lucide-react"

interface DashboardCard {
  id: string
  component: React.ReactNode
  title: string
}

interface SortableCardProps {
  id: string
  children: React.ReactNode
  title: string
}

function SortableCard({ id, children, title }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${isDragging ? "z-50" : ""}`} {...attributes}>
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Card Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isDragging ? "shadow-2xl scale-105" : ""} transition-all duration-200`}
      >
        {children}
      </motion.div>
    </div>
  )
}

interface DraggableDashboardProps {
  cards: DashboardCard[]
  onReorder?: (newOrder: string[]) => void
}

export function DraggableDashboard({ cards: initialCards, onReorder }: DraggableDashboardProps) {
  const [cards, setCards] = useState(initialCards)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load saved order from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("dashboard-card-order")
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder)
        const reorderedCards = orderIds.map((id: string) => cards.find((card) => card.id === id)).filter(Boolean)

        // Add any new cards that weren't in the saved order
        const newCards = cards.filter((card) => !orderIds.includes(card.id))
        setCards([...reorderedCards, ...newCards])
      } catch (error) {
        console.error("Error loading dashboard order:", error)
      }
    }
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        const newOrder = arrayMove(items, oldIndex, newIndex)

        // Save to localStorage
        const orderIds = newOrder.map((card) => card.id)
        localStorage.setItem("dashboard-card-order", JSON.stringify(orderIds))

        // Call callback if provided
        onReorder?.(orderIds)

        return newOrder
      })
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-6">
          {cards.map((card) => (
            <SortableCard key={card.id} id={card.id} title={card.title}>
              {card.component}
            </SortableCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
