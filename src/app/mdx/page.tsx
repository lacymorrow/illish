import { Metadata } from "next"
import { MDXEditor } from "./components/mdx-editor"

export const metadata: Metadata = {
	title: "MDX Editor",
	description: "Enterprise-class MDX editor with syntax highlighting and live preview",
}

export default function MDXEditorPage() {
	return (
		<div className="container mx-auto p-4 min-h-screen">
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">MDX Editor</h1>
				</div>
				<MDXEditor />
			</div>
		</div>
	)
}
