"use client"

import { useState, useCallback } from "react"

interface FileUploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  multiple?: boolean
}

interface UploadedFile {
  file: File
  id: string
  name: string
  size: number
  type: string
  url: string
  content?: string
}

interface FileUploadResult {
  files: UploadedFile[]
  isUploading: boolean
  error: string | null
  uploadFiles: (files: FileList | File[]) => Promise<void>
  removeFile: (id: string) => void
  clearFiles: () => void
}

export function useFileUpload(options: FileUploadOptions = {}): FileUploadResult {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    multiple = true,
  } = options

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `El archivo ${file.name} es demasiado grande. Máximo ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido: ${file.type}`
    }

    return null
  }

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") {
          resolve(result)
        } else {
          resolve("")
        }
      }

      reader.onerror = () => reject(new Error("Error reading file"))

      if (file.type.startsWith("text/")) {
        reader.readAsText(file)
      } else if (file.type === "application/pdf") {
        reader.readAsDataURL(file)
      } else if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    })
  }

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setIsUploading(true)
      setError(null)

      try {
        const filesToProcess = Array.from(fileList)

        if (!multiple && filesToProcess.length > 1) {
          throw new Error("Solo se permite un archivo")
        }

        const newFiles: UploadedFile[] = []

        for (const file of filesToProcess) {
          const validationError = validateFile(file)
          if (validationError) {
            throw new Error(validationError)
          }

          try {
            const content = await readFileContent(file)
            const uploadedFile: UploadedFile = {
              file,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
              content: file.type.startsWith("text/") ? content : undefined,
            }

            newFiles.push(uploadedFile)
          } catch (readError) {
            console.warn(`Error reading file ${file.name}:`, readError)
            // Still add the file even if we can't read its content
            const uploadedFile: UploadedFile = {
              file,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
            }

            newFiles.push(uploadedFile)
          }
        }

        setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error uploading files")
      } finally {
        setIsUploading(false)
      }
    },
    [maxSize, allowedTypes, multiple],
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const clearFiles = useCallback(() => {
    files.forEach((file) => URL.revokeObjectURL(file.url))
    setFiles([])
    setError(null)
  }, [files])

  return {
    files,
    isUploading,
    error,
    uploadFiles,
    removeFile,
    clearFiles,
  }
}
