"use client"

import { evaluate } from "@mdx-js/mdx"
import { Suspense, useMemo } from "react"
import * as runtime from "react/jsx-runtime"

interface MDXPreviewProps {
	content: string
}

function MDXContent({ content }: MDXPreviewProps) {
	const mdxContent = useMemo(async () => {
		try {
			const compiled = await evaluate(content, {
				...runtime,
				development: false,
			})
			return <compiled.default />
		} catch (error) {
			console.error("MDX Preview Error:", error)
			return (
				<div className="text-red-500">
					Error rendering MDX preview
				</div>
			)
		}
	}, [content])

	return (
		<div className="prose prose-invert max-w-none">
			{mdxContent}
		</div>
	)
}

export function MDXPreview({ content }: MDXPreviewProps) {
	return (
		<Suspense fallback={<div>Loading preview...</div>}>
			<MDXContent content={content} />
		</Suspense>
	)
}
