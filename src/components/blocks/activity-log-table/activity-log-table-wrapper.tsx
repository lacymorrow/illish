"use client";

import { useDebounce } from "@/hooks/use-debounce";
import {
	getActivityLogs,
	searchActivityLogs,
} from "@/server/actions/activity-log-actions";
import { useEffect, useState } from "react";
import { ActivityLogTableClient } from "./activity-log-table-client";

interface ActivityLogTableWrapperProps {
	initialData?: Awaited<ReturnType<typeof getActivityLogs>>["data"];
}

export function ActivityLogTableWrapper({
	initialData = [],
}: ActivityLogTableWrapperProps) {
	const [data, setData] = useState(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	useEffect(() => {
		async function fetchLogs() {
			setIsLoading(true);
			try {
				if (debouncedSearchQuery) {
					const result = await searchActivityLogs(
						debouncedSearchQuery,
						currentPage,
					);
					setData(result.data);
				} else {
					const result = await getActivityLogs({ page: currentPage });
					setData(result.data);
				}
			} catch (error) {
				console.error("Failed to fetch logs:", error);
			} finally {
				setIsLoading(false);
			}
		}

		void fetchLogs();
	}, [debouncedSearchQuery, currentPage]);

	return (
		<ActivityLogTableClient
			data={data}
			isLoading={isLoading}
			currentPage={currentPage}
			onSearch={setSearchQuery}
			onPageChange={setCurrentPage}
		/>
	);
}
