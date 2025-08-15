"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe2, ShieldCheck } from "lucide-react"

export function RecentProjectsCard() {
  const projects = [
    { title: "Web Development Project", rate: "$10/hour", tags: ["Remote", "Part-time"], paid: true },
    { title: "Copyright Project", rate: "$10/hour", tags: [], paid: false },
    { title: "Web Design Project", rate: "$10/hour", tags: [], paid: true },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Your Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {projects.map((p, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-gray-100 bg-gray-50/60">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{p.title}</span>
                  {p.paid && <Badge className="bg-gray-900 text-white h-5 px-2">Paid</Badge>}
                </div>
                <div className="text-xs text-gray-500 mt-1">{p.rate}</div>
                <div className="flex gap-2 mt-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>
              <ShieldCheck className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
