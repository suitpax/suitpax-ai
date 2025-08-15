"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, TrendingUp } from "lucide-react"

export const PolicyComplianceTracker = () => {
  const complianceData = [
    { policy: "Executive Travel", compliance: 98, violations: 2, trend: "up" },
    { policy: "Standard Employee", compliance: 94, violations: 5, trend: "stable" },
    { policy: "Expense Approval", compliance: 99, violations: 1, trend: "up" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium tracking-tighter text-black">Compliance Tracking</h3>
            <p className="text-sm text-gray-600">Real-time policy compliance monitoring</p>
          </div>
        </div>

        <div className="space-y-4">
          {complianceData.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{item.policy}</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs ${
                      item.compliance >= 98
                        ? "bg-green-100 text-green-800 border-green-200"
                        : item.compliance >= 95
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {item.compliance}%
                  </Badge>
                  {item.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                </div>
              </div>

              <Progress value={item.compliance} className="mb-2" />

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.violations} violations this month</span>
                <span>Target: 95%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
