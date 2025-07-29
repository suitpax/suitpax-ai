import { type NextRequest, NextResponse } from "next/server"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, files } = await request.json()

    // Prepare the context with file information if any
    let contextMessage = message || ""

    if (files && files.length > 0) {
      contextMessage += "\n\nArchivos adjuntos:\n"
      files.forEach((file: any, index: number) => {
        contextMessage += `${index + 1}. ${file.name} (${file.type}, ${Math.round(file.size / 1024)}KB)\n`
        if (file.content) {
          contextMessage += `Contenido: ${file.content.substring(0, 1000)}...\n`
        }
      })
    }

    const { text } = await generateText({
      model: xai("grok-3"),
      system: `Eres Zia, un asistente de IA especializado en viajes de negocios para Suitpax. 
      
      Características principales:
      - Ayudas con reservas de vuelos, hoteles y gestión de gastos
      - Eres experto en políticas de viaje corporativo
      - Proporcionas información sobre destinos de negocios
      - Puedes analizar documentos de viaje y facturas
      - Respondes en español de manera profesional pero amigable
      - Si te suben archivos, analízalos y proporciona insights útiles
      
      Siempre mantén un tono profesional pero cercano, y enfócate en soluciones prácticas para viajes de negocios.`,
      prompt: contextMessage,
      maxTokens: 1000,
    })

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI chat:", error)

    return NextResponse.json(
      {
        error: "Error procesando la solicitud",
        response: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
      },
      { status: 500 },
    )
  }
}
