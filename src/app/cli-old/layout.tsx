import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";

import { RootLayout } from "@/components/layouts/root-layout";
import { siteConfig } from "@/config/site";
import Link from 'next/link'

export const metadata: Metadata = {
	title: {
		default: siteConfig.title,
		template: `%s - ${siteConfig.name}`,
	},
	metadataBase: new URL(siteConfig.url),
	description: siteConfig.description,
	keywords: ["Next.js", "React", "Tailwind CSS", "Server Components"],
	authors: [
		{
			name: siteConfig.creator.name,
			url: siteConfig.creator.url,
		},
	],
	creator: siteConfig.creator.name,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.title,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImage,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
		images: [siteConfig.ogImage],
		creator: siteConfig.creator.twitter,
	},
	appleWebApp: {
		capable: true,
		title: siteConfig.title,
		startupImage: [
			{
				url: "/apple-icon.png",
			},
		],
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<RootLayout>
			<div>
				<nav className="border-b">
					<div className="container mx-auto px-4">
						<div className="flex h-14 items-center space-x-4">
							<Link 
								href="/cli"
								className="text-sm font-medium transition-colors hover:text-primary"
							>
								Install
							</Link>
							<Link 
								href="/cli/registry"
								className="text-sm font-medium transition-colors hover:text-primary"
							>
								Registry
							</Link>
						</div>
					</div>
				</nav>
				<main>{children}</main>
			</div>
		</RootLayout>
	)
}
