import { cn } from "@/lib/utils";
import { type ContentBlock } from "@/types/blocks";

interface ContentProps {
	block: ContentBlock;
	className?: string;
}

export const Content = ({ block, className }: ContentProps) => {
	const { content, width = "default", background = "none" } = block;

	return (
		<section
			className={cn(
				"py-16",
				{
					"bg-muted": background === "gray",
					"bg-primary/5": background === "accent",
				},
				className
			)}
		>
			<div
				className={cn("container mx-auto px-4", {
					"max-w-7xl": width === "wide",
					"max-w-3xl": width === "narrow",
					"max-w-5xl": width === "default",
				})}
			>
				<div className="prose prose-gray dark:prose-invert max-w-none">
					{/* <LexicalRenderer content={content} /> */}
					<div dangerouslySetInnerHTML={{ __html: content }} />
				</div>
			</div>
		</section>
	);
};
