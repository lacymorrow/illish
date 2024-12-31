import { Checkbox } from "@/components/ui/checkbox";
import type { Log } from "@/types/logs";
import type { ColumnDef } from "@tanstack/react-table";

export const logColumns: ColumnDef<Log>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "emoji",
		header: "",
		cell: ({ row }) => {
			const emoji = row.getValue("emoji");
			const prefix = row.getValue("prefix");
			return (
				<div className="truncate text-xl" title={prefix as string}>
					{emoji || "📝"}
				</div>
			);
		},
	},
	{
		accessorKey: "timestamp",
		header: "Timestamp",
		cell: ({ row }) => (
			<div
				className="truncate"
				title={new Date(row.getValue("timestamp")).toLocaleString()}
			>
				{new Date(row.getValue("timestamp")).toLocaleString("en-US", {
					hour12: false,
				})}
			</div>
		),
	},
	{
		accessorKey: "level",
		header: "Level",
		cell: ({ row }) => (
			<div
				className={`truncate font-medium ${row.getValue("level") === "error"
					? "text-destructive"
					: row.getValue("level") === "warn"
						? "text-warning"
						: "text-muted-foreground"
					}`}
			>
				{row.getValue("level")}
			</div>
		),
	},
	{
		accessorKey: "prefix",
		header: "Type",
		cell: ({ row }) => (
			<div className="truncate">
				{row.getValue("emoji") || row.getValue("prefix") || "—"}
			</div>
		),
	},
	{
		accessorKey: "message",
		header: "Message",
		cell: ({ row }) => (
			<div className="truncate" title={row.getValue("message")}>
				{row.getValue("message")}
			</div>
		),
	},
	{
		accessorKey: "metadata",
		header: "Metadata",
		cell: ({ row }) => {
			const metadata = row.getValue("metadata");
			if (!metadata) return "—";
			try {
				const parsedMetadata =
					typeof metadata === "string" ? JSON.parse(metadata) : metadata;
				const stringifiedMetadata = JSON.stringify(parsedMetadata);
				return (
					<div className="truncate" title={stringifiedMetadata}>
						{stringifiedMetadata}
					</div>
				);
			} catch (error) {
				return `Invalid JSON: ${metadata}`;
			}
		},
	},
	{
		id: "apiKey",
		header: "API Key",
		cell: ({ row }) => {
			const log = row.original;
			return (
				<div className="truncate" title={log.apiKey?.key}>
					{log.apiKey?.key?.slice(-8) || log.apiKeyId || "—"}
				</div>
			);
		},
	},
];
