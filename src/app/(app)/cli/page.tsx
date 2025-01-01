import { SuspenseFallback } from '@/components/primitives/suspense-fallback'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { RegistryBrowser } from './_components/registry-browser'

export const metadata: Metadata = {
	title: 'ShadCN Registry Browser',
	description: 'Browse and install shadcn components',
}

export default function RegistryBrowserPage() {
	return (
		<div className="container py-10">
			<h1 className="text-4xl font-bold mb-8">Bones CLI</h1>
			<p>Install UI components without leaving your browser.</p>
			<Suspense fallback={<SuspenseFallback />}>
				<RegistryBrowser />
			</Suspense>
		</div>
	)
}
