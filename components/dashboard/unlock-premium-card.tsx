"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UnlockPremiumCard() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-medium tracking-tighter text-gray-900">Unlock Premium Features</div>
            <div className="text-sm text-gray-600">Get access to exclusive benefits and expand your freelancing opportunities</div>
          </div>
          <Button className="rounded-xl">Upgrade now</Button>
        </div>
      </CardContent>
    </Card>
  )
}
