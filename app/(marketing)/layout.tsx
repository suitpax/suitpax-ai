import Navigation from "@/components/marketing/navigation"
import Footer from "@/components/marketing/footer"
import { createClient } from "@/lib/supabase/server"
import type React from "react"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navigation user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
