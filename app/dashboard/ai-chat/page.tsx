import { Suspense } from "react"
import SuitpaxChat from "@/components/dashboard/chat/suitpax-chat"
import { Card, CardContent } from "@/components/ui/card"

export default function AIChatPage() {
  return (
    <div className="container mx-auto p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Chat</h1>
        <p className="text-gray-600 mt-2">
          Chat with Suitpax AI, your intelligent travel assistant. You can type, speak, or upload files.
        </p>
      </div>

      <Suspense
        fallback={
          <Card className="h-[600px]">
            <CardContent className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </CardContent>
          </Card>
        }
      >
        <div className="h-[calc(100vh-200px)]">
          <SuitpaxChat />
        </div>
      </Suspense>
    </div>
  )
}
