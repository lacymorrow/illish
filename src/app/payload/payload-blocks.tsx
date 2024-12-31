import { type PageBlock } from "@/types/blocks";
import { Content } from "./content";
import { Features } from "./features";
import { Hero } from "./hero";
import { Testimonials } from "./testimonials";

interface BlockRendererProps {
	blocks: PageBlock[];
	className?: string;
}

const blockComponents = {
	hero: Hero,
	content: Content,
	features: Features,
	testimonials: Testimonials,
};

export const BlockRenderer = ({ blocks, className }: BlockRendererProps) => {
	return (
		<div className={className}>
			{blocks.map((block, index) => {
				const Component = blockComponents[block.blockType];
				if (!Component) return null;
				return <Component key={index} block={block} />;
			})}
		</div>
	);
};

export { Content } from "./content";
export { Features } from "./features";
export { Hero } from "./hero";
export { Testimonials } from "./testimonials";

