"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Calendar } from "lucide-react"

export default function MiniContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 max-w-sm"
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-6 w-6 text-gray-700" />
        </div>

        <h3 className="font-medium text-gray-900 mb-2 tracking-tighter">Talk to our AI Team</h3>

        <p className="text-sm text-gray-600 font-light mb-4">Get personalized travel solutions for your business</p>

        <div className="space-y-3">
          <Button asChild className="w-full bg-black text-white hover:bg-gray-800 rounded-xl font-medium">
            <a href="mailto:ai@suitpax.com">
              <Mail className="h-4 w-4 mr-2" />
              Contact AI Team
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
          >
            <a href="https://cal.com/team/founders/partnership" target="_blank" rel="noopener noreferrer">
              <Calendar className="h-4 w-4 mr-2" />
              Book a call
            </a>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-3 font-light">ai@suitpax.com</p>
      </div>
    </motion.div>
  )
}
