import { SubscribeForm } from "@/app/(app)/(landing)/_components/SubscribeForm";
import { Attribution } from "@/components/blocks/attribution";
import { Balancer } from "@/components/primitives/balancer";
import { Link } from "@/components/primitives/link";
import { buttonVariants } from "@/components/ui/button";

export default function Page() {
	return (
		<>
			<div className="container absolute inset-0 flex flex-col items-center justify-start p-16 gap-2xl">
				<Balancer className="text-[100px] font-bold"><span className="font-serif">Bones Stack</span></Balancer>
				<p className="text-lg">Build apps fast with Shadcn/UI. Features Next.js v15, Tailwind CSS v4, and full AI agent support.</p>

				<div className="flex flex-col md:flex-row gap-md mb-10">
					<Link href={"https://github.com/shipkit-io/bones"} className={buttonVariants({ variant: "outline", size: "lg" })}>Learn More</Link>
					<Link href={"https://shipkit.io"} className={buttonVariants({ variant: "default", size: "lg" })}>Get Started</Link>
				</div>

				<SubscribeForm />

				<div className="flex flex-col md:flex-row gap-md mt-auto text-sm items-center">
					Want to see your users logs in real-time? <Link href={"https://log.bones.sh"} className={buttonVariants({ variant: "link", size: "sm" })}>Check out Log Bones</Link>
				</div>
			</div>
			<Attribution variant="popover" />
		</>
	);
}
