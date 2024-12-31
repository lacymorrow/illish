import crypto from "crypto";
// @see https://docs.lemonsqueezy.com/api/webhooks
// @see https://raw.githubusercontent.com/lmsqueezy/nextjs-billing/refs/heads/main/src/app/api/webhook/route.ts
import { storeWebhookEvent } from "@/lib/lemonsqueezy";
import { logger } from "@/lib/logger";
import {
	ActivityAction,
	ActivityCategory,
} from "@/server/constants/activity-log";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { logActivity } from "@/server/services/activity-logger";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const signature = request.headers.get("x-signature");
		console.log("Lemonsqueezy webhook: ", body);

		if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET || !signature) {
			logger.warn("Unauthorized webhook request", { signature });
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const hmac = crypto.createHmac(
			"sha256",
			process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
		);
		const digest = hmac.update(JSON.stringify(body)).digest("hex");

		if (signature !== digest) {
			logger.warn("Invalid signature for webhook", { signature, digest });
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const event = await storeWebhookEvent(body.meta.event_name, body);

		logger.info("Webhook event received", {
			eventName: body.meta.event_name,
			eventId: event?.id,
		});

		// Handle the event
		if (body.meta.event_name === "order_created") {
			const userEmail = body.data.attributes.user_email;
			const user = await db.query.users.findFirst({
				where: eq(users.email, userEmail),
			});

			if (user) {
				await logActivity({
					userId: user.id,
					action: ActivityAction.ORDER_CREATED,
					category: ActivityCategory.SALES,
					details: `Order created for ${userEmail}`,
					metadata: {
						orderId: body.data.id,
						productId: body.data.attributes.product_id,
					},
				});
			}

			// TODO: Implement order processing logic here
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		logger.error("Webhook error", { error });
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
