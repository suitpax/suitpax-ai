import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractTextAuto, extractExpenseEntities } from '@/lib/ocr'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('expenses')
      .select('id, title, category, amount, currency, status, expense_date, project_code, vendor, receipt_url, created_at')
      .eq('user_id', user.id)
      .order('expense_date', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Expenses GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const contentType = request.headers.get('content-type') || ''
    const isMultipart = contentType.includes('multipart/form-data')

    let payload: any = {}
    let fileBlob: Blob | null = null

    if (isMultipart) {
      const form = await request.formData()
      payload = {
        title: form.get('title')?.toString() || '',
        category: form.get('category')?.toString() || 'other',
        amount: form.get('amount') ? Number(form.get('amount') as string) : undefined,
        currency: (form.get('currency')?.toString() || 'USD').toUpperCase(),
        expense_date: form.get('expense_date')?.toString(),
        project_code: form.get('project_code')?.toString() || undefined,
        vendor: form.get('vendor')?.toString() || undefined,
        parseOnly: form.get('parseOnly') === 'true'
      }
      const maybeFile = form.get('receipt')
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
      text = await extractTextAuto({ buffer: Buffer.from(arrayBuffer), filename: (fileBlob as any).name, mimetype: fileBlob.type })
      const parsed = extractExpenseEntities(text || '')
      ocrResult = parsed
      // Rellenar faltantes
      payload.amount = payload.amount ?? parsed.amount
      payload.currency = payload.currency ?? parsed.currency
      payload.expense_date = payload.expense_date ?? parsed.expense_date
      payload.vendor = payload.vendor ?? parsed.vendor
      payload.project_code = payload.project_code ?? parsed.project_code
    }

    if (payload.parseOnly) {
      return NextResponse.json({ success: true, parsed: ocrResult, raw_text: text })
    }

    // Validaciones mínimas
    if (!payload.title) payload.title = payload.vendor || 'Expense'
    if (!payload.amount || !payload.expense_date || !payload.category) {
      return NextResponse.json({ success: false, error: 'amount, expense_date and category are required (provide manually or via receipt OCR)' }, { status: 400 })
    }

    // Insertar en BD
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title: payload.title,
        category: payload.category,
        amount: payload.amount,
        currency: payload.currency || 'USD',
        expense_date: payload.expense_date,
        project_code: payload.project_code,
        vendor: payload.vendor,
        status: 'pending',
        metadata: ocrResult ? { ocr: ocrResult } : {}
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Expenses POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create expense' }, { status: 500 })
  }
}
