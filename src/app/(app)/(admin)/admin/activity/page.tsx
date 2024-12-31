import { ActivityLogWrapper } from "@/components/activity/activity-log-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActivityLogs } from "@/server/actions/activity-log-actions";
import { db } from "@/server/db";
import { teams, users } from "@/server/db/schema";
import { isNotNull } from "drizzle-orm";
import { Suspense } from "react";

export const metadata = {
	title: "Activity Log",
	description: "View and manage system activity logs",
};

// Loading component
const ActivityLogLoading = () => (
	<div className="space-y-4">
		<Skeleton className="h-8 w-full" />
		<Skeleton className="h-8 w-3/4" />
		<Skeleton className="h-8 w-1/2" />
	</div>
);

interface ActivityLogPageProps {
	searchParams: Promise<{
		search?: string;
		category?: string;
		severity?: string;
		startDate?: string;
		endDate?: string;
		userId?: string;
		teamId?: string;
		resourceType?: string;
		page?: string;
	}>;
}

async function ActivityLogContent({ searchParams }: ActivityLogPageProps) {
	const resolvedSearchParams = await searchParams;
	const currentPage = Number(resolvedSearchParams?.page) || 1;

	// Get activity logs with filters
	const { data: activities, pagination } = await getActivityLogs({
		page: currentPage,
		limit: 50,
		category: resolvedSearchParams.category,
		severity: resolvedSearchParams.severity,
		startDate: resolvedSearchParams.startDate
			? new Date(resolvedSearchParams.startDate)
			: undefined,
		endDate: resolvedSearchParams.endDate
			? new Date(resolvedSearchParams.endDate)
			: undefined,
		userId: resolvedSearchParams.userId,
		teamId: resolvedSearchParams.teamId,
		resourceType: resolvedSearchParams.resourceType,
		search: resolvedSearchParams.search ? { query: resolvedSearchParams.search } : undefined,
	});

	// Get users and teams for filters, filtering out null names
	const [allUsers, allTeams] = await Promise.all([
		db.select({
			id: users.id,
			name: users.name,
			email: users.email
		})
			.from(users)
			.where(isNotNull(users.name)) as Promise<{ id: string; name: string; email: string; }[]>,
		db.select({
			id: teams.id,
			name: teams.name
		})
			.from(teams)
			.where(isNotNull(teams.name)),
	]);

	// Get unique resource types from activities
	const resourceTypes = Array.from(
		new Set(
			activities
				.map((activity) => activity.resourceType)
				.filter((type): type is string => !!type),
		),
	);

	return (
		<ActivityLogWrapper
			data={activities}
			currentPage={currentPage}
			totalPages={pagination.totalPages}
			users={allUsers}
			teams={allTeams}
			resourceTypes={resourceTypes}
		/>
	);
}

export default function ActivityLogPage(props: ActivityLogPageProps) {
	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Activity Log</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={<ActivityLogLoading />}>
						<ActivityLogContent {...props} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}
