import { NextRequest } from "next/server"
import { generatePDF } from "@/lib/generatePDF"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const buffer = await generatePDF(body)

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="documento.pdf"',
      },
    })
  } catch (error) {
    return new Response("Error generando PDF", { status: 500 })
  }
}
