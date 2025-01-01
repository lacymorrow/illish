"use client";

import { Link } from "@/components/primitives/link";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { logger } from "@/lib/logger";
import { useStackApp, useUser } from "@stackframe/stack";
import { Suspense } from "react";

function TasksContent() {
	const user = useUser();
	const stackApp = useStackApp();

	logger.info("Rendering TasksPage");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="mb-4 text-3xl font-bold">Welcome to Task Manager</h1>
			<p className="mb-4">Please sign in to manage your tasks</p>
			{user ? (
				<Link href={routes.tasks} className={buttonVariants()}>
					Proceed to Dashboard
				</Link>
			) : (
				<Link href={stackApp.urls.signIn} className={buttonVariants()}>
					Sign in
				</Link>
			)}
		</div>
	);
}

export default function TasksPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen animate-pulse flex-col items-center justify-center">
					<div className="mb-4 h-8 w-64 rounded bg-gray-200 dark:bg-gray-700" />
					<div className="mb-4 h-32 w-full max-w-md rounded-lg bg-gray-200 dark:bg-gray-700" />
					<div className="mb-4 h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
					<div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
				</div>
			}
		>
			<TasksContent />
		</Suspense>
	);
}
