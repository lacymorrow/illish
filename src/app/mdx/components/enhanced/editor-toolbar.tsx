"use client"

import { Button } from "@/components/ui/button"
import {
	Bold,
	Code,
	FileDown,
	FileUp,
	Heading,
	Italic,
	Link as LinkIcon,
	List,
	Search,
	Settings,
	Type,
} from "lucide-react"

interface ToolbarProps {
	onAction: (action: string, value?: string) => void
}

const SNIPPETS = {
	bold: "**bold**",
	italic: "*italic*",
	list: "- List item\n- Another item",
	heading: "# Heading",
	link: "[Link text](url)",
	code: "```js\nconsole.log('hello')\n```",
	frontmatter: [
		"---",
		"title: Title",
		"description: Description",
		"date: " + new Date().toISOString(),
		"---",
		"",
	].join("\n"),
} as const

export function EnhancedEditorToolbar({ onAction }: ToolbarProps) {
	const handleSave = () => onAction("save")
	const handleLoad = () => {
		const input = document.createElement("input")
		input.type = "file"
		input.accept = ".mdx,.md"
		input.onchange = (e: Event) => {
			const target = e.target as HTMLInputElement
			const file = target.files?.[0]
			if (file) {
				const reader = new FileReader()
				reader.onload = (e: ProgressEvent<FileReader>) => {
					const content = e.target?.result
					if (typeof content === "string") {
						onAction("load", content)
					}
				}
				reader.readAsText(file)
			}
		}
		input.click()
	}

	return (
		<div className="flex items-center gap-1 bg-zinc-900 p-2 rounded-t-lg border-b border-zinc-800">
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.bold)}
					title="Bold (Ctrl+B)"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.italic)}
					title="Italic (Ctrl+I)"
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.list)}
					title="List"
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.heading)}
					title="Heading"
				>
					<Heading className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.link)}
					title="Link"
				>
					<LinkIcon className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.code)}
					title="Code Block"
				>
					<Code className="h-4 w-4" />
				</Button>
			</div>

			<div className="h-4 w-px bg-zinc-800 mx-2" />

			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("insert", SNIPPETS.frontmatter)}
					title="Add Frontmatter"
				>
					<Type className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("format")}
					title="Format Document"
				>
					<Settings className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onAction("find")}
					title="Find (Ctrl+F)"
				>
					<Search className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex-1" />

			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleLoad}
					title="Load File"
				>
					<FileUp className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={handleSave}
					title="Save File (Ctrl+S)"
				>
					<FileDown className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
