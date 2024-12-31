import { Link } from "@/components/primitives/link";
import type { Metadata } from "next";

import { Announcement } from "@/components/ui/announcement";
import { Button } from "@/components/ui/button";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/ui/page-header";
import { routes } from "@/config/routes";
import type React from "react";

export const metadata: Metadata = {
	title: "Examples",
	description: "Check out some examples app built using the components.",
};

interface ExamplesLayoutProps {
	children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
	return (
		<div className="container relative">
			<PageHeader>
				<Announcement />
				<PageHeaderHeading className="hidden md:block">
					Check out some examples
				</PageHeaderHeading>
				<PageHeaderHeading className="md:hidden">Examples</PageHeaderHeading>
				<PageHeaderDescription>
					Dashboard, cards, authentication. Some examples built using the
					components. Use this as a guide to build your own.
				</PageHeaderDescription>
				<PageActions>
					<Button asChild size="sm">
						<Link href={routes.docs}>Get Started</Link>
					</Button>
					<Button asChild size="sm" variant="ghost">
						<Link href={routes.components}>Components</Link>
					</Button>
				</PageActions>
			</PageHeader>
			<section>
				{children}
			</section>
		</div>
	);
}
