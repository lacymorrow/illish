import { SuspenseFallback } from "@/components/primitives/suspense-fallback";
import { getDocFromParams } from "@/lib/docs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
	params: Promise<{
		slug: string[]
	}>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const defaultMetadata = {
		title: "Documentation - ShipKit",
		description: "ShipKit Documentation",
	};

	try {
		const doc = await getDocFromParams(params);

		return {
			...defaultMetadata,
			title: `${doc.title} - ShipKit Documentation`,
			description: doc.description ?? "ShipKit Documentation",
		};
	} catch (error) {
		return defaultMetadata;
	}
}

export default async function DocsPage({ params }: PageProps) {
	const doc = await getDocFromParams(params);
	const Content = doc.content;

	if (!Content) {
		notFound();
	}

	return (
		<article className="docs-content">
			<header className="mb-8 space-y-2">
				{doc?.title && (
					<h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
						{doc.title}
					</h1>
				)}
				{doc?.description && (
					<p className="text-lg text-muted-foreground">
						{doc.description}
					</p>
				)}
			</header>

			<Suspense fallback={<SuspenseFallback />}>
				<Content />
			</Suspense>
		</article>
	);
}

export const dynamicParams = false;
