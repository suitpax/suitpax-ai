"use client"

import { motion } from "framer-motion"
import { PiHandshakeBold, PiChartLineUpBold, PiUsersBold } from "react-icons/pi"

export const TRMManagement = () => {
  return (
    <section className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            <PiHandshakeBold className="mr-1.5 h-3 w-3" />
            TRAVEL RELATIONSHIP MANAGEMENT
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black mb-6">
            Manage Your Travel Network
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Build and maintain relationships with travel partners, vendors, and team members through our comprehensive
            TRM system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
              <PiUsersBold className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-black mb-3">Contact Management</h3>
            <p className="text-gray-600 font-light">
              Organize and manage all your travel contacts, from hotel managers to airline representatives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
              <PiChartLineUpBold className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-black mb-3">Deal Pipeline</h3>
            <p className="text-gray-600 font-light">
              Track negotiations and deals with travel vendors to secure the best rates for your organization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
              <PiHandshakeBold className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-black mb-3">Workflow Automation</h3>
            <p className="text-gray-600 font-light">
              Automate relationship management workflows to maintain consistent communication with partners.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
