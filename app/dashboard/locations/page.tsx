"use client"

import { motion } from "framer-motion"
import { MapPinIcon, PlusIcon, HeartIcon } from "@heroicons/react/24/outline"

export default function LocationsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Locations</h1>
          <p className="text-gray-600 font-light">
            <em className="font-serif italic">Your saved destinations and favorite places</em>
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Location
        </button>
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center"
      >
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPinIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-2">No saved locations</h3>
        <p className="text-gray-600 font-light mb-6">
          <em className="font-serif italic">
            Save your favorite hotels, restaurants, and destinations for quick access
          </em>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors tracking-tight">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Location
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-xl hover:bg-gray-300 transition-colors tracking-tight">
            <HeartIcon className="h-4 w-4 mr-2" />
            Browse Popular
          </button>
        </div>
      </motion.div>
    </div>
  )
}
