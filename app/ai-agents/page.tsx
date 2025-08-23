import type { Metadata } from "next"
import ModernManifestoShowcase from "@/components/marketing/modern-manifesto-showcase"
import MCPAIAgents from "@/components/marketing/mcp-ai-agents"
import AITravelAgents from "@/components/marketing/ai-travel-agents"

export const metadata: Metadata = {
	title: "AI Agents for Business Travel",
	description:
		"Meet Suitpax AI Agents powered by MCP. Persistent context, multi‑step planning, and deep integrations to automate business travel and expenses.",
	openGraph: {
		title: "Suitpax AI Agents — MCP context and automations",
		description:
			"Agents with long‑term memory, workflow orchestration and real‑time travel intelligence.",
		url: "https://suitpax.com/ai-agents",
		siteName: "Suitpax",
		images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Suitpax AI Agents" }],
		locale: "en_US",
		type: "article",
	},
	alternates: { canonical: "https://suitpax.com/ai-agents" },
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