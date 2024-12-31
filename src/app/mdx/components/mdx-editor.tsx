"use client"

import { compile } from "@mdx-js/mdx"
import { Editor } from "@monaco-editor/react"
import { format } from "prettier"
import * as prettierPluginBabel from "prettier/plugins/babel"
import * as prettierPluginEstree from "prettier/plugins/estree"
import { Suspense, useCallback, useState } from "react"
import { EditorToolbar } from "./editor-toolbar"
import { MDXPreview } from "./mdx-preview"

interface EditorProps {
	initialValue?: string
}

function LoadingPreview() {
	return (
		<div className="h-full w-full flex items-center justify-center">
			<div className="text-muted-foreground">Loading preview...</div>
		</div>
	)
}

export function MDXEditor({ initialValue = "# Hello World\n\nStart writing your MDX here..." }: EditorProps) {
	const [value, setValue] = useState(initialValue)
	const [error, setError] = useState<string | null>(null)

	const handleEditorChange = useCallback(async (newValue: string | undefined) => {
		if (!newValue) return

		try {
			// Format the MDX content using markdown parser
			const formattedContent = await format(newValue, {
				parser: "markdown",
				plugins: [prettierPluginBabel, prettierPluginEstree],
				proseWrap: "always",
				printWidth: 80,
				tabWidth: 2,
			})

			setValue(formattedContent)
			setError(null)

			// Validate MDX by attempting to compile it
			await compile(formattedContent, {
				outputFormat: "function-body",
				development: false,
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		}
	}, [])

	const handleToolbarAction = useCallback((action: string, value?: string) => {
		const editor = window?.monaco?.editor.getModels()[0]
		if (!editor) return

		const selection = editor.getSelection()
		if (!selection) return

		switch (action) {
			case "insert": {
				if (value) {
					editor.pushEditOperations(
						[],
						[{
							range: selection,
							text: value,
						}],
						() => null
					)
				}
				break
			}
			case "save": {
				const blob = new Blob([editor.getValue()], { type: "text/markdown" })
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url
				a.download = "document.mdx"
				a.click()
				URL.revokeObjectURL(url)
				break
			}
			case "load": {
				if (value) {
					editor.setValue(value)
					handleEditorChange(value)
				}
				break
			}
		}
	}, [handleEditorChange])

	return (
		<div className="flex flex-col h-[calc(100vh-12rem)]">
			<EditorToolbar onAction={handleToolbarAction} />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
				<div className="relative">
					<Editor
						height="100%"
						defaultLanguage="markdown"
						theme="vs-dark"
						value={value}
						onChange={handleEditorChange}
						options={{
							minimap: { enabled: false },
							fontSize: 14,
							lineNumbers: "on",
							wordWrap: "on",
							scrollBeyondLastLine: false,
							automaticLayout: true,
							tabSize: 2,
						}}
					/>
					{error && (
						<div className="absolute bottom-0 left-0 right-0 bg-red-500/10 text-red-500 p-2 text-sm">
							{error}
						</div>
					)}
				</div>
				<div className="bg-zinc-900 rounded-lg p-4 overflow-auto">
					<Suspense fallback={<LoadingPreview />}>
						<MDXPreview content={value} />
					</Suspense>
				</div>
			</div>
		</div>
	)
}
