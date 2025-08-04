import { type NextRequest, NextResponse } from "next/server"
import { generateChatPDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const { messages, title, userInfo } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Generate PDF
    const pdf = generateChatPDF({
      messages: messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      title,
      userInfo,
    })

    // Convert to buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="suitpax-ai-chat-${new Date().toISOString().split("T")[0]}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
