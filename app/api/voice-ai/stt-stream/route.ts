import { NextRequest } from "next/server"

// Placeholder: Next.js App Router does not expose raw WebSocket upgrade directly in route handlers.
// In production, implement a separate Node server (ws) or Edge runtime with WebSocket support to stream audio to Google STT v1p1beta1.
// This endpoint will return 501 to indicate streaming must be handled by a dedicated server for now.

export async function GET() {
  return new Response('Not Implemented: use dedicated WS server for streaming STT', { status: 501 })
}

