import type { ReactNode } from "react"

export interface StatItem {
  label: string
  value: string
  icon: ReactNode
}

export interface ActivityItem {
  action: string
  company: string
  time: string
  icon: ReactNode
}

export interface ContactProps {
  name: string
  position: string
  company: string
  companyIcon: ReactNode
  email: string
  phone: string
  image: string
  badge: string
  isPlayground?: boolean
}

export interface DealItem {
  company: string
  icon: ReactNode
  deal: string
  stage: string
  value: string
  probability: number
}

export interface Workflow {
  name: string
  logo: ReactNode
  domain: string
  location: string
  steps: WorkflowStep[]
}

export interface WorkflowStep {
  title: string
  icon: ReactNode
  description: string
  user: User
}

export interface User {
  name: string
  position: string
  email: string
  phone: string
  image: string
}
