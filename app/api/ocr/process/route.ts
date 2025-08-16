import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const name = file.name || "upload"
    const lower = name.toLowerCase()

    let text = ""
    let documentType: "pdf" | "image" | "word" | "excel" | "unknown" = "unknown"
    let confidence = 0.9

    if (lower.endsWith(".pdf")) {
      documentType = "pdf"
      const pdfParse = (await import("pdf-parse")).default
      const data = await pdfParse(buffer)
      text = data.text || ""
    } else if (/(jpg|jpeg|png|gif|bmp)$/i.test(lower)) {
      documentType = "image"
      const sharp = (await import("sharp")).default
      const processed = await sharp(buffer).resize(2000, 2000, { fit: "inside", withoutEnlargement: true }).sharpen().normalize().png().toBuffer()
      const Tesseract = (await import("tesseract.js")).default
      const { data } = await Tesseract.recognize(processed, "eng+spa")
      text = data.text || ""
      confidence = data.confidence || 0.85
    } else if (/(doc|docx)$/i.test(lower)) {
      documentType = "word"
      const mammoth = (await import("mammoth")).default
      const { value } = await mammoth.extractRawText({ buffer })
      text = value || ""
    } else if (/(xls|xlsx|csv)$/i.test(lower)) {
      documentType = "excel"
      const XLSX = await import("xlsx")
      const wb = XLSX.read(buffer, { type: "buffer" })
      let acc = ""
      wb.SheetNames.forEach((s) => {
        const sheet = wb.Sheets[s]
        acc += XLSX.utils.sheet_to_csv(sheet) + "\n"
      })
      text = acc
    } else {
      documentType = "unknown"
      text = ""
    }

    const extractRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ai/extract-policy-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    const extractedData = extractRes.ok ? await extractRes.json() : {}

    return NextResponse.json({
      text,
      confidence,
      language: "en",
      documentType,
      extractedData,
      metadata: {
        fileSize: buffer.length,
        processedAt: new Date().toISOString(),
      },
    })
  } catch (e) {
    console.error("OCR process error:", e)
    return NextResponse.json({ error: "Failed to process" }, { status: 500 })
  }
}