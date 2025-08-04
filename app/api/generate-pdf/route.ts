import { type NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const buffer = await generatePDF(body)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=suitpax-chat-export.pdf",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error generando PDF:", error)
    return new NextResponse("Error generando PDF", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
