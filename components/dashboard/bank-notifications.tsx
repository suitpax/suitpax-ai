"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Settings } from "lucide-react"

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
  type: "email" | "push" | "both"
  threshold?: number
  icon: React.ReactNode
}

export function BankNotifications() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "large_transaction",
      title: "Large Transactions",
      description: "Get notified when a transaction exceeds your set threshold",
      enabled: true,
      type: "both",
      threshold: 500,
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "daily_summary",
      title: "Daily Summary",
      description: "Receive a daily summary of your transactions and balance",
      enabled: true,
      type: "email",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "unusual_activity",
      title: "Unusual Activity",
      description: "Alert when spending patterns deviate from your normal behavior",
      enabled: true,
      type: "both",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: "budget_alerts",
      title: "Budget Alerts",
      description: "Notifications when you approach or exceed budget limits",
      enabled: false,
      type: "push",
      threshold: 80,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "sync_status",
      title: "Sync Status",
      description: "Updates on bank account synchronization status",
      enabled: true,
      type: "push",
      icon: <Settings className="w-4 h-4" />,
    },
  ])

  const handleToggleNotification = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, enabled: !notification.enabled } : notification,
      ),
    )
  }

  const handleUpdateType = (id: string, type: "email" | "push" | "both") => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, type } : notification)),
    )
  }

  const handleUpdateThreshold = (id: string, threshold: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, threshold } : notification)),
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-200 rounded-xl">
            <Bell className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="text-lg font-medium tracking-tighter text-black">Notification Settings</h3>
            <p className="text-sm text-gray-600">
              Configure how and when you want to be notified about your banking activity
            </p>
          </div>
        </div>

        {/* Global Settings */}
        <Card className="p-4 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-black">Global Preferences</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Default Notification Method</label>
              <Select defaultValue="both">
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="push">Push Only</SelectItem>
                  <SelectItem value="both">Email + Push</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Quiet Hours</label>
              <Select defaultValue="22-08">
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Quiet Hours</SelectItem>
                  <SelectItem value="22-08">10 PM - 8 AM</SelectItem>
                  <SelectItem value="23-07">11 PM - 7 AM</SelectItem>
                  <SelectItem value="00-09">12 AM - 9 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Individual Notification Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-black">Notification Types</h4>
          {notifications.map((notification) => (
            <Card key={notification.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg mt-1">{notification.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-black">{notification.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notification.enabled}
                    onCheckedChange={() => handleToggleNotification(notification.id)}
                  />
                </div>

                {notification.enabled && (
                  <div className="ml-11 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Notification Method</label>
                        <Select
                          value={notification.type}
                          onValueChange={(value: "email" | "push" | "both") => handleUpdateType(notification.id, value)}
                        >
                          <SelectTrigger className="rounded-xl border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email Only</SelectItem>
                            <SelectItem value="push">Push Only</SelectItem>
                            <SelectItem value="both">Email + Push</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {notification.threshold !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            {notification.id === "large_transaction" ? "Amount Threshold (€)" : "Percentage (%)"}
                          </label>
                          <Input
                            type="number"
                            value={notification.threshold}
                            onChange={(e) =>
                              handleUpdateThreshold(notification.id, Number.parseInt(e.target.value) || 0)
                            }
                            className="rounded-xl border-gray-200"
                            min="0"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Test Notifications */}
        <Card className="p-4 border border-gray-200 rounded-xl bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Test Notifications</h4>
              <p className="text-sm text-blue-700 mt-1">
                Send a test notification to verify your settings are working correctly
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100 bg-transparent"
            >
              Send Test
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  )
}
