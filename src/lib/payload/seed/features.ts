import { content } from "@/content/features/features-content";
import { payload } from "@/lib/payload/payload";

export const seedFeatures = async () => {
	try {
		// Clear existing data
		await payload?.delete({
			collection: "features",
			where: {
				id: {
					exists: true,
				},
			},
		});

		const features = content.map((feature, index) => ({
			...feature,
			order: index + 1,
		}));

		const createdFeatures = await Promise.all(
			features.map(async (feature) => {
				try {
					const created = await payload?.create({
						collection: "features",
						data: feature,
					});
					return created;
				} catch (error) {
					console.error(`Error creating feature: ${feature.name}`, error);
					throw error;
				}
			}),
		);

		console.info(`✅ Created ${createdFeatures.length} features`);
		return createdFeatures;
	} catch (error) {
		console.error("Error seeding features:", error);
		throw error;
	}
};
