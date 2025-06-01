"use client"

import { X, Briefcase, CreditCard, CheckSquare, BarChart3, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { AISection } from "./suitpax-chat"

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeSection: AISection
  onSectionChange: (section: AISection) => void
}

const sections = [
  { id: "business" as AISection, name: "Business Travel", icon: Briefcase, description: "Plan and book trips" },
  { id: "expenses" as AISection, name: "Expense Management", icon: CreditCard, description: "Track and manage costs" },
  { id: "tasks" as AISection, name: "Task Management", icon: CheckSquare, description: "Organize your workflow" },
  { id: "reporting" as AISection, name: "Analytics", icon: BarChart3, description: "Insights and reports" },
  { id: "support" as AISection, name: "Support", icon: HelpCircle, description: "Get help and assistance" },
]

export default function MobileNavigation({ isOpen, onClose, activeSection, onSectionChange }: MobileNavigationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-md border-r border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <img src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" className="h-6 w-auto" />
                <span className="text-white font-medium">AI Assistant</span>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id

                  return (
                    <button
                      key={section.id}
                      onClick={() => onSectionChange(section.id)}
                      className={`w-full text-left p-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-white/10 text-white border border-white/20"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-white/50">{section.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="text-xs text-white/50 text-center">Powered by Suitpax AI</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
