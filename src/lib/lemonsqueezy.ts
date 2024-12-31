import { env } from "@/env";
import { logger } from "@/lib/logger";
import crypto from "crypto";
// src/config/lemonsqueezy.ts
import { db } from "@/server/db";
import {
	type NewPlan,
	type User,
	payments,
	plans,
	webhookEvents,
} from "@/server/db/schema";
import { webhookHasMeta } from "@/types/lemonsqueezy";
import {
	type Variant,
	getProduct,
	lemonSqueezySetup,
	listOrders,
	listProducts,
	listVariants,
} from "@lemonsqueezy/lemonsqueezy.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export interface PaymentData {
	id: string;
	orderId: string;
	userEmail: string;
	userName: string | null;
	amount: number;
	status: "paid" | "refunded" | "pending";
	productName: string;
	purchaseDate: Date;
}

// Configuration
const configureLemonSqueezy = (): void => {
	if (!env?.LEMONSQUEEZY_API_KEY) {
		logger.error("LEMONSQUEEZY_API_KEY is not set in the environment.");
		return;
	}
	lemonSqueezySetup({ apiKey: env.LEMONSQUEEZY_API_KEY });
};

// Initialize on import
configureLemonSqueezy();

/**
 * Fetches orders for a specific email from Lemon Squeezy
 */
export const getOrdersByEmail = async (email: string) => {
	try {
		const response = await listOrders({
			filter: {
				userEmail: email,
			},
		});

		if (!response || !Array.isArray(response.data)) {
			return [];
		}

		return response.data;
	} catch (error) {
		console.error("Error fetching orders by email:", error);
		return [];
	}
};

/**
 * Fetches all orders from Lemon Squeezy
 */
export const getAllOrders = async () => {
	try {
		const response = await listOrders({});

		if (!response || !Array.isArray(response.data?.data)) {
			return [];
		}

		return response.data.data.map((order) => ({
			id: order.id,
			orderId: order.attributes.identifier,
			userEmail: order.attributes.user_email ?? "Unknown",
			userName: order.attributes.user_name,
			amount: order.attributes.total / 100,
			status: order.attributes.status as "paid" | "refunded" | "pending",
			productName:
				order.attributes.first_order_item.variant_name ?? "Unknown Product",
			purchaseDate: new Date(order.attributes.created_at),
			attributes: order.attributes,
		}));
	} catch (error) {
		console.error("Error fetching all orders:", error);
		return [];
	}
};

export const getPaymentStatusByEmail = async (
	email: string,
): Promise<boolean> => {
	try {
		const orders = await listOrders({
			filter: {
				userEmail: email,
			},
		});

		console.log("getPaymentStatusByEmail", orders.data);

		return (
			orders.data?.data?.some((order) => order.attributes.status === "paid") ??
			false
		);
	} catch (error) {
		console.error("Error checking payment status:", error);
		return false;
	}
};

export const getPaymentStatus = async (userId: string): Promise<boolean> => {
	try {
		// Check the payment status in your database first
		const payment = await db.query.payments.findFirst({
			where: eq(payments.userId, userId),
		});

		if (payment) return true;

		// If not found in the database, check with Lemon Squeezy
		const user = await db.query.users.findFirst({
			where: eq(payments.userId, userId),
		});

		if (!user?.email) return false;

		const hasPaid = await getPaymentStatusByEmail(user.email);

		// Optionally, update your database with the new status
		if (hasPaid) {
			await db.insert(payments).values({
				userId,
				status: "completed",
			});
		}

		return hasPaid;
	} catch (error) {
		console.error("Error checking payment status:", error);
		return false;
	}
};

// Product-related functions
export const fetchProductVariants = async (productId: string) => {
	const response = await listVariants({
		filter: { productId },
	});

	return response?.data?.data ?? [];
};

export const fetchLemonSqueezyProducts = async () => {
	const response = await listProducts({});
	return response.data ?? [];
};

/**
 * This action will sync the product variants from Lemon Squeezy with the
 * Plans database model.
 */
