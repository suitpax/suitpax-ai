import { type NextRequest, NextResponse } from "next/server"
import { generateChatPDF } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, title, userInfo } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Get user info from Supabase if not provided
    let finalUserInfo = userInfo
    if (!finalUserInfo) {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          finalUserInfo = {
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name,
          }
        }
      } catch (error) {
        console.warn("Could not get user info:", error)
      }
    }

    // Generate PDF
    const pdfBuffer = await generateChatPDF(messages, title || "Suitpax AI Chat Export", finalUserInfo)

    // Log the export (optional)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("ai_chat_logs").insert({
          user_id: user.id,
          message: "PDF Export",
          response: `Exported ${messages.length} messages`,
          context_type: "pdf_export",
          tokens_used: 0,
        })
      }
    } catch (logError) {
      console.warn("Could not log PDF export:", logError)
    }

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="suitpax-chat-${new Date().toISOString().split("T")[0]}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("PDF Generation Error:", error)

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
