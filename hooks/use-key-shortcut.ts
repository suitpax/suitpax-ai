"use client"

import { useEffect } from "react"

type KeyCombo = string // e.g., "mod+k", "shift+enter"

type Options = {
	global?: boolean
	preventDefault?: boolean
}

function normalize(combo: KeyCombo) {
	return combo.trim().toLowerCase()
}

export function useKeyShortcut(combo: KeyCombo, handler: (e: KeyboardEvent) => void, options: Options = {}) {
	useEffect(() => {
		const mapping = normalize(combo)
		function onKey(e: KeyboardEvent) {
			const parts = mapping.split("+")
			const needMod = parts.includes("mod")
			const needCtrl = parts.includes("ctrl")
			const needShift = parts.includes("shift")
			const needAlt = parts.includes("alt")
			const keyPart = parts[parts.length - 1]
			const pressedKey = e.key.toLowerCase()
			const match = (
				(!needMod || e.metaKey || e.ctrlKey) &&
				(!needCtrl || e.ctrlKey) &&
				(!needShift || e.shiftKey) &&
				(!needAlt || e.altKey) &&
				(pressedKey === keyPart)
			)
			if (match) {
				if (options.preventDefault !== false) e.preventDefault()
				handler(e)
			}
		}
		const target: any = options.global !== false ? window : document
		target.addEventListener("keydown", onKey)
		return () => target.removeEventListener("keydown", onKey)
	}, [combo, handler, options.global, options.preventDefault])
}