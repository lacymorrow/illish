"use client";

import { Link } from "@/components/primitives/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Define the type for a pricing tier
export interface PricingTier {
	name: string;
	price: React.ReactNode;
	description: string;
	cta: string;
	highlighted?: boolean;
	disabled?: boolean;
	href?: string;
}

// Update the PricingSection component to accept tiers as a prop
interface PricingSectionProps {
	tiers: PricingTier[];
}

// Example configuration for pricing tiers
const pricingTiers: PricingTier[] = [
	{
		name: "Bones",
		price: "$29",
		description:
			"Perfect for individuals and small teams who just want to get started.",
		cta: `Get ${siteConfig.name} Bones`,
		href: "/signup?plan=bones",
	},
	{
		name: "Muscles",
		price: "$99",
		description: "Ideal for growing businesses and larger teams.",
		cta: `Get ${siteConfig.name} Muscles`,
		highlighted: true,
		href: "/signup?plan=muscles",
		disabled: true,
	},
	{
		name: "Brains",
		price: "$249",
		description:
			"Fully-featured, tailored solutions with pre-built integrations and building blocks for large-scale organizations. AI-workflows, etc.",
		cta: "Coming Soon",
		disabled: true,
	},
];

export function PricingSection({ tiers = pricingTiers }: PricingSectionProps) {
	return (
		<div className="grid gap-8 md:grid-cols-3">
			{tiers.map((tier) => (
				<Card
					key={tier.name}
					className={cn("flex flex-col", {
						"scale-105 border-primary shadow-lg": tier.highlighted,
					})}
				>
					<CardHeader>
						<CardTitle className="text-2xl">{tier.name}</CardTitle>
						<CardDescription className="text-sm">
							{tier.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<p className="mb-4 text-4xl font-bold">{tier.price}</p>
					</CardContent>
					<CardFooter>
						{tier.href ? (
							<Link
								href={tier.href}
								className={cn(
									buttonVariants({
										variant: tier.highlighted ? "default" : "outline",
									}),
									"w-full",
									{ "bg-primary hover:bg-primary/90": tier.highlighted },
								)}
								aria-disabled={tier.disabled}
								tabIndex={tier.disabled ? -1 : undefined}
							>
								{tier.cta}
							</Link>
						) : (
							<Button
								variant={tier.highlighted ? "default" : "outline"}
								className={cn("w-full", {
									"bg-primary hover:bg-primary/90": tier.highlighted,
								})}
								disabled={tier.disabled}
							>
								{tier.cta}
							</Button>
						)}
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
