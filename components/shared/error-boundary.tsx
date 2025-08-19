"use client"

import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-3 text-sm">Something went wrong.</div>
    }
    return this.props.children
  }
}

