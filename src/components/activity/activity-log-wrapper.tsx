"use client";

import { type ActivityLog } from "@/server/db/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ActivityLogExport } from "./activity-log-export";
import { ActivityLogFilters } from "./activity-log-filters";
import { ActivityLogTable } from "./activity-log-table";

interface ActivityLogWrapperProps {
	data: ActivityLog[];
	currentPage: number;
	totalPages: number;
	users: { id: string; name: string; email: string }[];
	teams: { id: string; name: string }[];
	resourceTypes: string[];
}

export function ActivityLogWrapper({
	data,
	currentPage,
	totalPages,
	users,
	teams,
	resourceTypes,
}: ActivityLogWrapperProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(params: Record<string, string | undefined>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString());

			// Remove undefined values and update existing ones
			Object.entries(params).forEach(([key, value]) => {
				if (value === undefined) {
					newSearchParams.delete(key);
				} else {
					newSearchParams.set(key, value);
				}
			});

			return newSearchParams.toString();
		},
		[searchParams],
	);

	const handleFilter = useCallback(
		(values: {
			search?: string;
			category?: string;
			severity?: string;
			startDate?: Date;
			endDate?: Date;
			userId?: string;
			teamId?: string;
			resourceType?: string;
		}) => {
			const queryString = createQueryString({
				search: values.search,
				category: values.category,
				severity: values.severity,
				startDate: values.startDate?.toISOString(),
				endDate: values.endDate?.toISOString(),
				userId: values.userId,
				teamId: values.teamId,
				resourceType: values.resourceType,
				page: "1", // Reset to first page when filters change
			});

			router.push(`${pathname}?${queryString}`);
		},
		[router, pathname, createQueryString],
	);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<ActivityLogFilters
				users={users}
				teams={teams}
				resourceTypes={resourceTypes}
				onFilter={handleFilter}
			/>

			{/* Export */}
			<ActivityLogExport data={data} />

			{/* Table */}
			<ActivityLogTable
				data={data}
				users={users}
				teams={teams}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</div>
	);
}
