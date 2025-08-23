import type { Metadata } from "next"
import ModernManifestoShowcase from "@/components/marketing/modern-manifesto-showcase"
import MCPAIAgents from "@/components/marketing/mcp-ai-agents"
import AITravelAgents from "@/components/marketing/ai-travel-agents"

export const metadata: Metadata = {
	title: "AI Agents | Suitpax",
	description: "How Suitpax AI Agents work with MCP: context, continuity and integrations.",
}

export default function AIAgentsPage() {
	return (
		<main className="w-full">
			{/* Hero/Showcase inspired by the Manifesto layout */}
			<ModernManifestoShowcase />

			{/* Detailed MCP agents section with workflows and integrations */}
			<MCPAIAgents />

			{/* Agents grid preview */}
			<AITravelAgents />
		</main>
	)
}