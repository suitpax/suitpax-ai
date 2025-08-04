// import { generatePDF } from "@/lib/generatePDF"

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json()
    // const buffer = await generatePDF(body)
    
    return new Response("PDF generation temporarily disabled", {
      status: 501,
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error) {
    return new Response("Error generando PDF", { status: 500 })
  }
}