import { AsciiCube } from "@/components/blocks/ascii-cube";
import { Balancer } from "@/components/primitives/balancer";
import { Link } from "@/components/primitives/link";
import { siteConfig } from "@/config/site";

export default function Page() {
	return (
		<>
			<AsciiCube />

			<div className="container absolute inset-0 flex flex-col items-center justify-start p-16 gap-xl">
				<Balancer className="text-[100px] font-bold"><span className="font-serif">illish</span> is a <span className="font-serif">Next.js</span> accelerator.</Balancer>
				<p className="text-lg">We know Next.js. We know Tailwind. We know shadcn.</p>
				<p className="text-lg">We know how to build your next project. <Link href={`mailto:${siteConfig.email.support}`}>Learn how</Link></p>
			</div>
		</>
	);
}
