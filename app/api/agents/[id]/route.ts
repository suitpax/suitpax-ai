import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createServerSupabase()
		const { data, error } = await supabase.from("agents").select("*").eq("id", params.id).single()
		if (error) throw error
		return NextResponse.json({ agent: data })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to fetch agent", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const payload = await req.json()
		const supabase = createServerSupabase()
		const { data, error } = await supabase.from("agents").update({
			name: payload?.name,
			description: payload?.description,
			persona: payload?.persona,
			config: payload?.config,
		}).eq("id", params.id).select("*").single()
		if (error) throw error
		return NextResponse.json({ agent: data })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to update agent", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		const supabase = createServerSupabase()
		const { error } = await supabase.from("agents").delete().eq("id", params.id)
		if (error) throw error
		return NextResponse.json({ success: true })
	} catch (e: any) {
		return NextResponse.json({ error: "Failed to delete agent", details: process.env.NODE_ENV === "development" ? e?.message : undefined }, { status: 500 })
	}
}