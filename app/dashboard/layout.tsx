import type React from "react"
import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import IntercomProvider from "@/components/intercom/intercom-provider"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "Suitpax Dashboard",
  description: "Your AI-powered business travel command center.",
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const user = session.user

  return (
    <>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-black overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Header user={user} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
      <IntercomProvider
        user={{
          id: user.id,
          name: user.user_metadata?.full_name || user.email,
          email: user.email,
          createdAt: user.created_at ? new Date(user.created_at).getTime() / 1000 : undefined,
        }}
      />
      <Toaster position="top-right" />
    </>
  )
}
