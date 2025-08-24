export const metadata = { title: "Agentic AI – Suitpax" }

import AgenticOverview from "@/components/agentic/overview"
import AgenticCapabilities from "@/components/agentic/capabilities"
import AgenticArchitecture from "@/components/agentic/architecture"
import AgenticShowcase from "@/components/agentic/showcase"

export default function AgenticAIPage() {
	return (
		<div className="container mx-auto px-4 md:px-6 py-10 space-y-4">
			<h1 className="text-4xl md:text-5xl font-medium tracking-tighter">Agentic AI</h1>
			<p className="text-sm text-gray-600 max-w-2xl">Explore how Suitpax Agentic AI uses MCP, web search, and NDC to deliver end-to-end, policy-aware travel workflows.</p>
			<AgenticOverview />
			<AgenticCapabilities />
			<AgenticArchitecture />
			<AgenticShowcase />
		</div>
	)
}