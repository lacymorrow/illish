"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ActivityLog } from "@/server/db/schema";
import { Download } from "lucide-react";
import Papa from "papaparse";

interface ActivityLogExportProps {
	data: ActivityLog[];
}

export function ActivityLogExport({ data }: ActivityLogExportProps) {
	const handleExportCSV = () => {
		const csv = Papa.unparse(
			data.map((log) => ({
				Timestamp: new Date(log.timestamp).toLocaleString(),
				Category: log.category,
				Severity: log.severity,
				Action: log.action,
				Details: log.details || "",
				"User ID": log.userId || "",
				"Team ID": log.teamId || "",
				"Resource Type": log.resourceType || "",
				"Resource ID": log.resourceId || "",
				"IP Address": log.ipAddress || "",
				Metadata: log.metadata || "",
			})),
		);

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`activity-log-${new Date().toISOString()}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleExportJSON = () => {
		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], {
			type: "application/json;charset=utf-8;",
		});
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`activity-log-${new Date().toISOString()}.json`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Download className="h-4 w-4" />
					Export
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={handleExportCSV}>
					Export as CSV
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleExportJSON}>
					Export as JSON
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
