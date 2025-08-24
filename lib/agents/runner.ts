import { getAnthropicClient } from "@/lib/anthropic"
import type { Agent, AgentRunInput, AgentRunResult } from "./types"

export async function runAgent(agent: Agent, input: AgentRunInput): Promise<AgentRunResult> {
	const anthropic = getAnthropicClient()
	const maxTokens = agent.config.maxTokens ?? 1000
	const temperature = agent.config.temperature ?? 0.7

	const system = (agent.persona || "").trim()
	const messages = [
		...(input.history || []).map((m) => ({ role: m.role, content: m.content } as const)),
		{ role: "user" as const, content: input.message },
	]

	const res: any = await (anthropic as any).messages.create({
		model: agent.config.model,
		max_tokens: maxTokens,
		temperature,
		system,
		messages,
	})

	const block = res?.content?.[0]
	const text = block && block.type === "text" && typeof block.text === "string" ? block.text : ""
	return {
		response: text,
		usage: { input_tokens: res?.usage?.input_tokens, output_tokens: res?.usage?.output_tokens },
	}
}