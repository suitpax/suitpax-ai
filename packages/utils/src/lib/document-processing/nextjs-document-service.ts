import { FileType } from "file-type"
import * as pdfjsLib from "pdfjs-dist"
import mammoth from "mammoth"
import * as XLSX from "xlsx"
import { Jimp } from "jimp"

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface DocumentAnalysisResult {
  text: string
  metadata: {
    pages?: number
    title?: string
    author?: string
    subject?: string
    creator?: string
    producer?: string
    creationDate?: Date
    modificationDate?: Date
  }
  tables?: Array<{
    headers: string[]
    rows: string[][]
  }>
  images?: Array<{
    data: string
    width: number
    height: number
  }>
  confidence: number
  extractedData: {
    companyName?: string
    employeeCount?: string
    industry?: string
    budget?: string
    travelFrequency?: string
    destinations?: string[]
  }
}

export class NextJSDocumentService {
  private async detectFileType(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer()
      const fileType = await FileType.fromBuffer(buffer)
      return fileType?.mime || file.type
    } catch (error) {
      console.error("Error detecting file type:", error)
      return file.type
    }
  }

  private async preprocessImage(file: File): Promise<Buffer> {
    try {
      const buffer = await file.arrayBuffer()
      const image = await Jimp.read(Buffer.from(buffer))

      // Enhance image for better OCR
      image.greyscale().contrast(0.3).normalize().quality(95)

      return await image.getBufferAsync(Jimp.MIME_PNG)
    } catch (error) {
      console.error("Error preprocessing image:", error)
      return Buffer.from(await file.arrayBuffer())
    }
  }

  private async processPDF(file: File): Promise<DocumentAnalysisResult> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ""
      const images: Array<{ data: string; width: number; height: number }> = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        fullText += pageText + "\n"

        // Extract images from PDF
        const operatorList = await page.getOperatorList()
        // Process images if needed
      }

      const metadata = await pdf.getMetadata()

      return {
        text: fullText,
        metadata: {
          pages: pdf.numPages,
          title: (metadata.info as any)?.Title || undefined,
          author: (metadata.info as any)?.Author || undefined,
          subject: (metadata.info as any)?.Subject || undefined,
          creator: (metadata.info as any)?.Creator || undefined,
          producer: (metadata.info as any)?.Producer || undefined,
          creationDate: (metadata.info as any)?.CreationDate || undefined,
          modificationDate: (metadata.info as any)?.ModDate || undefined,
        },
        images,
        confidence: 0.95,
        extractedData: this.extractCompanyData(fullText),
      }
    } catch (error) {
      console.error("Error processing PDF:", error)
      throw new Error("Failed to process PDF document")
    }
  }

  private async processWord(file: File): Promise<DocumentAnalysisResult> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })

      return {
        text: result.value,
        metadata: {},
        confidence: 0.9,
        extractedData: this.extractCompanyData(result.value),
      }
    } catch (error) {
      console.error("Error processing Word document:", error)
      throw new Error("Failed to process Word document")
    }
  }

  private async processExcel(file: File): Promise<DocumentAnalysisResult> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })

      let fullText = ""
      const tables: Array<{ headers: string[]; rows: string[][] }> = []

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[]
          const rows = jsonData.slice(1) as string[][]

          tables.push({ headers, rows })

          // Convert to text
          const sheetText = jsonData.map((row) => (row as any[]).join(" ")).join("\n")
          fullText += `Sheet: ${sheetName}\n${sheetText}\n\n`
        }
      })

      return {
        text: fullText,
        metadata: {},
        tables,
        confidence: 0.95,
        extractedData: this.extractCompanyData(fullText),
      }
    } catch (error) {
      console.error("Error processing Excel document:", error)
      throw new Error("Failed to process Excel document")
    }
  }

  private async processImage(file: File): Promise<DocumentAnalysisResult> {
    try {
      // Preprocess image for better OCR
      const processedBuffer = await this.preprocessImage(file)

      // Use OCR.space API for text extraction
      const formData = new FormData()
      formData.append("file", new Blob([new Uint8Array(processedBuffer)], { type: "image/png" }))
      formData.append("apikey", process.env.OCR_SPACE_API_KEY || "")
      formData.append("language", "eng")
      formData.append("isOverlayRequired", "false")
      formData.append("detectOrientation", "true")
      formData.append("scale", "true")

      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.IsErroredOnProcessing) {
        throw new Error(result.ErrorMessage || "OCR processing failed")
      }

      const extractedText = result.ParsedResults?.[0]?.ParsedText || ""

      return {
        text: extractedText,
        metadata: {},
        confidence: result.ParsedResults?.[0]?.TextOverlay?.HasOverlay ? 0.9 : 0.7,
        extractedData: this.extractCompanyData(extractedText),
      }
    } catch (error) {
      console.error("Error processing image:", error)
      throw new Error("Failed to process image document")
    }
  }

  private extractCompanyData(text: string): DocumentAnalysisResult["extractedData"] {
    const data: DocumentAnalysisResult["extractedData"] = {}

    // Extract company name (look for common patterns)
    const companyPatterns = [
      /company[:\s]+([^\n\r]+)/i,
      /corporation[:\s]+([^\n\r]+)/i,
      /inc[.\s]+([^\n\r]+)/i,
      /ltd[.\s]+([^\n\r]+)/i,
    ]

    for (const pattern of companyPatterns) {
      const match = text.match(pattern)
      if (match) {
        data.companyName = match[1].trim()
        break
      }
    }

    // Extract employee count
    const employeeMatch = text.match(/(\d+)\s*employees?/i)
    if (employeeMatch) {
      data.employeeCount = employeeMatch[1]
    }

    // Extract industry
    const industryKeywords = ["technology", "healthcare", "finance", "manufacturing", "retail", "consulting"]
    for (const keyword of industryKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        data.industry = keyword
        break
      }
    }

    // Extract budget information
    const budgetMatch = text.match(/budget[:\s]*\$?([\d,]+)/i)
    if (budgetMatch) {
      data.budget = budgetMatch[1]
    }

    // Extract travel frequency
    const travelPatterns = ["monthly", "quarterly", "annually", "weekly"]
    for (const pattern of travelPatterns) {
      if (text.toLowerCase().includes(pattern)) {
        data.travelFrequency = pattern
        break
      }
    }

    // Extract destinations
    const destinations = []
    const cityPattern = /(?:travel to|visit|destination[s]?[:\s]*)([\w\s,]+)/gi
    let match
    while ((match = cityPattern.exec(text)) !== null) {
      const cities = match[1].split(",").map((city) => city.trim())
      destinations.push(...cities)
    }

    if (destinations.length > 0) {
      data.destinations = [...new Set(destinations)].slice(0, 5) // Unique destinations, max 5
    }

    return data
  }

  async analyzeDocument(file: File): Promise<DocumentAnalysisResult> {
    const mimeType = await this.detectFileType(file)

    try {
      switch (mimeType) {
        case "application/pdf":
          return await this.processPDF(file)

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        case "application/msword":
          return await this.processWord(file)

        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
          return await this.processExcel(file)

        case "image/jpeg":
        case "image/png":
        case "image/tiff":
        case "image/bmp":
          return await this.processImage(file)

        default:
          throw new Error(`Unsupported file type: ${mimeType}`)
      }
    } catch (error) {
      console.error("Document analysis failed:", error)
      throw error
    }
  }

  async generatePolicyRecommendations(analysisResult: DocumentAnalysisResult): Promise<{
    recommendedPolicies: Array<{
      type: string
      title: string
      description: string
      rules: string[]
      confidence: number
    }>
    reasoning: string
  }> {
    const { extractedData, text } = analysisResult
    const recommendations = []

    // Analyze company size and recommend appropriate policies
    if (extractedData.employeeCount) {
      const employeeCount = Number.parseInt(extractedData.employeeCount)

      if (employeeCount < 50) {
        recommendations.push({
          type: "small_business",
          title: "Small Business Travel Policy",
          description: "Flexible policy for small teams with cost-conscious approach",
          rules: [
            "Economy class for flights under 4 hours",
            "Mid-range hotels ($150-200/night)",
            "Meal allowance: $50/day",
            "Pre-approval required for expenses over $500",
          ],
          confidence: 0.9,
        })
      } else if (employeeCount < 500) {
        recommendations.push({
          type: "medium_business",
          title: "Medium Enterprise Travel Policy",
          description: "Balanced policy with structured approval process",
          rules: [
            "Business class for flights over 6 hours",
            "Premium hotels ($200-300/night)",
            "Meal allowance: $75/day",
            "Manager approval for expenses over $1000",
          ],
          confidence: 0.85,
        })
      } else {
        recommendations.push({
          type: "enterprise",
          title: "Enterprise Travel Policy",
          description: "Comprehensive policy with multiple tiers and extensive coverage",
          rules: [
            "Business/First class based on seniority",
            "Luxury hotels ($300+/night) for executives",
            "Meal allowance: $100/day",
            "Department head approval for expenses over $2000",
          ],
          confidence: 0.8,
        })
      }
    }

    // Industry-specific recommendations
    if (extractedData.industry) {
      switch (extractedData.industry.toLowerCase()) {
        case "technology":
          recommendations.push({
            type: "tech_focused",
            title: "Technology Industry Policy",
            description: "Tech-forward policy with emphasis on productivity and flexibility",
            rules: [
              "Flexible work arrangements during travel",
              "Premium internet/connectivity allowances",
              "Extended stay discounts for long-term projects",
              "Conference and training travel encouraged",
            ],
            confidence: 0.85,
          })
          break

        case "consulting":
          recommendations.push({
            type: "consulting",
            title: "Consulting Travel Policy",
            description: "High-frequency travel policy with client-focused benefits",
            rules: [
              "Weekly travel allowances",
              "Client site accommodation preferences",
              "Frequent traveler program enrollment",
              "Flexible booking for client changes",
            ],
            confidence: 0.9,
          })
          break
      }
    }

    const reasoning = `Based on the analysis of your document, we identified:
    - Company size: ${extractedData.employeeCount || "Not specified"} employees
    - Industry: ${extractedData.industry || "Not specified"}
    - Budget considerations: ${extractedData.budget || "Not specified"}
    - Travel frequency: ${extractedData.travelFrequency || "Not specified"}
    
    These recommendations are tailored to your organization's specific needs and industry requirements.`

    return {
      recommendedPolicies: recommendations,
      reasoning,
    }
  }
}

export const documentService = new NextJSDocumentService()
