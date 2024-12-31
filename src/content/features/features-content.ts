import type { Feature } from "@/types/feature";

type FeatureContent = Omit<Feature, "id" | "order">;

export const content: FeatureContent[] = [
	// Marketing Features (Core)
	{
		name: "Lightning Fast",
		description:
			"Built on Next.js 15 with React Server Components for incredible performance and instant page loads",
		category: "core",
		plans: ["bones", "muscles", "brains"],
		icon: "Zap",
	},
	{
		name: "Type-Safe",
		description:
			"End-to-end type safety with TypeScript, ensuring robust and maintainable code",
		plans: ["bones", "muscles", "brains"],
		category: "core",
		icon: "Shield",
	},
	{
		name: "Modern Stack",
		description:
			"Cutting-edge tech stack including Tailwind CSS, Shadcn/UI, and tRPC for a seamless development experience",
		category: "core",
		plans: ["bones", "muscles", "brains"],
		icon: "Layers",
	},
	{
		name: "AI-Powered",
		description:
			"Built-in AI capabilities with OpenAI integration for smart features and automation",
		category: "core",
		plans: ["brains"],
		icon: "Brain",
	},
	{
		name: "Secure",
		description:
			"Enterprise-grade security with Auth.js v5, rate limiting, and best practices built-in",
		category: "core",
		plans: ["brains"],
		icon: "Lock",
	},
	{
		name: "Developer Experience",
		description:
			"Exceptional DX with hot reload, type hints, and VS Code extensions for rapid development",
		category: "core",
		plans: ["bones", "muscles", "brains"],
		icon: "Code",
	},
	// Product Features
	{
		name: "Next.js 15 App Router",
		description:
			"Latest Next.js features including server components, streaming, and more",
		category: "dx",
		plans: ["bones", "muscles", "brains"],
		icon: "NextJs",
	},
	{
		name: "Tailwind & Shadcn/UI",
		description:
			"Beautiful, accessible components built with Radix UI and Tailwind CSS",
		category: "dx",
		plans: ["bones", "muscles", "brains"],
		icon: "Paintbrush",
	},
	{
		name: "Authentication",
		description:
			"Secure authentication with NextAuth.js v5 and multiple providers",
		category: "security",
		plans: ["bones", "muscles", "brains"],
		icon: "Lock",
	},
	{
		name: "Database & ORM",
		description: "PostgreSQL database with Drizzle ORM for type-safe queries",
		category: "backend",
		plans: ["muscles", "brains"],
		icon: "Database",
	},
];
