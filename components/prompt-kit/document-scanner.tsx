"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function DocumentScanner({ onScanned }: { onScanned: (result: { raw_text?: string } | null) => void }) {
	return (
		<Button type="button" size="sm" variant="outline" onClick={() => onScanned({ raw_text: "" })}>
			Scan
		</Button>
	)
}