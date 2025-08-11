import { type NextRequest } from "next/server"
import { generatePDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const { content, reasoning } = await request.json()

    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 })
    }

    const pdfBuffer = await generatePDF(content, reasoning)
    const ab = new ArrayBuffer(pdfBuffer.byteLength)
    const view = new Uint8Array(ab)
    view.set(pdfBuffer)
    const blob = new Blob([ab], { type: "application/pdf" })

    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="suitpax-ai-response-${Date.now()}\.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF Generation Error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), { status: 500 })
  }
}
