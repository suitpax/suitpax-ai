"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, CheckCircle, Users, DollarSign } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const complianceData = [
  { month: "Jan", compliance: 85, violations: 12 },
  { month: "Feb", compliance: 88, violations: 8 },
  { month: "Mar", compliance: 92, violations: 6 },
  { month: "Apr", compliance: 89, violations: 9 },
  { month: "May", compliance: 94, violations: 4 },
  { month: "Jun", compliance: 96, violations: 3 },
]

const violationTypes = [
  { name: "Booking Outside Policy", value: 35, color: "#ef4444" },
  { name: "Expense Limit Exceeded", value: 28, color: "#f97316" },
  { name: "Unapproved Vendors", value: 20, color: "#eab308" },
  { name: "Missing Documentation", value: 17, color: "#3b82f6" },
]

export default function PolicyComplianceDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-green-600">96%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress value={96} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">+4% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Violations</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">-50% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-blue-600">$24.5K</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant Users</p>
                <p className="text-2xl font-bold text-purple-600">247/257</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">96% compliance rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compliance" className="w-full">
            <TabsList>
              <TabsTrigger value="compliance">Compliance Rate</TabsTrigger>
              <TabsTrigger value="violations">Violation Types</TabsTrigger>
            </TabsList>

            <TabsContent value="compliance" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complianceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="compliance"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="violations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={violationTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {violationTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {violationTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                      <Badge variant="secondary">{type.value}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "John Smith", violation: "Exceeded hotel budget", amount: "$450", status: "pending" },
                { user: "Sarah Johnson", violation: "Unapproved airline", amount: "$320", status: "resolved" },
                { user: "Mike Davis", violation: "Missing receipt", amount: "$85", status: "pending" },
              ].map((violation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{violation.user}</p>
                    <p className="text-xs text-gray-500">{violation.violation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{violation.amount}</p>
                    <Badge variant={violation.status === "resolved" ? "default" : "destructive"} className="text-xs">
                      {violation.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "Emily Chen", compliance: 100, savings: "$1,200" },
                { user: "David Wilson", compliance: 98, savings: "$980" },
                { user: "Lisa Anderson", compliance: 97, savings: "$850" },
              ].map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{performer.user}</p>
                    <p className="text-xs text-gray-500">{performer.compliance}% compliance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{performer.savings}</p>
                    <p className="text-xs text-gray-500">saved</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
