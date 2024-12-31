import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.name,
		short_name: siteConfig.name,
		description: siteConfig.description,
		start_url: routes.home,
		display: "standalone",
		background_color: siteConfig.metadata.themeColor.light,
		theme_color: siteConfig.metadata.themeColor.dark,
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
			{
				src: "/favicon/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/favicon/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
