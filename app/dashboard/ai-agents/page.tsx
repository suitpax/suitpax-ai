import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PiRobot, PiPlus, PiChartBar, PiClock } from "react-icons/pi"

export default function AIAgentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Agents</h2>
        <Button>
          <PiPlus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PiRobot className="h-5 w-5" />
                Travel Booking Agent
              </CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            <CardDescription>Automatically books flights and hotels based on your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tasks Completed</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Success Rate</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PiChartBar className="h-5 w-5" />
                Expense Manager
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Active
              </Badge>
            </div>
            <CardDescription>Tracks and categorizes your travel expenses automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Expenses Processed</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Money Saved</span>
                <span className="font-medium">$2,340</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PiClock className="h-5 w-5" />
                Schedule Optimizer
              </CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Learning
              </Badge>
            </div>
            <CardDescription>Optimizes your travel schedule for maximum efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Schedules Optimized</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Time Saved</span>
                <span className="font-medium">12 hours</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium">30 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
          <CardDescription>Overview of your AI agents' performance this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <p className="text-sm text-gray-500">Average Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">226</div>
              <p className="text-sm text-gray-500">Total Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$4,680</div>
              <p className="text-sm text-gray-500">Total Savings Generated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
