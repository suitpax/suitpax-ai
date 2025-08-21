"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PromptInput, PromptInputActions, PromptInputTextarea, PromptInputAction } from "@/components/prompt-kit/prompt-input"
import { FileUpload, FileUploadContent, FileUploadTrigger } from "@/components/prompt-kit/file-upload"
import { Button } from "@/components/ui/button"
import { Paperclip, ArrowUp, Square } from "lucide-react"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"

export default function SuitpaxAIPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    run()
  }, [supabase])

  const handleFilesAdded = (newFiles: File[]) => setFiles(prev => [...prev, ...newFiles])
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const sendMessage = async () => {
    const input = value.trim()
    if (!input || !userId || isLoading) return
    setIsLoading(true)
    try {
      await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: [] }),
      })
      setValue("")
      setFiles([])
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VantaHaloBackground className="bg-black/5">
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Minimal chat area placeholder for spacing */}
          <div ref={listRef} className="min-h-[30vh]" />

          {/* Single prompt input */}
          <FileUpload onFilesAdded={handleFilesAdded} accept=".jpg,.jpeg,.png,.pdf,.docx">
            <PromptInput
              value={value}
              onValueChange={setValue}
              isLoading={isLoading}
              onSubmit={sendMessage}
              className="w-full max-w-3xl mx-auto border border-input bg-popover rounded-3xl p-0 pt-1 shadow-xs"
            >
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {files.map((file, index) => (
                    <div key={index} className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm" onClick={(e) => e.stopPropagation()}>
                      <Paperclip className="size-4" />
                      <span className="max-w-[160px] truncate">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="hover:bg-secondary/50 rounded-full p-1">
                        <Square className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <PromptInputTextarea
                placeholder="Ask anything"
                className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3]"
              />
              <PromptInputActions className="mt-4 flex w-full items-center justify-end gap-2 px-3 pb-3">
                <PromptInputAction tooltip="Attach files">
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="icon" className="size-9 rounded-full">
                      <Paperclip className="size-4" />
                    </Button>
                  </FileUploadTrigger>
                </PromptInputAction>
                <PromptInputAction tooltip={isLoading ? "Stop" : "Send"}>
                  <Button
                    size="icon"
                    disabled={!value.trim() || isLoading}
                    onClick={sendMessage}
                    className="size-9 rounded-full"
                  >
                    {!isLoading ? (
                      <ArrowUp className="size-4" />
                    ) : (
                      <span className="size-3 rounded-xs bg-white" />
                    )}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
            <FileUploadContent>
              <div className="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
                <div className="bg-background/90 m-4 w-full max-w-md rounded-lg border p-8 shadow-lg">
                  <h3 className="mb-2 text-center text-base font-medium">Drop files to upload</h3>
                  <p className="text-muted-foreground text-center text-sm">Release to add files to your message</p>
                </div>
              </div>
            </FileUploadContent>
          </FileUpload>
        </div>
      </div>
    </VantaHaloBackground>
  )
}
