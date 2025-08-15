import { fileTypeFromBuffer } from "file-type"
import * as pdfjsLib from "pdfjs-dist"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import * as XLSX from "xlsx"
import { Jimp } from "jimp"

export class ComprehensiveDocumentService {
  private static instance: ComprehensiveDocumentService

  static getInstance(): ComprehensiveDocumentService {
    if (!ComprehensiveDocumentService.instance) {
      ComprehensiveDocumentService.instance = new ComprehensiveDocumentService()
    }
    return ComprehensiveDocumentService.instance
  }

  async processDocument(file: File): Promise<{
    type: string
    content: string
    metadata: any
    extractedData: any
  }> {
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Detect file type
    const fileType = await fileTypeFromBuffer(uint8Array)
    const detectedType = fileType?.mime || file.type

    switch (detectedType) {
      case "application/pdf":
        return await this.processPDF(uint8Array)
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return await this.processWord(uint8Array)
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.ms-excel":
        return await this.processExcel(uint8Array)
      case "image/jpeg":
      case "image/png":
      case "image/webp":
        return await this.processImage(uint8Array, detectedType)
      default:
        throw new Error(`Unsupported file type: ${detectedType}`)
    }
  }

  private async processPDF(buffer: Uint8Array): Promise<any> {
    try {
      // Method 1: Using pdf-parse for text extraction
      const pdfData = await pdfParse(buffer)

      // Method 2: Using pdfjs-dist for advanced processing
      const loadingTask = pdfjsLib.getDocument({ data: buffer })
      const pdf = await loadingTask.promise

      let fullText = ""
      const pages = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")

        pages.push({
          pageNumber: i,
          text: pageText,
          viewport: page.getViewport({ scale: 1.0 }),
        })
        fullText += pageText + "\n"
      }

      // Extract structured data using AI patterns
      const extractedData = this.extractStructuredData(fullText)

      return {
        type: "pdf",
        content: fullText,
        metadata: {
          pages: pdf.numPages,
          title: pdfData.info?.Title,
          author: pdfData.info?.Author,
          creator: pdfData.info?.Creator,
          producer: pdfData.info?.Producer,
          creationDate: pdfData.info?.CreationDate,
          modificationDate: pdfData.info?.ModDate,
        },
        extractedData,
        pages,
      }
    } catch (error) {
      console.error("PDF processing error:", error)
      throw new Error("Failed to process PDF document")
    }
  }

  private async processWord(buffer: Uint8Array): Promise<any> {
    try {
      const result = await mammoth.extractRawText({ buffer })
      const htmlResult = await mammoth.convertToHtml({ buffer })

      const extractedData = this.extractStructuredData(result.value)

      return {
        type: "word",
        content: result.value,
        metadata: {
          html: htmlResult.value,
          messages: result.messages,
          warnings: htmlResult.messages,
        },
        extractedData,
      }
    } catch (error) {
      console.error("Word processing error:", error)
      throw new Error("Failed to process Word document")
    }
  }

  private async processExcel(buffer: Uint8Array): Promise<any> {
    try {
      const workbook = XLSX.read(buffer, { type: "array" })
      const sheets: any = {}
      let allText = ""

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        const csvData = XLSX.utils.sheet_to_csv(worksheet)

        sheets[sheetName] = {
          json: jsonData,
          csv: csvData,
        }
        allText += csvData + "\n"
      })

      const extractedData = this.extractStructuredData(allText)

      return {
        type: "excel",
        content: allText,
        metadata: {
          sheetNames: workbook.SheetNames,
          sheets,
        },
        extractedData,
      }
    } catch (error) {
      console.error("Excel processing error:", error)
      throw new Error("Failed to process Excel document")
    }
  }

  private async processImage(buffer: Uint8Array, mimeType: string): Promise<any> {
    try {
      // Process image with Jimp for enhancement
      const image = await Jimp.read(Buffer.from(buffer))

      // Enhance image for better OCR
      const enhancedImage = image.greyscale().contrast(0.3).normalize()

      const enhancedBuffer = await enhancedImage.getBufferAsync(Jimp.MIME_PNG)

      // OCR processing would go here (using Google Vision or OCR.space)
      const ocrText = await this.performOCR(enhancedBuffer)
      const extractedData = this.extractStructuredData(ocrText)

      return {
        type: "image",
        content: ocrText,
        metadata: {
          width: image.getWidth(),
          height: image.getHeight(),
          mimeType,
          enhanced: true,
        },
        extractedData,
      }
    } catch (error) {
      console.error("Image processing error:", error)
      throw new Error("Failed to process image")
    }
  }

  private async performOCR(buffer: Buffer): Promise<string> {
    // This would integrate with Google Vision API or OCR.space
    // For now, return placeholder
    return "OCR text extraction would be implemented here"
  }

  private extractStructuredData(text: string): any {
    // Extract common business document patterns
    const patterns = {
      emails: text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [],
      phones: text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g) || [],
      dates: text.match(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g) || [],
      amounts: text.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g) || [],
      companies: this.extractCompanyNames(text),
      addresses: this.extractAddresses(text),
    }

    return patterns
  }

  private extractCompanyNames(text: string): string[] {
    // Simple company name extraction (would be enhanced with NLP)
    const companyPatterns = [
      /\b[A-Z][a-z]+ (?:Inc|LLC|Corp|Corporation|Company|Co)\b/g,
      /\b[A-Z][a-z]+ & [A-Z][a-z]+\b/g,
    ]

    const companies: string[] = []
    companyPatterns.forEach((pattern) => {
      const matches = text.match(pattern) || []
      companies.push(...matches)
    })

    return [...new Set(companies)]
  }

  private extractAddresses(text: string): string[] {
    // Simple address extraction
    const addressPattern =
      /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)\b/g
    return text.match(addressPattern) || []
  }

  async createPolicyRecommendation(extractedData: any): Promise<{
    recommendedPolicy: string
    confidence: number
    reasoning: string[]
  }> {
    // Analyze extracted data to recommend travel policies
    const reasoning: string[] = []
    let confidence = 0.7

    // Company size analysis
    if (extractedData.amounts && extractedData.amounts.length > 0) {
      const amounts = extractedData.amounts.map((a: string) => Number.parseFloat(a.replace(/[$,]/g, "")))
      const maxAmount = Math.max(...amounts)

      if (maxAmount > 1000000) {
        reasoning.push("Large budget detected - Enterprise policy recommended")
        confidence += 0.1
      } else if (maxAmount > 100000) {
        reasoning.push("Medium budget detected - Business policy recommended")
        confidence += 0.05
      }
    }

    // Industry analysis based on company names
    if (extractedData.companies && extractedData.companies.length > 0) {
      reasoning.push(`${extractedData.companies.length} companies identified`)
      confidence += 0.1
    }

    const recommendedPolicy = confidence > 0.8 ? "Enterprise" : confidence > 0.6 ? "Business" : "Standard"

    return {
      recommendedPolicy,
      confidence: Math.min(confidence, 1.0),
      reasoning,
    }
  }
}

export const documentService = ComprehensiveDocumentService.getInstance()
