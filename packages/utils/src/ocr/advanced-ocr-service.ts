import Tesseract from "tesseract.js"
import sharp from "sharp"
import mammoth from "mammoth"
import * as XLSX from "xlsx"
import pdfParse from "pdf-parse"

export interface DocumentAnalysis {
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

export class AdvancedOCRService {
  private static instance: AdvancedOCRService

  static getInstance(): AdvancedOCRService {
    if (!AdvancedOCRService.instance) {
      AdvancedOCRService.instance = new AdvancedOCRService()
    }
    return AdvancedOCRService.instance
  }

  async processDocument(file: File): Promise<DocumentAnalysis> {
    const fileType = this.getFileType(file)
    let text = ""
    let confidence = 0

    try {
      switch (fileType) {
        case "pdf":
          text = await this.processPDF(file)
          confidence = 0.95
          break
        case "image":
          const result = await this.processImage(file)
          text = result.text
          confidence = result.confidence
          break
        case "word":
          text = await this.processWord(file)
          confidence = 0.98
          break
        case "excel":
          text = await this.processExcel(file)
          confidence = 0.99
          break
        default:
          throw new Error("Unsupported file type")
      }

      const extractedData = await this.extractStructuredData(text)
      const language = await this.detectLanguage(text)

      return {
        text,
        confidence,
        language,
        documentType: fileType,
        extractedData,
        metadata: {
          pages: fileType === "pdf" ? await this.getPDFPageCount(file) : 1,
          fileSize: file.size,
          processedAt: new Date(),
        },
      }
    } catch (error) {
      console.error("Document processing error:", error)
      throw new Error("Failed to process document")
    }
  }

  private async processImage(file: File): Promise<{ text: string; confidence: number }> {
    // Preprocess image for better OCR
    const buffer = await file.arrayBuffer()
    const processedBuffer = await sharp(Buffer.from(buffer))
      .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
      .sharpen()
      .normalize()
      .png()
      .toBuffer()

    const {
      data: { text, confidence },
    } = await Tesseract.recognize(
      processedBuffer,
      "eng+spa+fra+deu", // Multiple languages
      {
        logger: (m) => console.log(m),
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: "1",
      },
    )

    return { text, confidence }
  }

  private async processPDF(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const data = await pdfParse(Buffer.from(buffer))
    return data.text
  }

  private async processWord(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    return result.value
  }

  private async processExcel(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    let text = ""

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName]
      text += XLSX.utils.sheet_to_txt(sheet) + "\n"
    })

    return text
  }

  private async extractStructuredData(text: string): Promise<DocumentAnalysis["extractedData"]> {
    // Use AI to extract structured data
    const response = await fetch("/api/ai/extract-policy-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Failed to extract structured data")
    }

    return response.json()
  }

  private async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on common words
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

  private getFileType(file: File): DocumentAnalysis["documentType"] {
    const mimeType = file.type
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (mimeType.includes("pdf") || extension === "pdf") return "pdf"
    if (mimeType.includes("image") || ["jpg", "jpeg", "png", "gif", "bmp"].includes(extension || "")) return "image"
    if (mimeType.includes("word") || ["doc", "docx"].includes(extension || "")) return "word"
    if (mimeType.includes("sheet") || ["xls", "xlsx", "csv"].includes(extension || "")) return "excel"

    return "unknown"
  }

  private async getPDFPageCount(file: File): Promise<number> {
    try {
      const buffer = await file.arrayBuffer()
      const data = await pdfParse(Buffer.from(buffer))
      return data.numpages
    } catch {
      return 1
    }
  }
}
