import { type NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const { content, reasoning } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const pdfBuffer = await generatePDF(content, reasoning)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="suitpax-ai-response-${Date.now()}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
