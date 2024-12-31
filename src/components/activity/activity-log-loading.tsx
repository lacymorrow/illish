"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ActivityLogLoading = () => (
	<div className="space-y-4">
		{/* Header loading state */}
		<div className="flex items-center justify-between">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-8 w-24" />
		</div>

		{/* Filters loading state */}
		<div className="flex flex-wrap gap-2">
			<Skeleton className="h-8 w-32" />
			<Skeleton className="h-8 w-32" />
			<Skeleton className="h-8 w-32" />
		</div>

		{/* Table loading state */}
		<div className="space-y-2">
			<Skeleton className="h-10 w-full" />
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-16 w-full" />
			))}
		</div>

		{/* Pagination loading state */}
		<div className="flex items-center justify-between pt-4">
			<Skeleton className="h-8 w-32" />
			<div className="flex gap-2">
				<Skeleton className="h-8 w-8" />
				<Skeleton className="h-8 w-8" />
				<Skeleton className="h-8 w-8" />
			</div>
		</div>
	</div>
);
