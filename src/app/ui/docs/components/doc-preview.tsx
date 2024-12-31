"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

interface DocPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
	component: string
	library?: string
	previewPath?: string
}

export function DocPreview({ previewPath, component, library = "shadcn", className, ...props }: DocPreviewProps) {
	const [Preview, setPreview] = React.useState<React.ComponentType | null>(null)
	const [error, setError] = React.useState<string | null>(null)

	React.useEffect(() => {
		const loadPreview = async () => {
			try {
				const source = previewPath ?? `@/app/ui/registry/src/components/ui/${library}/${component}.preview`
				if (!source) {
					setError(`No preview available for ${previewPath}`)
					return
				}

				// Construct the import path based on the component name and library
				const module = await import(source).catch((err) => {
					console.warn(`Could not load ${source}`, err)
					return null
				})

				if (!module?.default) {
					setError(`No preview available for ${previewPath}`)
					return
				}

				setPreview(() => module.default)
			} catch (err) {
				console.error(`Failed to load preview for ${previewPath}:`, err)
				setError(`No preview available for ${previewPath}`)
			}
		}

		loadPreview()
	}, [previewPath, component, library])

	return (
		<div className={cn("relative rounded-lg border bg-background", className)} {...props}>
			<div className="p-6">
				{error ? (
					<div className="flex min-h-[350px] items-center justify-center text-sm text-muted-foreground">
						{error}
					</div>
				) : !Preview ? (
					<div className="flex min-h-[350px] items-center justify-center text-sm text-muted-foreground">
						Loading preview...
					</div>
				) : (
					<div className="flex min-h-[350px] items-center justify-center">
						<Preview />
					</div>
				)}
			</div>
		</div>
	)
}
