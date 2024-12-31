"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import type { Log } from "@/types/logs";
import { logColumns } from "./columns";

interface LogTableProps {
	data: Log[];
	isLive?: boolean;
}

export const LogTable = ({ data, isLive = false }: LogTableProps) => {
	return (
		<DataTable
			columns={logColumns}
			data={data}
			filterColumn="message"
			className={isLive ? "min-h-[400px]" : undefined}
		/>
	);
};
