"use client"

import Link from "next/link"

type LinkMarkdownProps = React.ComponentProps<typeof Link> & {
	href: string
	children: React.ReactNode
}

export function LinkMarkdown({ href, children, ...props }: LinkMarkdownProps) {
	const isExternal = /^https?:\/\//i.test(href)
	if (isExternal) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">
				{children}
			</a>
		)
	}
	return (
		<Link href={href} {...props} className="underline underline-offset-2">
			{children}
		</Link>
	)
}