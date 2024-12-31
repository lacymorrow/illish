import { loader } from "@monaco-editor/react";

// Configure Monaco Editor to use CDN for workers
loader.config({
	paths: {
		vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs",
	},
});

// Configure Monaco Editor options
export const editorOptions = {
	minimap: { enabled: false },
	fontSize: 14,
	lineNumbers: "on",
	wordWrap: "on",
	scrollBeyondLastLine: false,
	automaticLayout: true,
	tabSize: 2,
	theme: "vs-dark",
	formatOnType: true,
	formatOnPaste: true,
};
