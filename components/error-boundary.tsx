"use client"

import type React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-xl font-medium text-black mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-600 mb-6">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <Button onClick={resetErrorBoundary} className="w-full bg-black text-white hover:bg-gray-800 rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer mb-2">Error Details</summary>
            <pre className="text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  )
}

interface AppErrorBoundaryProps {
  children: React.ReactNode
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Error caught by boundary:", error, errorInfo)
        // Here you could send to error reporting service
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
