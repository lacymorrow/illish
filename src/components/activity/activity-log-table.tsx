"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type ActivityCategoryType,
	type ActivitySeverityType,
} from "@/server/constants/activity-log";
import { type ActivityLog } from "@/server/db/schema";
import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	AlertCircle,
	AlertTriangle,
	ArrowUpDown,
	Info,
	MoreHorizontal,
	User,
	Users
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface ActivityLogTableProps {
	data: ActivityLog[];
	users: { id: string; name: string; email: string }[];
	teams: { id: string; name: string }[];
	currentPage: number;
	totalPages: number;
}

const getSeverityIcon = (severity: ActivitySeverityType) => {
	switch (severity) {
		case "critical":
			return <AlertCircle className="h-4 w-4 text-destructive" />;
		case "error":
			return <AlertCircle className="h-4 w-4 text-destructive" />;
		case "warning":
			return <AlertTriangle className="text-warning h-4 w-4" />;
		case "info":
		default:
			return <Info className="h-4 w-4 text-muted-foreground" />;
	}
};

export function ActivityLogTable({
	data,
	users,
	teams,
	currentPage,
	totalPages,
}: ActivityLogTableProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = useMemo<ColumnDef<ActivityLog>[]>(
		() => [
			{
				accessorKey: "timestamp",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
						>
							Timestamp
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const timestamp = new Date(row.getValue("timestamp"));
					return (
						<div className="flex flex-col">
							<span>{timestamp.toLocaleDateString()}</span>
							<span className="text-xs text-muted-foreground">
								{timestamp.toLocaleTimeString()}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "severity",
				header: "Severity",
				cell: ({ row }) => {
					const severity = row.getValue("severity") as ActivitySeverityType;
					return (
						<div className="flex items-center gap-2">
							{getSeverityIcon(severity)}
							<Badge
								variant={
									severity === "critical" || severity === "error"
										? "destructive"
										: severity === "warning"
											? "warning"
											: "default"
								}
							>
								{severity}
							</Badge>
						</div>
					);
				},
			},
			{
				accessorKey: "category",
				header: "Category",
				cell: ({ row }) => {
					const category = row.getValue("category") as ActivityCategoryType;
					return <Badge variant="outline">{category}</Badge>;
				},
			},
			{
				accessorKey: "action",
				header: "Action",
				cell: ({ row }) => {
					const action = row.getValue("action");
					return (
						<Badge variant="outline" className="font-mono">
							{action}
						</Badge>
					);
				},
			},
			{
				accessorKey: "details",
				header: "Details",
				cell: ({ row }) => row.getValue("details") || "-",
			},
			{
				accessorKey: "userId",
				header: "User",
				cell: ({ row }) => {
					const userId = row.getValue("userId") as string;
					const user = users.find((u) => u.id === userId);
					return user ? (
						<div className="flex items-center gap-2">
							<User className="h-4 w-4" />
							<div className="flex flex-col">
								<span>{user.name || user.email}</span>
								{user.name && (
									<span className="text-xs text-muted-foreground">
										{user.email}
									</span>
								)}
							</div>
						</div>
					) : (
						"-"
					);
				},
			},
			{
				accessorKey: "teamId",
				header: "Team",
				cell: ({ row }) => {
					const teamId = row.getValue("teamId") as string;
					const team = teams.find((t) => t.id === teamId);
					return team ? (
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							<span>{team.name}</span>
						</div>
					) : (
						"-"
					);
				},
			},
			{
				accessorKey: "resourceType",
				header: "Resource Type",
				cell: ({ row }) => {
					const resourceType = row.getValue("resourceType");
					return resourceType ? (
						<Badge variant="outline">{resourceType}</Badge>
					) : (
						"-"
					);
				},
			},
			{
				accessorKey: "metadata",
				header: "Metadata",
				cell: ({ row }) => {
					const metadata = row.getValue("metadata");
					if (!metadata) return "-";
					try {
						const parsed = JSON.parse(metadata as string);
						return (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Metadata</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{Object.entries(parsed).map(([key, value]) => (
										<DropdownMenuItem key={key}>
											<span className="font-mono text-xs">
												{key}: {JSON.stringify(value)}
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						);
					} catch {
						return "-";
					}
				},
			},
		],
		[users, teams],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	// Handle pagination
	const handlePageChange = (page: number) => {
		const newSearchParams = new URLSearchParams(searchParams?.toString());
		newSearchParams.set("page", page.toString());
		router.push(`${pathname}?${newSearchParams.toString()}`);
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No activity logs found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between space-x-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</Button>
				<div className="text-sm text-muted-foreground">
					Page {currentPage} of {totalPages}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
