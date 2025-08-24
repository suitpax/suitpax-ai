import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { runAgent } from "@/lib/agents/runner"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const body = await req.json()
		const supabase = createServerSupabase()
		const { data: agent, error } = await supabase.from("agents").select("*").eq("id", params.id).single()
		if (error || !agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })
		const result = await runAgent(agent as any, { message: String(body?.message || ""), history: Array.isArray(body?.history) ? body.history : [] })
		return NextResponse.json(result)
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to run agent", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}