"use client"

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Link,
  ImageIcon,
  Save,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useCallback } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type EditorMode = "minimal" | "standard" | "advanced" | "full"

interface AdvancedEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  mode?: EditorMode
  editable?: boolean
  showWordCount?: boolean
  showCharacterCount?: boolean
  maxLength?: number
  onSave?: (content: string) => void
  onExport?: (content: string, format: "html" | "json" | "text") => void
  autoSave?: boolean
  autoSaveInterval?: number
}

const toolbarConfigs = {
  minimal: ["bold", "italic", "undo", "redo"],
  standard: ["bold", "italic", "underline", "bulletList", "orderedList", "blockquote", "undo", "redo"],
  advanced: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "code",
    "heading1",
    "heading2",
    "heading3",
    "bulletList",
    "orderedList",
    "blockquote",
    "link",
    "image",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "undo",
    "redo",
  ],
  full: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "code",
    "heading1",
    "heading2",
    "heading3",
    "bulletList",
    "orderedList",
    "blockquote",
    "link",
    "image",
    "table",
    "alignLeft",
    "alignCenter",
    "alignRight",
    "textColor",
    "backgroundColor",
    "save",
    "export",
    "fullscreen",
    "undo",
    "redo",
  ],
}

export default function AdvancedEditor({
  content = "",
  onChange,
  placeholder = "Start writing something amazing...",
  className,
  mode = "standard",
  editable = true,
  showWordCount = false,
  showCharacterCount = false,
  maxLength,
  onSave,
  onExport,
  autoSave = false,
  autoSaveInterval = 30000,
}: AdvancedEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)

      if (autoSave && onSave) {
        // Debounced auto-save logic would go here
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none p-4",
          mode === "minimal" ? "min-h-[80px]" : "min-h-[200px]",
          maxLength && "max-length-indicator",
        ),
      },
    },
  })

  const activeTools = toolbarConfigs[mode]

  const handleSave = useCallback(() => {
    if (editor && onSave) {
      onSave(editor.getHTML())
    }
  }, [editor, onSave])

  const handleExport = useCallback(
    (format: "html" | "json" | "text") => {
      if (editor && onExport) {
        let content: string
        switch (format) {
          case "html":
            content = editor.getHTML()
            break
          case "json":
            content = JSON.stringify(editor.getJSON(), null, 2)
            break
          case "text":
            content = editor.getText()
            break
          default:
            content = editor.getHTML()
        }
        onExport(content, format)
      }
    },
    [editor, onExport],
  )

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return (
      <div className={cn("border border-gray-200 rounded-2xl bg-white animate-pulse", className)}>
        <div className="h-12 bg-gray-100 rounded-t-2xl" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    )
  }

  const wordCount = editor.storage.characterCount?.words() || 0
  const characterCount = editor.storage.characterCount?.characters() || 0

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-2xl bg-white transition-all duration-200",
        isFullscreen && "fixed inset-4 z-50 rounded-3xl shadow-2xl",
        className,
      )}
    >
      {/* Floating Menu for empty lines */}
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 px-2 text-xs rounded-lg hover:bg-gray-100"
          >
            H1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 px-2 text-xs rounded-lg hover:bg-gray-100"
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </FloatingMenu>

      {/* Bubble Menu for text selection */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 bg-black text-white rounded-xl p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0 rounded-lg text-white hover:bg-gray-800",
              editor.isActive("bold") && "bg-gray-700",
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0 rounded-lg text-white hover:bg-gray-800",
              editor.isActive("italic") && "bg-gray-700",
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(true)}
            className="h-8 w-8 p-0 rounded-lg text-white hover:bg-gray-800"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </BubbleMenu>

      {/* Main Toolbar */}
      {editable && (
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Text Formatting */}
            {activeTools.includes("bold") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8 p-0 rounded-xl", editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100")}
              >
                <Bold className="h-4 w-4" />
              </Button>
            )}

            {activeTools.includes("italic") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  "h-8 w-8 p-0 rounded-xl",
                  editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100",
                )}
              >
                <Italic className="h-4 w-4" />
              </Button>
            )}

            {activeTools.includes("underline") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline?.().run()}
                className={cn(
                  "h-8 w-8 p-0 rounded-xl",
                  editor.isActive("underline") ? "bg-gray-200" : "hover:bg-gray-100",
                )}
              >
                <Underline className="h-4 w-4" />
              </Button>
            )}

            {activeTools.includes("strikethrough") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(
                  "h-8 w-8 p-0 rounded-xl",
                  editor.isActive("strike") ? "bg-gray-200" : "hover:bg-gray-100",
                )}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            )}

            {activeTools.includes("code") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={cn("h-8 w-8 p-0 rounded-xl", editor.isActive("code") ? "bg-gray-200" : "hover:bg-gray-100")}
              >
                <Code className="h-4 w-4" />
              </Button>
            )}

            {/* Headings */}
            {(activeTools.includes("heading1") ||
              activeTools.includes("heading2") ||
              activeTools.includes("heading3")) && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {activeTools.includes("heading1") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl text-xs font-medium",
                      editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    H1
                  </Button>
                )}

                {activeTools.includes("heading2") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl text-xs font-medium",
                      editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    H2
                  </Button>
                )}

                {activeTools.includes("heading3") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl text-xs font-medium",
                      editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    H3
                  </Button>
                )}
              </>
            )}

            {/* Lists and Quotes */}
            {(activeTools.includes("bulletList") ||
              activeTools.includes("orderedList") ||
              activeTools.includes("blockquote")) && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {activeTools.includes("bulletList") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl",
                      editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                )}

                {activeTools.includes("orderedList") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl",
                      editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                )}

                {activeTools.includes("blockquote") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl",
                      editor.isActive("blockquote") ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}

            {/* Media and Links */}
            {(activeTools.includes("link") || activeTools.includes("image")) && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {activeTools.includes("link") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLinkInput(true)}
                    className={cn(
                      "h-8 w-8 p-0 rounded-xl",
                      editor.isActive("link") ? "bg-gray-200" : "hover:bg-gray-100",
                    )}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                )}

                {activeTools.includes("image") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}

            {/* Actions */}
            {(activeTools.includes("save") || activeTools.includes("export") || activeTools.includes("fullscreen")) && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {activeTools.includes("save") && onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}

                {activeTools.includes("export") && onExport && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport("html")}>Export as HTML</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("text")}>Export as Text</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {activeTools.includes("fullscreen") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                )}
              </>
            )}

            {/* History */}
            {(activeTools.includes("undo") || activeTools.includes("redo")) && (
              <>
                <div className="w-px h-6 bg-gray-200 mx-1" />

                {activeTools.includes("undo") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                )}

                {activeTools.includes("redo") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Link Input */}
          {showLinkInput && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2">
                <Label htmlFor="link-url" className="text-sm font-medium">
                  URL:
                </Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setLink()
                    } else if (e.key === "Escape") {
                      setShowLinkInput(false)
                      setLinkUrl("")
                    }
                  }}
                />
                <Button size="sm" onClick={setLink} disabled={!linkUrl}>
                  Add Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowLinkInput(false)
                    setLinkUrl("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={cn("prose prose-sm max-w-none", !editable && "p-4", isFullscreen && "flex-1 overflow-auto")}
      />

      {/* Footer with stats */}
      {(showWordCount || showCharacterCount || maxLength) && (
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {showWordCount && <span>{wordCount} words</span>}
              {showCharacterCount && <span>{characterCount} characters</span>}
            </div>
            {maxLength && (
              <div className={cn("flex items-center gap-1", characterCount > maxLength && "text-red-500")}>
                <span>
                  {characterCount}/{maxLength}
                </span>
                {characterCount > maxLength && <span className="text-red-500">• Limit exceeded</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
</merged_code>
