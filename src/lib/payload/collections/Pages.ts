import type { Page } from "@/payload-types";
import type { CollectionConfig } from "payload/types";
import { blocks } from "../../../app/payload/blocks/index";

/*
 * Pages Collection
 * This collection is used to create and manage landing pages
 * Each page can have a title, slug, meta information, and content blocks
 */
export const Pages: CollectionConfig = {
	slug: "pages",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "slug", "publishedAt"],
		preview: (doc: Page) => {
			return `${process.env.NEXT_PUBLIC_APP_URL}/preview/pages/${doc.slug}`;
		},
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			admin: {
				description: "The title of the page",
			},
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			admin: {
				description: "The URL-friendly slug for the page (e.g., 'about-us')",
			},
		},
		{
			name: "meta",
			type: "group",
			fields: [
				{
					name: "title",
					type: "text",
					admin: {
						description: "Override the default meta title",
					},
				},
				{
					name: "description",
					type: "textarea",
					admin: {
						description: "Brief description for search engines",
					},
				},
				{
					name: "image",
					type: "upload",
					relationTo: "media",
					admin: {
						description: "Social sharing image",
					},
				},
			],
		},
		{
			name: "layout",
			type: "blocks",
			required: true,
			blocks,
		},
		{
			name: "publishedAt",
			type: "date",
			admin: {
				description: "Date when this page was published",
				position: "sidebar",
			},
		},
	],
	timestamps: true,
};
