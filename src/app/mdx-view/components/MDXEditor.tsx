'use client';

import Editor from '@monaco-editor/react';

interface MDXEditorProps {
	value: string;
	onChange: (value: string) => void;
}

const MDXEditor = ({ value, onChange }: MDXEditorProps) => {
	return (
		<Editor
			height="90vh"
			defaultLanguage="markdown"
			value={value}
			onChange={(newValue) => onChange(newValue || '')}
			options={{
				automaticLayout: true,
				wordWrap: 'on',
				formatOnType: true,
				formatOnPaste: true,
			}}
		/>
	);
};

export default MDXEditor;
