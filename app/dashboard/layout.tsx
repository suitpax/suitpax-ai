import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import AppErrorBoundary from "@/components/error-boundary"
import { Toaster } from "react-hot-toast"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to check subscription plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_status")
    .eq("id", user.id)
    .single()

  const userPlan = profile?.subscription_plan || "free"
  const subscriptionStatus = profile?.subscription_status || "inactive"

  return (
    <div className="min-h-screen bg-gray-50">
      <AppErrorBoundary>
        <div className="flex h-screen">
          <Sidebar user={user} userPlan={userPlan} />
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            <Header user={user} userPlan={userPlan} subscriptionStatus={subscriptionStatus} />
            <main className="flex-1 overflow-y-auto p-0 lg:p-6">{children}</main>
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "8px",
            },
            success: {
              style: {
                background: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
      </AppErrorBoundary>
    </div>
  )
}
