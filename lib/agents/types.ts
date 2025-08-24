export type AgentModel = "claude-sonnet-4-20250514" | "claude-haiku-4-20241022"

export interface AgentToolDefinition {
	name: string
	description?: string
	parametersSchema?: Record<string, unknown>
}

export interface AgentConfig {
	model: AgentModel
	temperature?: number
	maxTokens?: number
	tools?: AgentToolDefinition[]
}

export interface Agent {
	id: string
	user_id: string
	name: string
	description?: string
	persona?: string
	config: AgentConfig
	created_at?: string
	updated_at?: string
}

export interface AgentRunInput {
	message: string
	history?: Array<{ role: "user" | "assistant"; content: string }>
}

export interface AgentRunResult {
	response: string
	usage?: { input_tokens?: number; output_tokens?: number }
	toolCalls?: Array<{ name: string; arguments: Record<string, unknown>; result?: unknown }>
}