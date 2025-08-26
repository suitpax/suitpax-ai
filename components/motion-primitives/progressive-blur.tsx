"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import * as React from "react"

export function ProgressiveBlur({ children, start = 0, end = 0.3 }: { children: React.ReactNode; start?: number; end?: number }) {
	const ref = React.useRef<HTMLDivElement | null>(null)
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
	const blur = useTransform(scrollYProgress, [start, end], [8, 0])
	const opacity = useTransform(scrollYProgress, [start, end], [0.6, 1])

	return (
		<motion.div ref={ref} style={{ filter: blur.to((b) => `blur(${b}px)`), opacity }}>
			{children}
		</motion.div>
	)
}