"use client"

import { motion } from "framer-motion"
import { MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black leading-none">Travel Locations</h1>
          <p className="text-gray-600 font-light mt-1">Manage your frequent destinations and travel preferences</p>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </motion.div>

      {/* Zero State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-tighter">Saved Locations</CardTitle>
            <CardDescription>Your frequently visited business destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-2">No saved locations</h3>
              <p className="text-gray-600 font-light mb-6">
                Save your frequent business destinations to make booking faster and easier.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
