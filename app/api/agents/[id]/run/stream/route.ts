import { NextRequest } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { getAnthropicClient } from "@/lib/anthropic"

export const dynamic = "force-dynamic"

export async function POST() {
	return new Response("Agents API is disabled", { status: 410 })
}