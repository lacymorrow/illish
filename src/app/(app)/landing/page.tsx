import { ExampleAppSection } from "@/app/(app)/(demo)/examples/_components/example-app-section";
import { FAQ } from "@/app/(app)/(landing)/_components/faq";
import { FeaturesCards } from "@/app/(app)/(landing)/_components/features-cards";
import { ParticlesHero } from "@/app/(app)/(landing)/_components/particles-hero";
import { PricingSection } from "@/app/(app)/(landing)/_components/pricing-section";
import { SocialDock } from "@/app/(app)/(landing)/_components/social-dock";
import { SocialMarquee } from "@/app/(app)/(landing)/_components/social-marquee";
import AnimatedButton from "@/components/buttons/animated-button/animated-button";
import { Icons } from "@/components/images/icons";
import { Link } from "@/components/primitives/link";
import {
	Section,
	SectionContent,
	SectionCopy,
	SectionHeader,
	SectionTitle,
} from "@/components/primitives/section";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import BlurFade from "@/components/ui/blur-fade";
import { buttonVariants } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { HoverInfo } from "@/components/ui/hover-info";
import Meteors from "@/components/ui/meteors";
import NumberTicker from "@/components/ui/number-ticker";
import { ProfileCard } from "@/components/ui/profile-card";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { SearchParams } from "@/types/utils";
import { ChevronRightIcon } from "lucide-react";
import PrimaryCta from "./_components/primary-cta";
import { SocialProof } from "./_components/social-proof";
const headings = [
	"Launch your app at light speed.",
	"Stop Futzing and Launch",
	"Stop Building and launch",
	"The fastest way to launch your app",
];

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const resolvedSearchParams = await searchParams;
	const example = resolvedSearchParams.example;

	return (
		<>
			<div className="flex flex-col gap-20 overflow-hidden">
				<ParticlesHero>
					<div
						className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl"
						aria-hidden="true"
					>
						<div
							className="aspect-[1155/678] w-[72.1875rem] animate-galaxy-shimmer bg-gradient-to-tr from-[#ff80b5] via-[#9089fc] to-[#ff80b5] opacity-0"
							style={{
								clipPath:
									"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
							}}
						/>
					</div>
					<div className="flex min-h-screen flex-col items-center justify-center mt-header">
						<div className="relative mx-auto flex min-h-64 max-w-[80rem] flex-col items-center justify-center gap-4 px-6 text-center md:px-8">
							{/* <GithubStarsButton starNumber={100} href={siteConfig.repo.url}>
								Star on GitHub
							</GithubStarsButton> */}

							<BlurFade delay={1} duration={1} inView>
								<Link href={siteConfig.repo.url}>
									<AnimatedGradientText className="bg-blue">
										🚀 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
										<span
											className={cn(
												"inline animate-gradient bg-gradient-to-r from-[#ff8aab] via-[#9c40ff] to-[#ff8aab] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent",
											)}
										>
											Introducing {siteConfig.name}
										</span>
										<ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
									</AnimatedGradientText>
								</Link>
							</BlurFade>
							<BlurFade delay={0.5} duration={0.5} inView>
								<h1 className="text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl">
									Launch your app at light speed.
								</h1>
							</BlurFade>

							<BlurFade delay={1} duration={1} inView>
								<div className="animate-fade-in mb-12 translate-y-[-1rem] text-balance text-lg tracking-tight text-gray-400 [--animation-delay:400ms] md:text-xl">
									A{" "}
									<HoverInfo
										content={
											<>
												<h4 className="mb-2 font-medium">Website in a Box</h4>
												<p className="mb-2 text-sm text-muted-foreground">
													{siteConfig.name} is a tech company-in-a-box, it is a
													website with tools and workflows to help you launch a
													using battle-tested tools, no matter if you are a
													developer, designer, or founder.
												</p>
											</>
										}
									>
										batteries-included stack
									</HoverInfo>{" "}
									for building apps fast.
									<br className="hidden md:block" />
								</div>
							</BlurFade>
						</div>

						<div className="mt-4 flex flex-col items-center justify-center gap-4">
							<BlurFade delay={2.5} duration={1} inView>
								<PrimaryCta />
							</BlurFade>
							<BlurFade delay={2.7} duration={1} inView>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<HoverInfo
										side="bottom"
										content={
											<div className="space-y-2">
												<p>
													{siteConfig.name} is a starter kit for building modern
													web apps. It includes:
												</p>
												<ul className="list-none space-y-1">
													<li>• Next.js 14 with App Router</li>
													<li>• Authentication & User Management</li>
													<li>• Database with Drizzle ORM</li>
													<li>• Beautiful UI with Shadcn</li>
													<li>• Payments with Lemon Squeezy</li>
												</ul>
											</div>
										}
									>
										<span>What's included?</span>
									</HoverInfo>
								</div>
							</BlurFade>
						</div>
						<Meteors number={4} />
					</div>
				</ParticlesHero>

				<ExampleAppSection
					current={example as string}
					className="hidden lg:flex"
				/>

				<SocialProof />

				<FeaturesCards />

				<Section className="relative">
					<SectionHeader>
						The <Cover>warp speed</Cover> workflow
					</SectionHeader>
					<SectionContent>
						<AnimatedButton>Get Started</AnimatedButton>
						<span className="text-sm text-gray-500">
							Not ready to buy?
							<Link
								href={routes.docs}
								className={buttonVariants({ variant: "link" })}
							>
								Subscribe for updates
							</Link>
						</span>
					</SectionContent>
				</Section>

				<Section className="relative">
					<SectionHeader>Choose your Launch Kit</SectionHeader>
					<SectionCopy>
						Launch faster with our production-ready starter kit. Save months of
						development time.
					</SectionCopy>
					<PricingSection />
					<div className="mt-8 text-center">
						<Link
							href="/pricing"
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"font-semibold",
							)}
						>
							Compare All Plans
						</Link>
					</div>
				</Section>

				<Section className="max-w-3xl">
					<SectionTitle>FAQ</SectionTitle>
					<SectionHeader>Frequently Asked Questions</SectionHeader>
					<SectionCopy>
						For other questions, please contact me on{" "}
						<Link href={routes.external.email}>email</Link> or{" "}
						<Link href={routes.external.x_follow}>X</Link>
					</SectionCopy>
					<SectionContent>
						<FAQ />
					</SectionContent>
					<SectionCopy className="text-sm text-gray-500">
						need something else?{" "}
						<Link
							href={routes.external.email}
							className={buttonVariants({ variant: "link", size: "sm" })}
						>
							ping me
						</Link>
					</SectionCopy>
				</Section>

				<Section>
					<SectionHeader>Built for developers</SectionHeader>
					<SectionCopy>
						{siteConfig.name} is built for developers by a developer.
					</SectionCopy>
					<SectionContent>
						<div className="mx-auto flex h-12 w-full max-w-md gap-4">
							<Icons.next />
							<Icons.react />
							<Icons.tailwind />
							<Icons.shadcn />
							<Icons.typescript />
						</div>
					</SectionContent>
				</Section>

				<Section>
					<ProfileCard />
				</Section>


				<Section>
					<SectionHeader>
						Trusted by more than <NumberTicker value={150} /> developers
					</SectionHeader>
					<SectionContent className="">
						<SocialMarquee />
					</SectionContent>
				</Section>

				<SocialDock className="fixed bottom-12 left-0 right-0 z-50" />
			</div>
		</>
	);
}
