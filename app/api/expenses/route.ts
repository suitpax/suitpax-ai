import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { extractTextAuto, extractExpenseEntities } from "@/lib/ocr"
import { handleApiError, createApiError, handleSupabaseError } from "@/lib/api/error-handler"
import { withAuth } from "@/lib/middleware/auth"
import { withRateLimit, rateLimiters } from "@/lib/middleware/rate-limit"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  return withRateLimit(rateLimiters.api)(request, async () => {
    return withAuth(request, async (userId: string) => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("expenses")
          .select(
            "id, title, category, amount, currency, status, expense_date, project_code, vendor, receipt_url, created_at",
          )
          .eq("user_id", userId)
          .order("expense_date", { ascending: false })

        if (error) {
          throw handleSupabaseError(error)
        }

        return NextResponse.json({ success: true, data })
      } catch (error) {
        return handleApiError(error)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(rateLimiters.api)(request, async () => {
    return withAuth(request, async (userId: string) => {
      try {
        const supabase = createClient()
        const contentType = request.headers.get("content-type") || ""
        const isMultipart = contentType.includes("multipart/form-data")

        let payload: any = {}
        let fileBlob: Blob | null = null

        if (isMultipart) {
          const form = await request.formData()
          payload = {
            title: form.get("title")?.toString() || "",
            category: form.get("category")?.toString() || "other",
            amount: form.get("amount") ? Number(form.get("amount") as string) : undefined,
            currency: (form.get("currency")?.toString() || "USD").toUpperCase(),
            expense_date: form.get("expense_date")?.toString(),
            project_code: form.get("project_code")?.toString() || undefined,
            vendor: form.get("vendor")?.toString() || undefined,
            parseOnly: form.get("parseOnly") === "true",
          }
          const maybeFile = form.get("receipt")
          if (maybeFile && maybeFile instanceof Blob) {
            fileBlob = maybeFile
          }
        } else {
          payload = await request.json()
        }

        let ocrResult: any = null
        let text: string | null = null
        if (fileBlob) {
          const arrayBuffer = await fileBlob.arrayBuffer()
          text = await extractTextAuto({
            buffer: Buffer.from(arrayBuffer),
            filename: (fileBlob as any).name,
            mimetype: fileBlob.type,
          })
          const parsed = extractExpenseEntities(text || "")
          ocrResult = parsed
          // Fill missing fields from OCR
          payload.amount = payload.amount ?? parsed.amount
          payload.currency = payload.currency ?? parsed.currency
          payload.expense_date = payload.expense_date ?? parsed.expense_date
          payload.vendor = payload.vendor ?? parsed.vendor
          payload.project_code = payload.project_code ?? parsed.project_code
        }

        if (payload.parseOnly) {
          return NextResponse.json({ success: true, parsed: ocrResult, raw_text: text })
        }

        // Validate required fields
        if (!payload.title) payload.title = payload.vendor || "Expense"
        if (!payload.amount || !payload.expense_date || !payload.category) {
          throw createApiError(
            "MISSING_REQUIRED_FIELD",
            "Amount, expense_date and category are required (provide manually or via receipt OCR)",
            400,
          )
        }

        // Insert into database
        const { data, error } = await supabase
          .from("expenses")
          .insert({
            user_id: userId,
            title: payload.title,
            category: payload.category,
            amount: payload.amount,
            currency: payload.currency || "USD",
            expense_date: payload.expense_date,
            project_code: payload.project_code,
            vendor: payload.vendor,
            status: "pending",
            metadata: ocrResult ? { ocr: ocrResult } : {},
          })
          .select()
          .single()

        if (error) {
          throw handleSupabaseError(error)
        }

        logger.info("Expense created successfully", { expenseId: data.id, userId })

        return NextResponse.json({ success: true, data })
      } catch (error) {
        return handleApiError(error)
      }
    })
  })
}
