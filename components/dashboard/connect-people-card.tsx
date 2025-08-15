"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ConnectPeopleCard() {
  const people = [
    { name: "Randy Gouse", role: "Cybersecurity specialist", tag: "Senior", avatar: "/avatar/randy.png" },
    { name: "Giana Schleifer", role: "UX/UI Designer", tag: "Middle", avatar: "/avatar/giana.png" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Let's Connect</CardTitle>
          <div className="text-xs text-gray-500">See all</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {people.map((p) => (
          <div key={p.name} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={p.avatar} alt={p.name} />
                <AvatarFallback>{p.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <span className="text-[10px] rounded-full bg-gray-200 px-2 py-0.5 text-gray-700">{p.tag}</span>
                </div>
                <div className="text-xs text-gray-500">{p.role}</div>
              </div>
            </div>
            <Button size="icon" variant="outline" className="rounded-full h-8 w-8">+</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
