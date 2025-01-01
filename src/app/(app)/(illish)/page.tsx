import { AsciiCube } from "@/components/blocks/ascii-cube";
import { Balancer } from "@/components/primitives/balancer";

export default function Page() {
	return (
		<>
			<AsciiCube />

			<div className="container absolute inset-0 flex flex-col items-center justify-start p-16 gap-xl">
				<Balancer className="text-[100px] font-bold"><span className="font-serif">illish</span> is a <span className="font-serif">creative</span> web agency</Balancer>
				{/* <p className="text-lg">We are a creative web agency that specializes in creating beautiful websites.</p> */}

			</div>
		</>
	);
}
