import { FAQ } from "@/app/(app)/(landing)/_components/faq";
import { FeaturesTable } from "@/app/(app)/(landing)/_components/features-table";

export default async function Features() {
	return (
		<div className="container mx-auto mt-header space-y-section py-16">
			<div className="mx-auto max-w-3xl text-center">
				<h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
				<p className="mb-8 text-xl text-muted-foreground">
					Compare our plans and find the perfect fit for your project
				</p>
			</div>

			{/* Feature Comparison Table */}
			<section className="mx-auto">
				<h2 className="mb-8 text-center text-2xl font-semibold">
					Feature Comparison
				</h2>

				<FeaturesTable />
			</section>

			{/* FAQ Section */}
			<section className="mx-auto max-w-3xl">
				<h2 className="mb-8 text-center text-2xl font-semibold">
					Frequently Asked Questions
				</h2>
				<FAQ />
			</section>
		</div>
	);
}
