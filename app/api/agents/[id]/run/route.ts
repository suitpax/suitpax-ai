import { NextResponse } from "next/server"

export async function POST() { return NextResponse.json({ error: "Agents API is disabled" }, { status: 410 }) }