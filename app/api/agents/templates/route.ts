import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { listAgentTemplates, getAgentTemplate } from "@/lib/agents/templates"

export async function GET() {
	try {
		const templates = listAgentTemplates().map((t) => ({
			key: t.key,
			name: t.name,
			description: t.description,
			persona: t.persona,
			config: t.config,
		}))
		return NextResponse.json({ templates })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to list templates", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const payload = await req.json()
		const key = String(payload?.key || "")
		if (!key) return NextResponse.json({ error: "Template key required" }, { status: 400 })

		const supabase = createServerSupabase()
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

		const tpl = getAgentTemplate(key)
		if (!tpl) return NextResponse.json({ error: "Template not found" }, { status: 404 })

		const agent = {
			user_id: user.id,
			name: String(payload?.name || tpl.name),
			description: String(payload?.description || tpl.description || ""),
			persona: String(payload?.persona || tpl.persona || ""),
			config: payload?.config || tpl.config,
		}

		const { data, error } = await supabase.from("agents").insert(agent).select("*").single()
		if (error) throw error
		return NextResponse.json({ agent: data })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to apply template", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}