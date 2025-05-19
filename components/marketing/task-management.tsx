"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { UnifiedWorkspace } from "@/components/workspace/unified-workspace"

// Títulos alternativos
const taskManagementTitles = [
  "Your travel command center",
  "Mission control for business travel",
  "Streamline your travel workflow",
  "Organize your business journeys",
  "Your travel productivity hub",
]

export const TaskManagement = () => {
  const [randomTitle, setRandomTitle] = useState("")

  // Seleccionar un título aleatorio al cargar el componente
  useEffect(() => {
    const titleIndex = Math.floor(Math.random() * taskManagementTitles.length)
    setRandomTitle(taskManagementTitles[titleIndex])
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-2xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={40}
                height={10}
                className="h-2.5 w-auto mr-1"
              />
              Workspace
            </span>
            <span className="inline-flex items-center rounded-2xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse mr-1"></span>
              Beta
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl">
            {randomTitle}
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mb-8">
            Manage tasks, documents, and team coordination in one unified workspace designed specifically for business
            travelers
          </p>
        </div>

        <UnifiedWorkspace />
      </div>
    </section>
  )
}

export default TaskManagement
