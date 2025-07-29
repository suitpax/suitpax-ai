import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PDFReportData {
  user: any
  reportData: {
    totalExpenses: number
    totalTrips: number
    avgTripCost: number
    topCategories: { category: string; amount: number; percentage: number }[]
    monthlyTrend: { month: string; amount: number }[]
    recentExpenses: any[]
  }
  period: string
  generatedAt: Date
}

export const generatePDFReport = async (data: PDFReportData) => {
  const doc = new jsPDF()

  // Set up fonts and colors
  const primaryColor = [0, 0, 0] // Black
  const secondaryColor = [107, 114, 128] // Gray-500
  const accentColor = [229, 231, 235] // Gray-200

  // Header
  doc.setFontSize(24)
  doc.setTextColor(...primaryColor)
  doc.text("Reporte de Gastos de Viaje", 20, 30)

  // Subheader
  doc.setFontSize(12)
  doc.setTextColor(...secondaryColor)
  doc.text(`Generado el ${format(data.generatedAt, "PPP", { locale: es })}`, 20, 40)
  doc.text(`Usuario: ${data.user?.full_name || data.user?.email || "N/A"}`, 20, 50)
  doc.text(`Período: ${getPeriodLabel(data.period)}`, 20, 60)

  // Summary section
  let yPosition = 80
  doc.setFontSize(16)
  doc.setTextColor(...primaryColor)
  doc.text("Resumen Ejecutivo", 20, yPosition)

  yPosition += 20
  doc.setFontSize(11)

  // Summary table
  const summaryData = [
    ["Total de Gastos", `€${data.reportData.totalExpenses.toFixed(2)}`],
    ["Total de Viajes", data.reportData.totalTrips.toString()],
    ["Costo Promedio por Viaje", `€${data.reportData.avgTripCost.toFixed(2)}`],
    ["Ahorro Estimado (15%)", `€${(data.reportData.totalExpenses * 0.15).toFixed(2)}`],
  ]

  autoTable(doc, {
    startY: yPosition,
    head: [["Métrica", "Valor"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: accentColor, textColor: primaryColor },
    styles: { fontSize: 10 },
  })

  // Categories section
  yPosition = (doc as any).lastAutoTable.finalY + 20
  doc.setFontSize(16)
  doc.setTextColor(...primaryColor)
  doc.text("Gastos por Categoría", 20, yPosition)

  yPosition += 10
  const categoriesData = data.reportData.topCategories.map((cat) => [
    cat.category,
    `€${cat.amount.toFixed(2)}`,
    `${cat.percentage.toFixed(1)}%`,
  ])

  autoTable(doc, {
    startY: yPosition,
    head: [["Categoría", "Importe", "Porcentaje"]],
    body: categoriesData,
    theme: "grid",
    headStyles: { fillColor: accentColor, textColor: primaryColor },
    styles: { fontSize: 10 },
  })

  // Monthly trend section
  yPosition = (doc as any).lastAutoTable.finalY + 20
  doc.setFontSize(16)
  doc.setTextColor(...primaryColor)
  doc.text("Tendencia Mensual", 20, yPosition)

  yPosition += 10
  const monthlyData = data.reportData.monthlyTrend.map((month) => [month.month, `€${month.amount.toFixed(2)}`])

  autoTable(doc, {
    startY: yPosition,
    head: [["Mes", "Importe"]],
    body: monthlyData,
    theme: "grid",
    headStyles: { fillColor: accentColor, textColor: primaryColor },
    styles: { fontSize: 10 },
  })

  // Recent expenses section (new page if needed)
  if ((doc as any).lastAutoTable.finalY > 200) {
    doc.addPage()
    yPosition = 30
  } else {
    yPosition = (doc as any).lastAutoTable.finalY + 20
  }

  doc.setFontSize(16)
  doc.setTextColor(...primaryColor)
  doc.text("Gastos Recientes", 20, yPosition)

  yPosition += 10
  const expensesData = data.reportData.recentExpenses
    .slice(0, 15)
    .map((expense) => [
      format(new Date(expense.expense_date), "dd/MM/yyyy"),
      expense.title,
      expense.category,
      `€${expense.amount.toFixed(2)}`,
      getStatusLabel(expense.status),
    ])

  autoTable(doc, {
    startY: yPosition,
    head: [["Fecha", "Descripción", "Categoría", "Importe", "Estado"]],
    body: expensesData,
    theme: "grid",
    headStyles: { fillColor: accentColor, textColor: primaryColor },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(...secondaryColor)
    doc.text(
      `Página ${i} de ${pageCount} - Generado por Suitpax`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    )
  }

  // Save the PDF
  const fileName = `reporte-gastos-${format(data.generatedAt, "yyyy-MM-dd")}.pdf`
  doc.save(fileName)
}

const getPeriodLabel = (period: string): string => {
  switch (period) {
    case "last-month":
      return "Último mes"
    case "last-3-months":
      return "Últimos 3 meses"
    case "last-6-months":
      return "Últimos 6 meses"
    case "last-year":
      return "Último año"
    default:
      return "Período personalizado"
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "draft":
      return "Borrador"
    case "submitted":
      return "Enviado"
    case "approved":
      return "Aprobado"
    case "rejected":
      return "Rechazado"
    default:
      return "Desconocido"
  }
}

// LaTeX-style mathematical report generator
export const generateMathematicalReport = async (data: PDFReportData) => {
  const doc = new jsPDF()

  // Mathematical analysis using LaTeX-style formatting
  doc.setFontSize(20)
  doc.text("Análisis Matemático de Gastos", 20, 30)

  doc.setFontSize(12)
  let yPos = 50

  // Mathematical formulas and calculations
  doc.text("Fórmulas de Análisis:", 20, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.text("Costo promedio por viaje: μ = Σ(gastos) / n_viajes", 25, yPos)
  yPos += 10
  doc.text(
    `μ = €${data.reportData.totalExpenses.toFixed(2)} / ${data.reportData.totalTrips} = €${data.reportData.avgTripCost.toFixed(2)}`,
    25,
    yPos,
  )

  yPos += 20
  doc.text("Desviación estándar de gastos:", 25, yPos)
  yPos += 10

  // Calculate standard deviation
  const expenses = data.reportData.recentExpenses.map((e) => e.amount)
  const mean = expenses.reduce((a, b) => a + b, 0) / expenses.length
  const variance = expenses.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / expenses.length
  const stdDev = Math.sqrt(variance)

  doc.text(`σ = √(Σ(x_i - μ)² / n) = €${stdDev.toFixed(2)}`, 25, yPos)

  yPos += 20
  doc.text("Coeficiente de variación:", 25, yPos)
  yPos += 10
  doc.text(`CV = σ/μ = ${((stdDev / mean) * 100).toFixed(2)}%`, 25, yPos)

  // Add statistical analysis table
  yPos += 30
  const statsData = [
    ["Media (μ)", `€${mean.toFixed(2)}`],
    ["Desviación Estándar (σ)", `€${stdDev.toFixed(2)}`],
    ["Coeficiente de Variación", `${((stdDev / mean) * 100).toFixed(2)}%`],
    ["Mediana", `€${getMedian(expenses).toFixed(2)}`],
    ["Rango", `€${(Math.max(...expenses) - Math.min(...expenses)).toFixed(2)}`],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [["Estadística", "Valor"]],
    body: statsData,
    theme: "grid",
  })

  doc.save(`analisis-matematico-${format(data.generatedAt, "yyyy-MM-dd")}.pdf`)
}

const getMedian = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
