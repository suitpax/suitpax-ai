"use client"

import React from "react"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangleIcon className="h-7 w-7 text-gray-700" />
            </div>
            <h2 className="text-xl font-medium tracking-tight text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 font-light mb-6">
              We ran into an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors tracking-tight"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
