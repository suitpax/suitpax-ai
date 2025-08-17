"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import BaggageSelectionCard from "./BaggageSelectionCard"

interface BaggageSelectionModalProps {
	open: boolean
	onClose: () => void
	options: Array<{ code: string; title: string; description?: string; amount: number; currency: string }>
	selection: Record<string, number>
	onChange: (next: Record<string, number>) => void
}

export default function BaggageSelectionModal({ open, onClose, options, selection, onChange }: BaggageSelectionModalProps) {
	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div className="fixed inset-0 bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
					<motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
						<div className="bg-white rounded-2xl border border-gray-200 shadow-soft w-full max-w-2xl p-4">
							<div className="flex items-center justify-between mb-3">
								<div className="text-base font-medium text-gray-900">Select baggage</div>
								<button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
							</div>
							<BaggageSelectionCard options={options} passengers={[]} selection={selection} onChange={onChange} />
							<div className="mt-3 flex items-center justify-end gap-2">
								<button onClick={onClose} className="rounded-2xl border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm">Close</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}