"use client";

import { Link } from "@/components/primitives/link";
import { cn } from "@/lib/utils";

interface NavItem {
	href: string;
	title: string;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: NavItem[];
	pathname: string;
}

export function SidebarNav({
	className,
	items,
	pathname,
	...props
}: SidebarNavProps) {
	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className,
			)}
			{...props}
		>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						"justify-start rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
						pathname === item.href
							? "bg-accent text-accent-foreground"
							: "text-muted-foreground",
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
}
