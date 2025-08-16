"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import BusinessTravelPlatform from "@/components/demo-product/business-travel-platform"
import ExpenseManagement from "@/components/demo-product/expense-management"

const productTabs = [
  {
    id: "business-travel",
    title: "Business Travel Platform",
    description: "Corporate travel management with AI",
  },
  {
    id: "expense-management",
    title: "Expense Management",
    description: "Business expense control and automation",
  },
]

export default function Product() {
  const [activeTab, setActiveTab] = useState("business-travel")
  const [isMobile, setIsMobile] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-medium text-white border border-white/20 shadow-sm">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1"
              />
              Product
            </span>
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-medium text-white border border-white/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse mr-1"></span>
              Interactive Demo
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none mb-4">
            <em className="font-serif italic">Our Products & Services</em>
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl">
            Discover how our solutions transform corporate travel and expense management for businesses of all sizes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex justify-center gap-4 mb-8" ref={tabsRef}>
            {productTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  activeTab === tab.id
                    ? "text-white bg-white/10 border-white/20 backdrop-blur-md shadow-sm"
                    : "text-gray-400 hover:text-gray-200 border-transparent"
                }`}
              >
                <span>{tab.title}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[480px]"
            >
              {activeTab === "business-travel" && <BusinessTravelPlatform />}
              {activeTab === "expense-management" && <ExpenseManagement />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
