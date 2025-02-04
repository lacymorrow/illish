import { Balancer } from "@/components/primitives/balancer";
import { Link } from "@/components/primitives/link";
import { siteConfig } from "@/config/site";
import BlobScene from "@/components/blocks/blob-scene";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Code2, Rocket, Sparkle, SparkleIcon, SparklesIcon, Zap } from "lucide-react";
import { IconRobotFace } from "@tabler/icons-react";

export default function Page() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Abstract Background */}
			<div className="absolute inset-0 z-0">
				<BlobScene />
			</div>

			{/* Content Layer */}
			<div className="relative z-10">
				<div className="container flex min-h-screen flex-col items-center justify-center px-4 py-16 md:px-6 lg:px-8">
					{/* Main Hero Content */}
					<div className="mx-auto max-w-4xl text-center">
						{/* Eyebrow text with gradient */}
						<p className="backdrop-blur-md mb-6 inline-block rounded-full bg-gradient-to-r from-background/80 via-background/90 to-background/80 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
							Your Vision, Amplified Through Code
						</p>

						{/* Main Heading */}
						<h1 className="animate-fadeDown mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
							<Balancer>
								Turn Your <span className="font-serif text-primary">Bold Ideas</span>{" "}
								Into Digital Reality
							</Balancer>
						</h1>

						{/* Subheading */}
						<p className="relative mb-8 text-lg sm:text-xl font-medium">
							<span className="absolute inset-0 blur-[5px] text-foreground/80 select-none" aria-hidden="true">
								<Balancer>
									We're not just developers – we're digital architects crafting tomorrow's web experiences today.
									Where innovation meets execution, and dreams become deployments.
								</Balancer>
							</span>
							<span className="relative text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">
								<Balancer>
									We're not just developers – we're digital architects crafting tomorrow's web experiences today.
									Where innovation meets execution, and dreams become deployments.
								</Balancer>
							</span>
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link className={buttonVariants({ variant: "outline", size: "lg" })} href="https://lacymorrow.com/work">
								Explore Our Success Stories
							</Link>
							<Link className={buttonVariants({ variant: "outline", size: "lg" })} href="https://lacymorrow.com/contact">
								Transform Your Business
								<SparklesIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</div>

						{/* Features Grid */}
						<div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
							<div className="rounded-lg border bg-background/80 p-4 backdrop-blur-md shadow-sm">
								<div className="flex items-center justify-center gap-2 mb-1">
									<Zap className="h-5 w-5 text-primary" />
									<h3 className="font-semibold text-foreground">Speed to Market</h3>
								</div>
								<p className="text-sm text-foreground/80">
									You launch faster with our battle-tested framework
								</p>
							</div>
							<div className="rounded-lg border bg-background/80 p-4 backdrop-blur-md shadow-sm">
								<div className="flex items-center justify-center gap-2 mb-1">
									<Code2 className="h-5 w-5 text-primary" />
									<h3 className="font-semibold text-foreground">Future-Proof Tech</h3>
								</div>
								<p className="text-sm text-foreground/80">
									Built on Next.js 15, ready for whatever tomorrow brings
								</p>
							</div>
							<div className="rounded-lg border bg-background/80 p-4 backdrop-blur-md shadow-sm">
								<div className="flex items-center justify-center gap-2 mb-1">
									<IconRobotFace className="h-5 w-5 text-primary" />
									<h3 className="font-semibold text-foreground">Turbo-charged Tools</h3>
								</div>
								<p className="text-sm text-foreground/80">
									Generate copy, images, and layouts from within your website
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
