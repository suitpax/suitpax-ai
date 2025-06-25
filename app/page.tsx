import Hero from "@/components/marketing/hero"
import PartnersShowcase from "@/components/partners-showcase"
import AITravelAgents from "@/components/marketing/ai-travel-agents"
import BusinessTravelRevolution from "@/components/marketing/business-travel-revolution"
import FoundersOpenLetter from "@/components/marketing/founders-open-letter"
import CloudAIShowcase from "@/components/marketing/cloud-ai-showcase"
import AIMeetingsAttachment from "@/components/marketing/ai-meetings-attachment"
import AgenticDisruption from "@/components/marketing/agentic-disruption"
import AIVoiceAssistant from "@/components/marketing/ai-voice-assistant"
import type { Metadata } from "next"
import SuitpaxHubMap from "@/components/marketing/suitpax-hub-map"
import Features from "@/components/marketing/features"
import AgentGrid from "@/components/ui/agent-grid"
import CounterBadge from "@/components/ui/counter-badge"
// Marketing Components
import FlightsShowcase from "@/components/marketing/flights-showcase"
import BankIntegration from "@/components/marketing/bank-integration"
import TravelPolicy from "@/components/marketing/travel-policy"
import ExpenseManagement from "@/components/marketing/expense-management"
import SmartBooking from "@/components/marketing/smart-booking"
import DashboardShowcase from "@/components/marketing/dashboard-showcase"
import Integration from "@/components/marketing/integration"
import AISuggestions from "@/components/marketing/ai-suggestions"
import Analytics from "@/components/marketing/analytics"
import Reports from "@/components/marketing/reports"
import Invoicing from "@/components/marketing/invoicing"
import SecurityShowcase from "@/components/marketing/security-showcase"
import ComplianceShowcase from "@/components/marketing/compliance-showcase"
import GlobalPresence from "@/components/marketing/global-presence"
import CustomWorkflows from "@/components/marketing/custom-workflows"
import DataInsights from "@/components/marketing/data-insights"

export default function Home() {
  return (
    <>
      <main id="main-content" className="w-full">
        <Hero />
        <PartnersShowcase />
        <AITravelAgents />
        <BusinessTravelRevolution />
        <SuitpaxHubMap />
        <Features />
        <FlightsShowcase />
        <SmartBooking />
        <DashboardShowcase />
        <TravelPolicy />
        <ExpenseManagement />
        <BankIntegration />
        <Integration />
        <Analytics />
        <Reports />
        <Invoicing />
        <DataInsights />
        <CustomWorkflows />
        <SecurityShowcase />
        <ComplianceShowcase />
        <GlobalPresence />
        <AISuggestions />
        <CloudAIShowcase />
        <AgenticDisruption />
        <AIVoiceAssistant />
        <AIMeetingsAttachment />
        <Testimonials />
        <FoundersOpenLetter />
      </main>
    </>
  )
}