export const syncPlans = async () => {
	// Fetch all the variants from the database.
	const productVariants: NewPlan[] = await db.select().from(plans);

	// Helper function to add a variant to the productVariants array and sync it with the database.
	async function _addVariant(variant: NewPlan) {
		// Sync the variant with the plan in the database.
		await db
			.insert(plans)
			.values(variant)
			.onConflictDoUpdate({ target: plans.variantId, set: variant });

		productVariants.push(variant);
	}

	// Fetch products from the Lemon Squeezy store.
	const products = await listProducts({
		filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
		include: ["variants"],
	});

	// Loop through all the variants.
	const allVariants = products.data?.included as Variant["data"][] | undefined;

	if (allVariants) {
		for (const v of allVariants) {
			const variant = v.attributes;

			// Skip draft variants
			if (variant.status === "draft") {
				continue;
			}

			// Fetch the Product name.
			const productName =
				(await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

			const priceString = variant.price?.toString() ?? "";

			await _addVariant({
				name: variant.name,
				description: variant.description,
				price: priceString,
				productId: variant.product_id,
				productName,
				variantId: Number.parseInt(v.id),
				sort: variant.sort,
			});
		}
	}

	revalidatePath("/");

	return productVariants;
};

/**
 * This action will store a webhook event in the database.
 * @param eventName - The name of the event.
 * @param body - The body of the event.
 */
export async function storeWebhookEvent(eventName: string, body: any) {
	const id = crypto.randomInt(100000000, 1000000000);

	const returnedValue = await db
		.insert(webhookEvents)
		.values({
			id,
			eventName,
			processed: false,
			body,
		})
		.onConflictDoNothing({ target: webhookEvents.id })
		.returning();

	return returnedValue[0];
}

/**
 * This action will process a webhook event in the database.
 */
export async function processWebhookEvent(webhookEvent: any) {
	const dbwebhookEvent = await db
		.select()
		.from(webhookEvents)
		.where(eq(webhookEvents.id, webhookEvent.id));

	if (dbwebhookEvent.length < 1) {
		throw new Error(
			`Webhook event #${webhookEvent.id} not found in the database.`,
		);
	}

	const eventBody = webhookEvent.body;

	if (webhookHasMeta(eventBody)) {
		// Handle events related to product variants
		if (webhookEvent.eventName.startsWith("variant_")) {
			// Implement logic for handling variant events
		}

		// Update the webhook event in the database.
		await db
			.update(webhookEvents)
			.set({
				processed: true,
			})
			.where(eq(webhookEvents.id, webhookEvent.id));
	}
}

/**
 * Fetches all users with their payment status from both the database and Lemon Squeezy
 * This is used in the admin dashboard to display user payment information
 */
export const getUsersWithPayments = async () => {
	try {
		// Get all users from the database
		const allUsers = await db.query.users.findMany();

		// Get all payments from the database
		const dbPayments = await db.query.payments.findMany();

		// Get all orders from Lemon Squeezy
		const lemonSqueezyOrders = await getAllOrders();

		// Map users to include their payment status
		const usersWithPayments = await Promise.all(
			allUsers.map(async (user: User) => {
				// Check if user has a payment record in our database
				const dbPayment = dbPayments.find((p) => p.userId === user.id);

				// Check if user has any orders in Lemon Squeezy
				const userOrders = lemonSqueezyOrders.filter(
					(order) =>
						order.attributes.user_email?.toLowerCase() ===
						user.email.toLowerCase(),
				);

				const hasPaid =
					dbPayment !== undefined ||
					userOrders.some((order) => order.attributes.status === "paid");

				// Get the last purchase date
				const sortedOrders = [...userOrders].sort(
					(a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime(),
				);
				const lastPurchaseDate = sortedOrders[0]?.purchaseDate ?? null;

				// Map orders to Purchase type
				const purchases = userOrders.map((order) => ({
					id: order.id,
					orderId: order.orderId,
					amount: order.amount,
					status: order.status,
					productName: order.productName,
					purchaseDate: order.purchaseDate,
				}));

				return {
					id: user.id,
					name: user.name ?? "Unknown",
					email: user.email,
					createdAt: user.emailVerified ?? new Date(),
					hasPaid,
					lastPurchaseDate,
					totalPurchases: userOrders.length,
					purchases,
				};
			}),
		);

		return usersWithPayments;
	} catch (error) {
		console.error("Error fetching users with payments:", error);
		return [];
	}
};

/**
 * Fetches all payments with associated user data from both the database and Lemon Squeezy
 * This is used in the admin dashboard to display payment information
 */
export const getPaymentsWithUsers = async () => {
	try {
		// Get all users from the database for mapping
		const allUsers = await db?.query.users.findMany();
		console.log("allUsers", allUsers);

		// Get all orders from Lemon Squeezy
		const lemonSqueezyOrders = await getAllOrders();
		console.log("lemonSqueezyOrders", lemonSqueezyOrders);

		// Map orders to PaymentData type
		const payments: PaymentData[] = lemonSqueezyOrders.map((order) => ({
			id: order.id,
			orderId: order.orderId,
			userEmail: order.userEmail,
			userName: order.userName,
			amount: order.amount,
			status: order.status,
			productName: order.productName,
			purchaseDate: order.purchaseDate,
		}));

		// Sort by purchase date, most recent first
		return payments.sort(
			(a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime(),
		);
	} catch (error) {
		logger.error("Error fetching payments with users:", error);
		return [];
	}
};
