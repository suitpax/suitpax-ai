"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

export function BankConnectionCard() {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-3 flex flex-row items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <CardTitle className="text-base font-medium tracking-tighter text-gray-900">Bank Connection</CardTitle>
          <p className="text-xs text-gray-500 font-light">Connect your bank to sync expenses</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
          <div className="text-xs text-gray-600">GoCardless integration coming soon</div>
          <Button className="h-8 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs">Connect</Button>
        </div>
      </CardContent>
    </Card>
  )
}

