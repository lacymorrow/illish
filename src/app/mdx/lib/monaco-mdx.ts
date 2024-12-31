import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";

declare global {
	interface Window {
		monaco: typeof monaco;
	}
}

// Define MDX language configuration
export const mdxLanguageConfig: monaco.languages.LanguageConfiguration = {
	comments: {
		blockComment: ["<!--", "-->"],
	},
	brackets: [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["<", ">"],
	],
	autoClosingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: "<", close: ">" },
		{ open: "`", close: "`" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
	],
	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: "`", close: "`" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: "<", close: ">" },
	],
	folding: {
		markers: {
			start: /^\\s*<!--\\s*#?region\\b.*-->/,
			end: /^\\s*<!--\\s*#?endregion\\b.*-->/,
		},
	},
	wordPattern:
		/([*_]{1,2})[^*_]+\1|\[[^\]]+\]\([^)]+\)|(`{1,3})[^`]+\1|[^\s\n`*_<>{}\[\]()]+/,
};

// Define MDX tokens and syntax highlighting rules
export const mdxTokenProvider: monaco.languages.IMonarchLanguage = {
	defaultToken: "",
	tokenPostfix: ".mdx",

	// Control characters
	control: /[\\`*_\[\]{}()#+\-\.!]/,
	noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,

	// Escapes
	escapes: /\\(?:@control)/,

	// JSX
	jsxTag: /</,
	jsxCloseTag: /\/>/,
	jsxTagName: /[a-zA-Z][a-zA-Z0-9\-\.]*/,
	jsxAttrib: /[a-zA-Z][a-zA-Z0-9\-\.]*/,

	// Regular expressions
	tokenizer: {
		root: [
			// JSX
			[/@jsxTag/, { token: "delimiter.bracket", next: "@jsx" }],

			// Headers
			[
				/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/,
				["white", "keyword", "keyword", "keyword"],
			],

			// Code blocks
			[/^\s*```\s*(\S+)?\s*$/, { token: "string", next: "@codeblock" }],

			// Inline code
			[/`[^`]+`/, "string"],

			// Lists
			[/^\s*[\-\*\+]\s+/, "keyword"],
			[/^\s*\d+\.\s+/, "keyword"],

			// Links
			[/\[[^\]]+\]\([^\)]+\)/, "string.link"],

			// Bold
			[/\*\*([^\\*]|@escapes|\*(?!\*))*\*\*/, "strong"],
			[/__([^\_]|@escapes|_(?!_))*__/, "strong"],

			// Italic
			[/\*([^\\*]|@escapes|\*(?!\*))*\*/, "emphasis"],
			[/_([^\_]|@escapes|_(?!_))*_/, "emphasis"],

			// Frontmatter
			[/^---$/, { token: "meta.content", next: "@frontmatter" }],

			// Import/Export statements
			[/^(import|export)(\s+)/, ["keyword", "white"]],
		],

		jsx: [
			[/[a-zA-Z][a-zA-Z0-9\-\.]*/, "tag"],
			[/=/, "delimiter"],
			[/"([^"]*)"/, "string"],
			[/'([^']*)'/, "string"],
			[/\{/, { token: "delimiter.bracket", next: "@jsxEmbeddedExpression" }],
			[/@jsxCloseTag/, { token: "delimiter.bracket", next: "@pop" }],
			[/>/, { token: "delimiter.bracket", next: "@pop" }],
		],

		jsxEmbeddedExpression: [
			[/\{/, { token: "delimiter.bracket", next: "@jsxEmbeddedExpression" }],
			[/\}/, { token: "delimiter.bracket", next: "@pop" }],
			{ include: "@root" },
		],

		codeblock: [
			[/^\\s*```\\s*$/, { token: "string", next: "@pop" }],
			[/.*$/, "variable.source"],
		],

		frontmatter: [
			[/^---$/, { token: "meta.content", next: "@pop" }],
			[/.*$/, "meta.content"],
		],
	},
};

// Define MDX completion items
export const mdxCompletionProvider: monaco.languages.CompletionItemProvider = {
	provideCompletionItems: (model, position) => {
		const wordInfo = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: wordInfo.startColumn,
			endColumn: wordInfo.endColumn,
		};

		const suggestions: monaco.languages.CompletionItem[] = [
			{
				label: "import",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: 'import { $1 } from "$2"',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Import components or utilities",
				range,
			},
			{
				label: "export",
				kind: monaco.languages.CompletionItemKind.Keyword,
				insertText: "export const $1 = $2",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Export components or values",
				range,
			},
			{
				label: "frontmatter",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: [
					"---",
					"title: $1",
					"description: $2",
					"date: ${3:new Date().toISOString()}",
					"---",
					"",
					"$0",
				].join("\n"),
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Add frontmatter to your MDX document",
				range,
			},
			{
				label: "code",
				kind: monaco.languages.CompletionItemKind.Snippet,
				insertText: ["```${1:js}", "$0", "```"].join("\n"),
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
				documentation: "Insert a code block",
				range,
			},
		];

		return { suggestions };
	},
};

// Define editor configuration
export const editorConfig: editor.IStandaloneEditorConstructionOptions = {
	minimap: { enabled: true },
	fontSize: 14,
	lineNumbers: "on",
	wordWrap: "on",
	scrollBeyondLastLine: false,
	automaticLayout: true,
	tabSize: 2,
	theme: "vs-dark",
	formatOnType: true,
	formatOnPaste: true,
	suggestOnTriggerCharacters: true,
	quickSuggestions: {
		other: true,
		comments: true,
		strings: true,
	},
	acceptSuggestionOnCommitCharacter: true,
	wordBasedSuggestions: "currentDocument",
	parameterHints: { enabled: true },
	codeLens: true,
	lightbulb: { enabled: "off" },
	bracketPairColorization: { enabled: true },
	guides: {
		bracketPairs: true,
		indentation: true,
	},
	folding: true,
	showFoldingControls: "always",
	links: true,
	mouseWheelZoom: true,
	multiCursorModifier: "alt",
	renderLineHighlight: "all",
	occurrencesHighlight: "singleFile",
	selectionHighlight: true,
	find: {
		addExtraSpaceOnTop: false,
		autoFindInSelection: "always",
		seedSearchStringFromSelection: "always",
	},
};

// Register MDX language
export function registerMDXLanguage() {
	if (typeof window === "undefined") return;

	// Ensure Monaco is loaded
	if (!window.monaco) {
		console.warn("Monaco editor not loaded");
		return;
	}

	const { languages } = window.monaco;

	// Only register once
	if (
		languages.getLanguages().some((lang: { id: string }) => lang.id === "mdx")
	) {
		return;
	}

	languages.register({ id: "mdx" });
	languages.setLanguageConfiguration("mdx", mdxLanguageConfig);
	languages.setMonarchTokensProvider("mdx", mdxTokenProvider);
	languages.registerCompletionItemProvider("mdx", mdxCompletionProvider);
}
