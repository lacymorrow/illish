import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", routes.admin.root],
		},
		sitemap: `${siteConfig.url}/sitemap.xml`,
	};
}
