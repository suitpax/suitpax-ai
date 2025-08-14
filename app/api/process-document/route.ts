export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

function estimateEmployeeCount(text: string, companySize?: string): number {
	const m = text.match(/(?:employees|empleados|staff|team)\D+(\d{1,6})/i)
	if (m) return Math.max(1, Math.min(100000, parseInt(m[1] || "0", 10)))
	if (!companySize) return 100
	const size = companySize.toLowerCase()
	if (size.includes("startup") || size.includes("small")) return 25
	if (size.includes("sme") || size.includes("medium")) return 150
	if (size.includes("enterprise") || size.includes("large")) return 1000
	return 100
}

function extractPolicies(text: string): string[] {
	const lines = text
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean)
	const picks: string[] = []
	for (const line of lines) {
		if (/policy|política|rule|regla|compliance/i.test(line)) {
			picks.push(line.slice(0, 140))
			if (picks.length >= 6) break
		}
	}
	return picks
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData()
		const file = formData.get("file") as File | null
		if (!file) {
			return NextResponse.json({ error: "Missing file" }, { status: 400 })
		}

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		const mime = file.type || "application/octet-stream"

		// Dynamically import heavy OCR service at runtime to avoid build-time side effects
		const { ocrService } = await import("@/lib/ocr/enhanced-ocr-service")
		const processed = await ocrService.processDocument(buffer, mime)
		let structured: any = {}
		try {
			structured = await ocrService.extractStructuredData(buffer, "policy")
		} catch (err) {
			structured = {}
		}

		const text = (processed?.text || "").trim()
		const companySize = structured?.companySize
		const industry = structured?.industry || "general"
		const budgetLevel = structured?.budget || "unknown"

		let budget = 300
		if (typeof budgetLevel === "number") {
			budget = budgetLevel
		} else {
			const level = String(budgetLevel).toLowerCase()
			if (level === "low") budget = 150
			else if (level === "medium") budget = 300
			else if (level === "high") budget = 600
		}

		const employeeCount = estimateEmployeeCount(text, companySize)
		const policies = extractPolicies(text)

		return NextResponse.json({
			text,
			confidence: processed?.metadata?.confidence ?? 0.9,
			extractedData: {
				employeeCount,
				industry,
				budget,
				policies,
			},
		})
	} catch (error: any) {
		console.error("/api/process-document error:", error)
		return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
	}
}
