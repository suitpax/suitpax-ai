"use client"

import { motion } from "framer-motion"
import { Users, Plus, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeamPage() {
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
          <h1 className="text-3xl font-medium tracking-tighter text-black leading-none">Team Management</h1>
          <p className="text-gray-600 font-light mt-1">Manage your team members and their travel permissions</p>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
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
            <CardTitle className="text-lg font-medium tracking-tighter">Team Members</CardTitle>
            <CardDescription>Manage who can access and book travel on behalf of your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-2">No team members yet</h3>
              <p className="text-gray-600 font-light mb-6">
                Invite team members to collaborate on business travel bookings and expense management.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First Team Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
