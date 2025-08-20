"use client"

import * as React from "react"

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFilesSelected?: (files: File[]) => void
  className?: string
}

export function FileUpload({ accept, multiple = true, disabled, onFilesSelected, className }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<File[]>([])

  const openPicker = () => inputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...selected])
    onFilesSelected?.(selected)
  }

  const removeAt = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx))
  const clear = () => setFiles([])

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Attach files
        </button>
        {files.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
          >
            Clear
          </button>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-xs">
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload

