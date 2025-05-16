import type { Metadata } from "next"
import { AutomatedTravelPolicies } from "@/components/marketing/automated-travel-policies"

export const metadata: Metadata = {
  title: "Travel Policies | Suitpax",
  description:
    "Transform your corporate travel with AI-powered policies that ensure compliance, optimize spending, and enhance traveler experience.",
}

export default function TravelPoliciesPage() {
  return (
    <>
      <AutomatedTravelPolicies />
    </>
  )
}
