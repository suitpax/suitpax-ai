"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function DashboardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <motion.div initial={{ width: 0 }} animate={{ width: "16rem" }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Skeleton className="h-8 w-64 mb-2 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
          </motion.div>
          <motion.div initial={{ width: 0 }} animate={{ width: "12rem" }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Skeleton className="h-4 w-48 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
          </motion.div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Skeleton className="h-10 w-32 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <Skeleton className="h-10 w-32 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          >
            <Skeleton className="h-24 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Skeleton className="h-64 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Skeleton className="h-64 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <Skeleton className="h-32 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        className="flex items-center justify-center py-8"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
            <img src="/suitpax-bl-logo.webp" alt="Suitpax" className="w-full h-full object-contain p-1" />
          </div>
          <div className="text-sm font-medium text-gray-600 tracking-tight">
            Loading your business travel dashboard...
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
