"use client"

import { compile } from "@mdx-js/mdx"
import { Editor, type OnMount } from "@monaco-editor/react"
import type * as Monaco from "monaco-editor"
import { format } from "prettier"
import * as prettierPluginBabel from "prettier/plugins/babel"
import * as prettierPluginEstree from "prettier/plugins/estree"
import { useCallback, useEffect, useRef, useState } from "react"
import { editorConfig, registerMDXLanguage } from "../../lib/monaco-mdx"
import { EditorToolbar } from "../editor-toolbar"
import { MDXPreview } from "../mdx-preview"

interface EditorProps {
	initialValue?: string
}

type MonacoEditor = Parameters<OnMount>[0]

export function EnhancedMDXEditor({
	initialValue = "# Hello World\n\nStart writing your MDX here..."
}: EditorProps) {
	const [value, setValue] = useState(initialValue)
	const [error, setError] = useState<string | null>(null)
	const editorRef = useRef<MonacoEditor | null>(null)
	const monacoRef = useRef<typeof Monaco | null>(null)

	// Register MDX language support
	useEffect(() => {
		registerMDXLanguage()
	}, [])

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		editorRef.current = editor
		monacoRef.current = monaco

		// Add custom keybindings
		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
			handleToolbarAction("save")
		})

		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => {
			// Implement command palette
			const quickOpen = editor.getContribution("editor.controller.quickOpen")
			if (quickOpen && typeof quickOpen.run === "function") {
				quickOpen.run()
			}
		})
	}

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
		if (!editorRef.current) return

		const editor = editorRef.current
		const selection = editor.getSelection()
		if (!selection) return

		switch (action) {
			case "insert": {
				if (value) {
					editor.executeEdits(
						"mdx-editor",
						[{
							range: selection,
							text: value,
							forceMoveMarkers: true
						}]
					)
				}
				break
			}
			case "save": {
				const content = editor.getValue()
				const blob = new Blob([content], { type: "text/markdown" })
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
			case "format": {
				const formatAction = editor.getAction("editor.action.formatDocument")
				if (formatAction) {
					formatAction.run()
				}
				break
			}
			case "find": {
				const findAction = editor.getAction("actions.find")
				if (findAction) {
					findAction.run()
				}
				break
			}
			case "replace": {
				const replaceAction = editor.getAction("editor.action.startFindReplaceAction")
				if (replaceAction) {
					replaceAction.run()
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
						defaultLanguage="mdx"
						theme="vs-dark"
						value={value}
						onChange={handleEditorChange}
						onMount={handleEditorDidMount}
						options={{
							...editorConfig,
							// Additional editor-specific options
							renderWhitespace: "boundary",
							rulers: [80],
							cursorBlinking: "smooth",
							cursorSmoothCaretAnimation: "on",
							smoothScrolling: true,
							dragAndDrop: true,
							linkedEditing: true,
							renderFinalNewline: true,
							renderValidationDecorations: "on",
							snippetSuggestions: "inline",
							suggest: {
								showKeywords: true,
								showSnippets: true,
								showUsers: true,
								showClasses: true,
								showFunctions: true,
								showConstants: true,
								showConstructors: true,
							},
						}}
					/>
					{error && (
						<div className="absolute bottom-0 left-0 right-0 bg-red-500/10 text-red-500 p-2 text-sm">
							{error}
						</div>
					)}
				</div>
				<div className="bg-zinc-900 rounded-lg p-4 overflow-auto">
					<MDXPreview content={value} />
				</div>
			</div>
		</div>
	)
}
