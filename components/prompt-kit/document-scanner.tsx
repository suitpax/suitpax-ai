"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function DocumentScanner({ onScanned }: { onScanned: (result: { raw_text?: string }) => void }) {
	const inputRef = useRef<HTMLInputElement>(null)
	return (
		<>
			<input ref={inputRef} type="file" accept=".txt,.md,.json,.pdf,.docx,.png,.jpg,.jpeg" className="hidden" onChange={async (e) => {
				const f = e.target.files?.[0]
				if (!f) return
				try {
					// Minimal placeholder: read as text when possible
					if (f.type.startsWith("text/") || f.type === "application/json") {
						const txt = await f.text()
						onScanned({ raw_text: txt.slice(0, 10000) })
					} else {
						onScanned({ raw_text: `Attached file: ${f.name} (${f.type || "unknown"})` })
					}
				} catch {
					onScanned({ raw_text: `Attached file: ${f.name}` })
				}
			}} />
			<Button type="button" variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-2xl" onClick={() => inputRef.current?.click()}>
				<FileText className="h-4 w-4" />
			</Button>
		</>
	)
}