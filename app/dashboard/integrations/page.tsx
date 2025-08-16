"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function IntegrationsPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
  }, [supabase])

  if (!userId) return null

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Integrations</h1>
      <div className="space-y-3">
        <div className="flex items-center justify-between border rounded-xl p-3">
          <div>
            <div className="font-medium">Google Drive</div>
            <div className="text-sm text-gray-600">Read your documents to enrich Suitpax AI</div>
          </div>
          <Link href="/api/integrations/google/drive/auth" className="px-3 py-1.5 border rounded-lg text-sm">Connect</Link>
        </div>
        <div className="flex items-center justify-between border rounded-xl p-3">
          <div>
            <div className="font-medium">Gmail</div>
            <div className="text-sm text-gray-600">Read emails metadata/content (readonly)</div>
          </div>
          <Link href="/api/integrations/google/gmail/auth" className="px-3 py-1.5 border rounded-lg text-sm">Connect</Link>
        </div>
      </div>
    </div>
  )
}