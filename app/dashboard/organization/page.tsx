"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function OrganizationPage() {
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Organization</h1>
          <p className="text-gray-600 font-light">Configure company profile, domains and defaults</p>
        </div>
      </motion.div>

      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input placeholder="Acme Inc." />
            </div>
            <div>
              <Label>Primary Domain</Label>
              <Input placeholder="acme.com" />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input placeholder="Europe/Madrid" />
            </div>
            <div>
              <Label>Default Currency</Label>
              <Input placeholder="EUR" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-black text-white hover:bg-gray-800">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

