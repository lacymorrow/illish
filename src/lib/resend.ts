import { env } from "@/env";
import { Resend } from "resend";

/**
 * Initialize Resend with API key if available, otherwise return null
 * This allows the application to build even if RESEND_API_KEY is not set
 */
export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
