import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET() {
	try {
		const supabase = createServerSupabase()
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ agents: [] })
		const { data, error } = await supabase.from("agents").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
		if (error) throw error
		return NextResponse.json({ agents: data || [] })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to list agents", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const payload = await req.json()
		const supabase = createServerSupabase()
		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		const agent = {
			user_id: user.id,
			name: String(payload?.name || "Untitled Agent"),
			description: String(payload?.description || ""),
			persona: String(payload?.persona || ""),
			config: payload?.config || { model: "claude-sonnet-4-20250514", temperature: 0.7, maxTokens: 1000 },
		}
		const { data, error } = await supabase.from("agents").insert(agent).select("*").single()
		if (error) throw error
		return NextResponse.json({ agent: data })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to create agent", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}