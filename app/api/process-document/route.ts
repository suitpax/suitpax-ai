import { type NextRequest, NextResponse } from "next/server"

interface DocumentAnalysis {
  text: string
  confidence: number
  language: string
  documentType: "pdf" | "image" | "word" | "excel" | "unknown"
  extractedData: {
    companyName?: string
    employeeCount?: number
    industry?: string
    budget?: number
    travelFrequency?: string
    regions?: string[]
    policies?: string[]
  }
  metadata: {
    pages?: number
    fileSize: number
    processedAt: Date
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileType = getFileType(file)
    let text = ""
    let confidence = 0

    switch (fileType) {
      case "pdf":
        text = await processPDF(file)
        confidence = 0.95
        break
      case "image":
        text = await processImageWithOCR(file)
        confidence = 0.85
        break
      case "word":
        text = await processWord(file)
        confidence = 0.98
        break
      case "excel":
        text = await processExcel(file)
        confidence = 0.99
        break
      default:
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const extractedData = await extractStructuredData(text)
    const language = detectLanguage(text)

    const analysis: DocumentAnalysis = {
      text,
      confidence,
      language,
      documentType: fileType,
      extractedData,
      metadata: {
        pages: fileType === "pdf" ? 1 : 1, // Simplified page count to avoid pdf-parse issues
        fileSize: file.size,
        processedAt: new Date(),
      },
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Document processing error:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}

async function processImageWithOCR(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("apikey", process.env.OCR_SPACE_API_KEY || "")
  formData.append("language", "eng")
  formData.append("isOverlayRequired", "false")
  formData.append("detectOrientation", "false")
  formData.append("scale", "true")
  formData.append("OCREngine", "2")

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()

  if (result.ParsedResults && result.ParsedResults[0]) {
    return result.ParsedResults[0].ParsedText || ""
  }

  return ""
}

async function processPDF(file: File): Promise<string> {
  try {
    // Use dynamic import to avoid build-time issues
    const pdfParse = (await import("pdf-parse")).default
    const buffer = await file.arrayBuffer()
    const data = await pdfParse(Buffer.from(buffer))
    return data.text
  } catch (error) {
    console.error("PDF processing error:", error)
    return "PDF processing temporarily unavailable"
  }
}

async function processWord(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth")
    const buffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    return result.value
  } catch (error) {
    console.error("Word processing error:", error)
    return "Word document processing temporarily unavailable"
  }
}

async function processExcel(file: File): Promise<string> {
  try {
    const XLSX = await import("xlsx")
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    let text = ""

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName]
      text += XLSX.utils.sheet_to_txt(sheet) + "\n"
    })

    return text
  } catch (error) {
    console.error("Excel processing error:", error)
    return "Excel processing temporarily unavailable"
  }
}

async function extractStructuredData(text: string): Promise<DocumentAnalysis["extractedData"]> {
  const extractedData: DocumentAnalysis["extractedData"] = {}

  // Extract company name
  const companyMatch = text.match(/(?:company|corporation|corp|inc|ltd)[:\s]+([^\n\r]+)/i)
  if (companyMatch) {
    extractedData.companyName = companyMatch[1].trim()
  }

  // Extract employee count
  const employeeMatch = text.match(/(\d+)\s*(?:employees|staff|workers)/i)
  if (employeeMatch) {
    extractedData.employeeCount = Number.parseInt(employeeMatch[1])
  }

  // Extract budget information
  const budgetMatch = text.match(/(?:budget|cost|expense)[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i)
  if (budgetMatch) {
    extractedData.budget = Number.parseFloat(budgetMatch[1].replace(/,/g, ""))
  }

  // Extract industry
  const industryKeywords = ["technology", "healthcare", "finance", "manufacturing", "retail", "consulting"]
  for (const industry of industryKeywords) {
    if (text.toLowerCase().includes(industry)) {
      extractedData.industry = industry.charAt(0).toUpperCase() + industry.slice(1)
      break
    }
  }

  return extractedData
}

function detectLanguage(text: string): string {
  const languages = {
    en: ["the", "and", "company", "policy", "travel", "employee"],
    es: ["la", "el", "y", "empresa", "política", "viaje", "empleado"],
    fr: ["le", "la", "et", "entreprise", "politique", "voyage", "employé"],
  }

  const words = text.toLowerCase().split(/\s+/).slice(0, 100)
  let maxScore = 0
  let detectedLang = "en"

  Object.entries(languages).forEach(([lang, keywords]) => {
    const score = keywords.reduce((acc, keyword) => acc + words.filter((word) => word.includes(keyword)).length, 0)
    if (score > maxScore) {
      maxScore = score
      detectedLang = lang
    }
  })

  return detectedLang
}

function getFileType(file: File): DocumentAnalysis["documentType"] {
  const mimeType = file.type
  const extension = file.name.split(".").pop()?.toLowerCase()

  if (mimeType.includes("pdf") || extension === "pdf") return "pdf"
  if (mimeType.includes("image") || ["jpg", "jpeg", "png", "gif", "bmp"].includes(extension || "")) return "image"
  if (mimeType.includes("word") || ["doc", "docx"].includes(extension || "")) return "word"
  if (mimeType.includes("sheet") || ["xls", "xlsx", "csv"].includes(extension || "")) return "excel"

  return "unknown"
}
