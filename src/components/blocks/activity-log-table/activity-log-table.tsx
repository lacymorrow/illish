import {
	getActivityLogs,
	searchActivityLogs,
} from "@/server/actions/activity-log-actions";
import { ActivityLogTableClient } from "./activity-log-table-client";

interface ActivityLogTableProps {
	initialData?: Awaited<ReturnType<typeof getActivityLogs>>["data"];
	searchQuery?: string;
	page?: number;
}

export async function ActivityLogTable({
	initialData = [],
	searchQuery = "",
	page = 1,
}: ActivityLogTableProps) {
	// Fetch data on the server
	let data = initialData;

	if (searchQuery) {
		const result = await searchActivityLogs(searchQuery, page);
		data = result.data;
	} else if (!initialData.length) {
		const result = await getActivityLogs({ page });
		data = result.data;
	}

	return <ActivityLogTableClient data={data} currentPage={page} />;
}
