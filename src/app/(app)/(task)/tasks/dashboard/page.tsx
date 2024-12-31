import TaskList from "@/app/(app)/(task)/task-list";
import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { routes } from "@/config/routes";
import { auth } from "@/server/auth";
import { UserButton } from "@stackframe/stack";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function DashboardContent() {
	const session = await auth();
	if (!session) {
		redirect(routes.home);
	}

	return (
		<>
			<AppSidebar />
			<main className="flex flex-1 flex-col p-4 transition-all duration-300 ease-in-out">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Your Dashboard</h1>
					<UserButton />
				</div>
				<p className="mb-4">Welcome, {session.user.name ?? "anonymous user"}</p>
				<div className="rounded-md border-2 border-dashed p-4">
					<TaskList />
				</div>
				<SidebarTrigger />
			</main>
		</>
	);
}

export default function DashboardPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-full animate-pulse flex-col p-4">
					<div className="mb-4 flex items-center justify-between">
						<div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
						<div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
					</div>
					<div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
					<div className="rounded-md border-2 border-dashed p-4">
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-16 rounded bg-gray-200 dark:bg-gray-700"
								/>
							))}
						</div>
					</div>
				</div>
			}
		>
			<DashboardContent />
		</Suspense>
	);
}
