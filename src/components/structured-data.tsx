import { type Article, type WithContext } from "schema-dts";

interface StructuredDataProps {
	title: string;
	description: string;
	datePublished: string;
	dateModified: string;
	author: string;
	image: string;
}

export function ArticleStructuredData({
	title,
	description,
	datePublished,
	dateModified,
	author,
	image,
}: StructuredDataProps) {
	const structuredData: WithContext<Article> = {
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: title,
		description: description,
		image: image,
		datePublished,
		dateModified,
		author: {
			"@type": "Organization",
			name: author,
		},
		publisher: {
			"@type": "Organization",
			name: "ShipKit",
			logo: {
				"@type": "ImageObject",
				url: "https://shipkit.io/logo.png",
			},
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

interface BreadcrumbStructuredDataProps {
	items: {
		name: string;
		item: string;
	}[];
}

export function BreadcrumbStructuredData({
	items,
}: BreadcrumbStructuredDataProps) {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `https://shipkit.io${item.item}`,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}

interface FAQStructuredDataProps {
	questions: {
		question: string;
		answer: string;
	}[];
}

export function FAQStructuredData({ questions }: FAQStructuredDataProps) {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: questions.map((q) => ({
			"@type": "Question",
			name: q.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: q.answer,
			},
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	);
}
