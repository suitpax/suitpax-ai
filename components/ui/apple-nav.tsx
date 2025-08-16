"use client"

import React from "react"

export type AppleNavProps = {
  tabs: string[]
  activeTab: string
  onTabChange?: (tab: string) => void
  className?: string
}

export const AppleNav: React.FC<AppleNavProps> = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div className={className}>
      <div className="flex overflow-x-auto bg-black/40 border border-white/10 rounded-xl p-1">
        {tabs.map((tab) => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={
                "relative mx-0.5 inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-medium whitespace-nowrap transition-colors " +
                (isActive
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-white/70 hover:text-white hover:bg-white/5")
              }
            >
              <span className="capitalize">{tab}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AppleNav