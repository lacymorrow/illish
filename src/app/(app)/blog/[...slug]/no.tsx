import { Badge } from '@/components/ui/badge';
import { getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

interface Props {
	params: {
		slug: string | string[];
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

	const posts = await getBlogPosts();
	const post = posts.find((post) => post.slug === slug);

	if (!post) {
		return {
			title: 'Post Not Found',
		};
	}

	return {
		title: `${post.title} | Shipkit Blog`,
		description: post.description,
	};
}

export const BlogPostPage = async ({ params }: Props) => {
	const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

	const posts = await getBlogPosts();
	const post = posts.find((post) => post.slug === slug);

	if (!post) {
		notFound();
	}

	return (
		<article className="container mx-auto py-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
					{post.description && (
						<p className="text-xl text-muted-foreground">{post.description}</p>
					)}
					{post.categories && post.categories.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{post.categories.map((category) => (
								<Badge key={category} variant="secondary">
									{category}
								</Badge>
							))}
						</div>
					)}
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						{post.author && <span>{post.author}</span>}
						{post.publishedAt && (
							<>
								<span>•</span>
								<time dateTime={post.publishedAt}>
									{formatDate(post.publishedAt)}
								</time>
							</>
						)}
					</div>
				</div>

				<div className="prose prose-neutral dark:prose-invert max-w-none">
					<MDXRemote source={post.content} />
				</div>
			</div>
		</article>
	);
};

export default BlogPostPage;
