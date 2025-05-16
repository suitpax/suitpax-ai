"use client"

import { motion } from "framer-motion"

interface TabNavigationProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export const TabNavigation = ({ tabs, activeTab, onTabChange, className = "" }: TabNavigationProps) => {
  // Get display name for tabs
  const getTabName = (tab: string) => {
    switch (tab) {
      case "team-center":
        return "Team Center"
      default:
        return tab.charAt(0).toUpperCase() + tab.slice(1)
    }
  }

  return (
    <div className={`bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-1 ${className}`}>
      <div className="flex items-center justify-between">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === tab ? "text-white" : "text-white/50 hover:text-white/80"
            } ${tab === "team-center" ? "bg-gradient-to-r from-black/40 to-purple-900/20 border border-purple-500/20" : ""}`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className={`absolute inset-0 rounded-lg ${tab === "team-center" ? "bg-purple-500/10 border border-purple-500/30" : "bg-white/10"}`}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative">
              {getTabName(tab)}
              {tab === "team-center" && (
                <span className="ml-1 text-[8px] bg-purple-500/30 text-purple-300 px-1 rounded-full">New</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
