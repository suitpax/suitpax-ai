import { NextRequest } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { getAnthropicClient } from "@/lib/anthropic"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	const supabase = createServerSupabase()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) return new Response("Unauthorized", { status: 401 })

	try {
		const body = await req.json()
		const message = String(body?.message || "")
		const history = Array.isArray(body?.history) ? body.history : []
		if (!message) return new Response("Message required", { status: 400 })

		const { data: agent, error: agentErr } = await supabase.from("agents").select("*").eq("id", params.id).single()
		if (agentErr || !agent) return new Response("Agent not found", { status: 404 })

		const anthropic = getAnthropicClient()
		const encoder = new TextEncoder()

		// Create run record
		const { data: run, error: runErr } = await supabase.from("agent_runs").insert({
			agent_id: agent.id,
			user_id: user.id,
			input_message: message,
			status: "running",
			model: agent.config?.model || "claude-sonnet-4-20250514",
		}).select("*").single()
		if (runErr || !run) return new Response("Failed to create run", { status: 500 })

		// Fire start event (best-effort)
		try {
			await supabase.from("agent_run_events").insert({
				run_id: run.id,
				user_id: user.id,
				type: "start",
				data: { historySize: history.length },
			})
		} catch {}

		const stream = new ReadableStream<Uint8Array>({
			async start(controller) {
				let fullText = ""
				try {
					// @ts-ignore using stream API
					const astream = await (anthropic as any).messages.stream({
						model: agent.config?.model || "claude-sonnet-4-20250514",
						max_tokens: agent.config?.maxTokens ?? 2000,
						temperature: agent.config?.temperature ?? 0.7,
						system: (agent.persona || "").trim(),
						messages: [...history.map((m: any) => ({ role: m.role, content: m.content })), { role: "user", content: message }],
					})

					for await (const event of astream) {
						if (event?.type === "content_block_delta" && event?.delta?.type === "text_delta" && typeof event.delta.text === "string") {
							fullText += event.delta.text
							controller.enqueue(encoder.encode(event.delta.text))
						}
					}

					const final = await astream.finalMessage()
					const inputTokens = (final as any)?.usage?.input_tokens || 0
					const outputTokens = (final as any)?.usage?.output_tokens || 0

					// Persist completion
					try {
						await supabase.from("agent_runs").update({
							status: "completed",
							output: fullText,
							input_tokens: inputTokens,
							output_tokens: outputTokens,
							completed_at: new Date().toISOString(),
						}).eq("id", run.id)
						await supabase.from("agent_run_events").insert({
							run_id: run.id,
							user_id: user.id,
							type: "end",
							data: { inputTokens, outputTokens },
						})
					} catch {}

					controller.close()
				} catch (e: any) {
					try {
						await supabase.from("agent_runs").update({ status: "error" }).eq("id", run.id)
						await supabase.from("agent_run_events").insert({ run_id: run.id, user_id: user.id, type: "error", data: { message: e?.message } })
					} catch {}
					controller.error(e)
				}
			},
		})

		return new Response(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache, no-transform",
			},
		})
	} catch (e: any) {
		return new Response("Error", { status: 500 })
	}
}