import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	// Collect public routes
	const publicRoutes = [
		routes.home,
		routes.docs,
		routes.launch,
		routes.faq,
		routes.features,
		routes.pricing,
		routes.tasks,
		routes.download,
		routes.getStarted,
		routes.terms,
		routes.privacy,
		routes.components,
	];

	// Add example routes
	const exampleRoutes = Object.values(routes.examples).filter(
		(route): route is string =>
			typeof route === "string" && route !== routes.examples.root,
	);

	// Combine all routes
	const allRoutes = [...publicRoutes, ...exampleRoutes];

	return allRoutes.map((route) => ({
		url: `${siteConfig.url}${route}`,
		lastModified: new Date(),
		// Higher priority for main pages
		priority: [
			routes.home,
			routes.docs,
			routes.features,
			routes.pricing,
		].includes(route)
			? 1
			: 0.8,
		// More frequent updates for dynamic content
		changeFrequency: [routes.docs, routes.features].includes(route)
			? "daily"
			: "weekly",
	}));
}
