import { NextResponse } from "next/server"

export async function GET() { return NextResponse.json({ error: "Agents API is disabled" }, { status: 410 }) }
export async function POST() { return NextResponse.json({ error: "Agents API is disabled" }, { status: 410 }) }