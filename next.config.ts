import { FILE_UPLOAD_MAX_SIZE } from "@/config/file";
import { redirects } from "@/config/routes";
/**
 * Validate environment variables
 *
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { env } from "@/env";
import BuilderDevTools from "@builder.io/dev-tools/next";
import createMDX from "@next/mdx";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const config: NextConfig = {
	/*
	 * React configuration
	 */
	reactStrictMode: true,

	/*
	 * Webpack configuration for Monaco Editor
	 */
	webpack: (config, { isServer }) => {
		// Avoid SSR issues with Monaco Editor
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				module: false,
			};
		}
		return config;
	},

	/*
	 * Redirects are located in the `src/config/routes.ts` file
	 */
	redirects,
	/*
	 * Next.js configuration
	 */
	images: {
		remotePatterns: [
			{ hostname: "picsum.photos" }, // @dev: for testing
			{ hostname: "avatar.vercel.sh" }, // @dev: for testing
			{ hostname: "github.com" }, // @dev: for testing
			{ hostname: "images.unsplash.com" }, // @dev: for testing
			{ hostname: "2.gravatar.com" }, // @dev: for testing
			{ hostname: "avatars.githubusercontent.com" }, // @dev: github avatars
			{ hostname: "vercel.com" }, // @dev: vercel button
		],
	},

	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

	/*
	 * Lint configuration
	 */
	eslint: {
		/*
			!! WARNING !!
			* This allows production builds to successfully complete even if
			* your project has ESLint errors.
		*/
		ignoreDuringBuilds: true,
	},
	typescript: {
		/*
			!! WARNING !!
			* Dangerously allow production builds to successfully complete even if
			* your project has type errors.
		*/
		ignoreBuildErrors: true,
	},
	/*
	 * Logging configuration
	 * @see https://nextjs.org/docs/app/api-reference/next-config-js/logging
	 */
	logging: {
		fetches: {
			fullUrl: true, // This will log the full URL of the fetch request even if cached
			// hmrRefreshes: true,
		},
	},
	/*
	 * Experimental configuration
	 */
	experimental: {
		// mdxRs: true,
		// mdxRs: {
		// 	jsxRuntime: "automatic",
		// 	jsxImportSource: "jsx-runtime",
		// 	mdxType: "gfm",
		// },
		nextScriptWorkers: true,
		serverActions: {
			bodySizeLimit: FILE_UPLOAD_MAX_SIZE,
		},
		webVitalsAttribution: ["CLS", "LCP", "TTFB", "FCP", "FID"],
	},
	/*
	 * Miscellaneous configuration
	 */
	devIndicators: {
		buildActivityPosition: "bottom-right" as const,
	},
	// @see https://nextjs.org/docs/app/api-reference/next-config-js/bundlePagesRouterDependencies
	bundlePagesRouterDependencies: true,
	compiler: {
		// Remove all console logs
		// removeConsole: true
		// Remove console logs only in production, excluding error logs
		// removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
	},
};

let nextConfig = config;

/*
 * Configurations
 * Order matters!
 */

// Builder config
nextConfig =
	!env?.NEXT_PUBLIC_BUILDER_API_KEY || env?.DISABLE_BUILDER === "true"
		? config
		: BuilderDevTools()(config);

// Payload config
nextConfig =
	!env?.DATABASE_URL || env?.DISABLE_PAYLOAD === "true"
		? nextConfig
		: withPayload(nextConfig);

// const withPWA = pwa({
// 	dest: "public",
// 	// disable: process.env.NODE_ENV === "development",
// 	// register: true,
// 	// skipWaiting: true,
// });
// nextConfig = withPWA(nextConfig);

// MDX config
const withMDX = createMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [
			[
				// @ts-expect-error
				"remark-frontmatter",
				{
					type: "yaml",
					marker: "-",
				},
			],
			// @ts-expect-error
			["remark-mdx-frontmatter", {}],
		],
		rehypePlugins: [],
	},
});
nextConfig = withMDX(nextConfig);

// Logflare config
// /** @type {import("./withLogFlare.js").LogFlareOptions} */
// const logFlareOptions = {
// 	apiKey: "sk_tk4XH5TBd76VPKWEkDQ7706z9WReI7sQK9bSelC5", // Move to env
// 	prefix: "[LogFlare]",
// 	logLevel: process.env.NODE_ENV === "production" ? "log" : "debug",
// 	logToFile: true,
// 	logFilePath: "./logflare.log",
// 	useColors: true,
// 	useEmoji: true,
// 	colors: {
// 		// Override default colors if needed
// 		error: "\x1b[41m\x1b[37m", // White text on red background
// 	},
// 	emojis: {
// 		// Override default emojis if needed
// 		debug: "🔍",
// 	},
// };

// nextConfig = withLogFlare(logFlareOptions)(nextConfig);

export default nextConfig;
