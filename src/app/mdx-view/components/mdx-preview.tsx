'use client';

import { compile } from '@mdx-js/mdx';
import { MDXContentProps } from 'mdx/types';
import { useEffect, useState } from 'react';

interface MDXPreviewProps {
	source: string;
}

export const MDXPreview = ({ source }: MDXPreviewProps) => {
	const [Content, setContent] = useState<React.ComponentType<MDXContentProps> | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const renderMDX = async () => {
			try {
				const compiled = await compile(source, {
					outputFormat: 'function-body',
					useDynamicImport: false,
				});
				const { default: MDXContent } = await import(
					/* webpackIgnore: true */
					'data:text/javascript;charset=utf-8,' + encodeURIComponent(String(compiled))
				);

				if (!cancelled) {
					setContent(() => MDXContent);
					setError(null);
				}
			} catch (err: any) {
				if (!cancelled) {
					setError(err.message);
					setContent(null);
				}
			}
		};

		renderMDX();

		return () => {
			cancelled = true;
		};
	}, [source]);

	if (error) {
		return (
			<pre style={{ color: 'red' }}>
				{error}
			</pre>
		);
	}

	if (!Content) {
		return <p>Loading...</p>;
	}

	return <Content />;
};
