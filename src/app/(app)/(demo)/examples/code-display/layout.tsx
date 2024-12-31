interface CodeDisplayLayoutProps {
	children: React.ReactNode;
}

export default function CodeDisplayLayout({
	children,
}: CodeDisplayLayoutProps) {
	return (
		<div className="flex-1 overflow-hidden">
			<div className="h-full overflow-y-auto py-6">{children}</div>
		</div>
	);
}
