'use client';

import { useState } from 'react';
import { MDXPreview } from '../mdx/components/mdx-preview';
import MDXEditor from './components/MDXEditor';


export default function MDXViewPage() {
	const [value, setValue] = useState<string>(
		'# Welcome to the MDX Editor\n\nStart typing your MDX content here...'
	);

	return (
		<div style={{ display: 'flex', height: '100vh' }}>
			<div style={{ width: '50%' }}>
				<MDXEditor value={value} onChange={setValue} />
			</div>
			<div style={{ width: '50%', padding: '1rem', overflow: 'auto' }}>
				<MDXPreview content={value} />
			</div>
		</div>
	);
}
