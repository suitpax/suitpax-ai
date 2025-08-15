"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AnalysisResult {
  companyName?: string
  employeeCount?: number
  industry?: string
  recommendedPolicyType?: string
  reasoning?: string
  confidence?: number
}

export default function IntelligentDocumentAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    setError(null)
    setAnalysisResult(null)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ai/extract-policy-data", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      setAnalysisResult(result.extractedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  })

  const getPolicyTypeColor = (type?: string) => {
    switch (type) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Intelligent Document Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
            ${isAnalyzing ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isAnalyzing ? (
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isAnalyzing ? "Analyzing document..." : "Upload company document"}
              </p>
              <p className="text-sm text-gray-500 mt-1">PDF, Word, Excel, or image files supported</p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span>Processing document...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    {analysisResult.companyName && (
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <span className="ml-2 font-medium">{analysisResult.companyName}</span>
                      </div>
                    )}
                    {analysisResult.employeeCount && (
                      <div>
                        <span className="text-gray-500">Employees:</span>
                        <span className="ml-2 font-medium">{analysisResult.employeeCount}</span>
                      </div>
                    )}
                    {analysisResult.industry && (
                      <div>
                        <span className="text-gray-500">Industry:</span>
                        <span className="ml-2 font-medium capitalize">{analysisResult.industry}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recommendation</h4>
                  <div className="space-y-2">
                    {analysisResult.recommendedPolicyType && (
                      <Badge className={getPolicyTypeColor(analysisResult.recommendedPolicyType)}>
                        {analysisResult.recommendedPolicyType.toUpperCase()} Policy
                      </Badge>
                    )}
                    {analysisResult.confidence && (
                      <div className="text-sm text-gray-500">Confidence: {Math.round(analysisResult.confidence)}%</div>
                    )}
                  </div>
                </div>
              </div>

              {analysisResult.reasoning && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">AI Reasoning</h4>
                  <p className="text-sm text-blue-800">{analysisResult.reasoning}</p>
                </div>
              )}

              <Button className="w-full" size="lg">
                Generate Custom Policy
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
