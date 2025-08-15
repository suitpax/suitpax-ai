import sharp from "sharp"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import * as XLSX from "xlsx"

interface OCRResult {
  text: string
  confidence: number
  language?: string
  metadata?: any
}

interface DocumentData {
  text: string
  metadata: {
    pages?: number
    author?: string
    title?: string
    subject?: string
    creator?: string
    producer?: string
    creationDate?: Date
    modificationDate?: Date
  }
}

export class EnhancedOCRService {
  private ocrSpaceApiKey: string | undefined

  constructor() {
    this.ocrSpaceApiKey = process.env.OCR_SPACE_API_KEY
  }

  // OCR.space API implementation (simpler and more reliable)
  async extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
    try {
      if (!this.ocrSpaceApiKey) {
        throw new Error("OCR_SPACE_API_KEY not configured")
      }

      // Preprocess image for better OCR results
      const processedImage = await this.preprocessImage(imageBuffer)

      const formData = new FormData()
      formData.append("file", new Blob([new Uint8Array(processedImage)]), "image.png")
      formData.append("apikey", this.ocrSpaceApiKey)
      formData.append("language", "eng")
      formData.append("isOverlayRequired", "false")
      formData.append("detectOrientation", "true")
      formData.append("scale", "true")
      formData.append("OCREngine", "2") // Use OCR Engine 2 for better accuracy

      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage?.[0] || "OCR processing failed")
      }

      const extractedText = result.ParsedResults?.[0]?.ParsedText || ""
      const confidence = result.ParsedResults?.[0]?.TextOverlay?.HasOverlay ? 0.9 : 0.7

      return {
        text: extractedText.trim(),
        confidence,
        language: "en",
        metadata: {
          processingTime: result.ProcessingTimeInMilliseconds,
          ocrExitCode: result.OCRExitCode,
        },
      }
    } catch (error) {
      console.error("OCR.space extraction failed:", error)
      throw error
    }
  }

  async extractStructuredData(
    buffer: Buffer,
    documentType: "invoice" | "receipt" | "passport" | "id" | "policy",
  ): Promise<any> {
    try {
      const ocrResult = await this.extractTextFromImage(buffer)
      return this.parseTextForStructuredData(ocrResult.text, documentType)
    } catch (error) {
      console.error("Structured data extraction failed:", error)
      throw error
    }
  }

  private parseTextForStructuredData(text: string, documentType: string): any {
    const commonPatterns = {
      amount: /(?:total|amount|sum|cost|price)[:\s]*\$?([0-9,]+\.?\d*)/i,
      date: /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/,
      email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
      phone: /(\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{0,4})/,
      companyName: /(?:company|corporation|corp|inc|ltd)[:\s]*([^\n\r]+)/i,
      address: /(?:address|location)[:\s]*([^\n\r]+)/i,
    }

    const typeSpecificPatterns: Record<string, Record<string, RegExp>> = {
      invoice: {
        invoiceNumber: /(?:invoice|inv)[#\s]*([A-Z0-9-]+)/i,
        supplier: /(?:from|supplier|vendor)[:\s]*([^\n\r]+)/i,
        dueDate: /(?:due|payment due)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
      },
      receipt: {
        merchant: /(?:merchant|store|shop)[:\s]*([^\n\r]+)/i,
        category: /(?:category|type)[:\s]*([^\n\r]+)/i,
        tax: /(?:tax|vat)[:\s]*\$?([0-9,]+\.?\d*)/i,
      },
      policy: {
        policyNumber: /(?:policy|pol)[#\s]*([A-Z0-9-]+)/i,
        effectiveDate: /(?:effective|start)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
        expiryDate: /(?:expiry|end|expires)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
        coverage: /(?:coverage|limit)[:\s]*\$?([0-9,]+\.?\d*)/i,
      },
    }

    const extracted: any = { type: documentType }

    // Extract common patterns
    for (const [key, pattern] of Object.entries(commonPatterns)) {
      const match = text.match(pattern)
      if (match) {
        extracted[key] = match[1] || match[0]
      }
    }

    // Extract type-specific patterns
    const specificPatterns = typeSpecificPatterns[documentType] || {}
    for (const [key, pattern] of Object.entries(specificPatterns)) {
      const match = text.match(pattern)
      if (match) {
        extracted[key] = match[1] || match[0]
      }
    }

    if (documentType === "policy") {
      extracted.companySize = this.extractCompanySize(text)
      extracted.industry = this.extractIndustry(text)
      extracted.budget = this.extractBudget(text)
    }

    return extracted
  }

  private extractCompanySize(text: string): string {
    const sizePatterns = [
      { pattern: /(?:employees|staff|team)[:\s]*(\d+)/i, type: "exact" },
      { pattern: /small|startup|boutique/i, size: "small" },
      { pattern: /medium|mid-size/i, size: "medium" },
      { pattern: /large|enterprise|corporation/i, size: "large" },
    ]

    for (const { pattern, size, type } of sizePatterns) {
      const match = text.match(pattern)
      if (match) {
        if (type === "exact") {
          const count = Number.parseInt(match[1])
          if (count < 50) return "small"
          if (count < 250) return "medium"
          return "large"
        }
        return size as string
      }
    }
    return "unknown"
  }

  private extractIndustry(text: string): string {
    const industries = [
      "technology",
      "finance",
      "healthcare",
      "manufacturing",
      "retail",
      "consulting",
      "education",
      "real estate",
      "hospitality",
      "transportation",
    ]

    for (const industry of industries) {
      if (text.toLowerCase().includes(industry)) {
        return industry
      }
    }
    return "general"
  }

  private extractBudget(text: string): string {
    const budgetPattern = /(?:budget|spend|allocation)[:\s]*\$?([0-9,]+)/i
    const match = text.match(budgetPattern)
    if (match) {
      const amount = Number.parseInt(match[1].replace(/,/g, ""))
      if (amount < 10000) return "low"
      if (amount < 50000) return "medium"
      return "high"
    }
    return "unknown"
  }

  async preprocessImage(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(2000, 2000, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .normalize()
        .sharpen()
        .png({ quality: 95 })
        .toBuffer()
    } catch (error) {
      console.error("Image preprocessing failed:", error)
      return buffer
    }
  }

  async extractFromPDF(buffer: Buffer): Promise<DocumentData> {
    try {
      const data = await pdfParse(buffer)
      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          author: data.info?.Author,
          title: data.info?.Title,
          subject: data.info?.Subject,
          creator: data.info?.Creator,
          producer: data.info?.Producer,
          creationDate: data.info?.CreationDate,
          modificationDate: data.info?.ModDate,
        },
      }
    } catch (error) {
      console.error("PDF extraction failed:", error)
      throw error
    }
  }

  async extractFromWord(buffer: Buffer): Promise<DocumentData> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return {
        text: result.value,
        metadata: {
          messages: result.messages,
        },
      }
    } catch (error) {
      console.error("Word extraction failed:", error)
      throw error
    }
  }

  async extractFromExcel(buffer: Buffer): Promise<DocumentData> {
    try {
      const workbook = XLSX.read(buffer, { type: "buffer" })
      let allText = ""

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const csvData = XLSX.utils.sheet_to_csv(worksheet)
        allText += `Sheet: ${sheetName}\n${csvData}\n\n`
      })

      return {
        text: allText,
        metadata: {
          sheets: workbook.SheetNames.length,
          sheetNames: workbook.SheetNames,
        },
      }
    } catch (error) {
      console.error("Excel extraction failed:", error)
      throw error
    }
  }

  async processDocument(buffer: Buffer, mimeType: string): Promise<DocumentData> {
    try {
      switch (mimeType) {
        case "application/pdf":
          return await this.extractFromPDF(buffer)

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          return await this.extractFromWord(buffer)

        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
          return await this.extractFromExcel(buffer)

        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/bmp":
        case "image/tiff":
          const ocrResult = await this.extractTextFromImage(buffer)
          return {
            text: ocrResult.text,
            metadata: {
              confidence: ocrResult.confidence,
              language: ocrResult.language,
            },
          }

        default:
          throw new Error(`Unsupported file type: ${mimeType}`)
      }
    } catch (error) {
      console.error("Document processing failed:", error)
      throw error
    }
  }
}

export const ocrService = new EnhancedOCRService()
