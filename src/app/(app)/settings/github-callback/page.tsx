import { routes } from "@/config/routes";
import { logger } from "@/lib/logger";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { accounts, users } from "@/server/db/schema";
import { grantGitHubAccess } from "@/server/services/github/github-service";
import { Octokit } from "@octokit/rest";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * GitHub OAuth callback page
 * Handles the OAuth callback from GitHub and grants repository access
 */
export default async function GitHubCallbackPage() {
	const session = await auth();

	if (!session?.user?.id) {
		logger.warn("Unauthorized GitHub callback attempt");
		redirect(routes.auth.signIn);
	}

	try {
		logger.info("Starting GitHub callback flow", {
			userId: session.user.id,
			email: session.user.email,
		});

		// Get GitHub account details
		const account = await db.query.accounts.findFirst({
			where: and(
				eq(accounts.userId, session.user.id),
				eq(accounts.provider, "github"),
			),
			columns: {
				access_token: true,
				scope: true,
			},
		});

		if (!account?.access_token) {
			logger.error("No GitHub access token found", {
				userId: session.user.id,
			});
			redirect(
				`${routes.download}?error=github-connection-failed&reason=no-token`,
			);
		}

		logger.info("Found GitHub account", {
			userId: session.user.id,
			hasToken: true,
			scope: account.scope,
		});

		// Verify token scopes first
		const octokit = new Octokit({
			auth: account.access_token,
		});

		try {
			// Verify token and get user data in a single request
			const { data: githubUser, headers } = await octokit.rest.users.getAuthenticated();
			const scopes = headers["x-oauth-scopes"]?.split(", ") ?? [];
			const githubUsername = githubUser.login;

			logger.info("GitHub token scopes", {
				scopes,
				hasRepoScope: scopes.includes("repo"),
				githubUsername,
			});

			if (!scopes.includes("repo")) {
				logger.error("Missing required GitHub scope", {
					userId: session.user.id,
					requiredScope: "repo",
					currentScopes: scopes,
				});
				redirect(
					`${routes.download}?error=github-connection-failed&reason=insufficient-permissions`,
				);
			}

			logger.info("Got GitHub user details", {
				userId: session.user.id,
				githubUsername,
			});

			// Update user with GitHub username
			await db
				.update(users)
				.set({
					githubUsername,
				})
				.where(eq(users.id, session.user.id));

			// Grant repository access
			try {
				await grantGitHubAccess({
					email: session.user.email ?? "",
					githubUsername,
					accessToken: account.access_token,
				});

				logger.info("GitHub access granted successfully", {
					userId: session.user.id,
					githubUsername,
				});

				// Redirect to download page on success
				redirect(routes.download);
			} catch (err) {
				const error = err as Error;
				logger.error("Failed to grant GitHub access", {
					error,
					userId: session.user.id,
					githubUsername,
					errorMessage: error.message,
				});

				let reason = "unknown";
				if (error.message.includes("repo scope")) {
					reason = "insufficient-permissions";
				} else if (error.message.includes("Not Found")) {
					reason = "repository-not-found";
				} else if (error.message.includes("Bad credentials")) {
					reason = "invalid-token";
				}

				redirect(
					`${routes.download}?error=github-connection-failed&reason=${reason}`,
				);
			}
		} catch (err) {
			const error = err as Error;
			logger.error("Failed to verify GitHub token", {
				error,
				userId: session.user.id,
				errorMessage: error.message,
			});

			// If we get a 401 error, the token is invalid
			if (error.message.includes("Bad credentials")) {
				// Delete the invalid token from the database
				await db
					.delete(accounts)
					.where(
						and(
							eq(accounts.userId, session.user.id),
							eq(accounts.provider, "github"),
						),
					);

				redirect(
					`${routes.download}?error=github-connection-failed&reason=invalid-token`,
				);
			}

			redirect(
				`${routes.download}?error=github-connection-failed&reason=token-verification-failed`,
			);
		}
	} catch (err) {
		const error = err as Error;
		// Don't log NEXT_REDIRECT errors
		if (error.message !== "NEXT_REDIRECT") {
			logger.error("Error in GitHub callback", {
				error,
				userId: session.user.id,
				errorMessage: error.message,
				errorStack: error.stack,
			});
		}

		// Re-throw redirect errors
		if (error.message === "NEXT_REDIRECT") {
			throw error;
		}

		redirect(
			`${routes.download}?error=github-connection-failed&reason=unexpected-error`,
		);
	}
}
