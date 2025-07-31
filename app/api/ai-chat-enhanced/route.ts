import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateTravelResponse } from "@/lib/langchain"
import { createMemoryManager } from "@/lib/mem0"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Initialize memory manager
    const memoryManager = createMemoryManager(user.id)

    // Get relevant memories for context
    const relevantMemories = await memoryManager.getContextualMemory(message)

    // Generate AI response with memory context
    const aiResponse = await generateTravelResponse({
      query: message,
      memory: relevantMemories,
      userProfile: profile,
    })

    // Store the conversation in memory
    await memoryManager.addMemory(`User asked: "${message}" - AI responded: "${aiResponse}"`, "general", {
      timestamp: new Date().toISOString(),
      context: context || "chat",
    })

    // Log the conversation
    await supabase.from("ai_chat_logs").insert({
      user_id: user.id,
      message,
      response: aiResponse,
      context: context || "chat",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
