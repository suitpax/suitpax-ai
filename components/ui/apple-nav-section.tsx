"use client"

import React, { useState } from "react"
import SectionHeader from "@/components/ui/section-header"
import AppleNav from "@/components/ui/apple-nav"

export type AppleNavSectionProps = {
  className?: string
}

const AppleNavSection: React.FC<AppleNavSectionProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState("overview")
  return (
    <div className={className}>
      <SectionHeader
        label="Suitpax UI"
        labelIconSrc="/logo/suitpax-cloud-logo.webp"
        title="Explore our platform"
        subtitle="Quick access to key areas"
        align="center"
        className="mb-4"
      />
      <AppleNav tabs={["overview", "agents", "meetings", "analytics"]} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default AppleNavSection