import { FLIGHTS_EXPERT_SYSTEM_PROMPT } from "@/lib/prompts/agents/flights-expert"
import { HOTELS_EXPERT_SYSTEM_PROMPT } from "@/lib/prompts/agents/hotels-expert"
import type { AgentConfig } from "@/lib/agents/types"

export interface AgentTemplate {
	key: string
	name: string
	description?: string
	persona: string
	config: AgentConfig
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
	{
		key: "flights_expert",
		name: "Flights Expert",
		description: "Business aviation and corporate flight operations specialist.",
		persona: FLIGHTS_EXPERT_SYSTEM_PROMPT.trim(),
		config: { model: "claude-sonnet-4-20250514", temperature: 0.7, maxTokens: 2000, tools: [] },
	},
	{
		key: "hotels_expert",
		name: "Hotels Expert",
		description: "Business hotels & lodging operations specialist.",
		persona: HOTELS_EXPERT_SYSTEM_PROMPT.trim(),
		config: { model: "claude-sonnet-4-20250514", temperature: 0.6, maxTokens: 2000, tools: [] },
	},
]

export function listAgentTemplates(): AgentTemplate[] {
	return AGENT_TEMPLATES
}

export function getAgentTemplate(key: string): AgentTemplate | undefined {
	return AGENT_TEMPLATES.find((t) => t.key === key)
}