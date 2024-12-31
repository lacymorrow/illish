"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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
import type { ActivityLog } from "@/server/db/schema";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, User, Users } from "lucide-react";
import { useState } from "react";

interface ActivityLogTableClientProps {
	data: ActivityLog[];
	currentPage: number;
}

const columns: ColumnDef<ActivityLog>[] = [
	{
		accessorKey: "timestamp",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Timestamp
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const timestamp = row.getValue("timestamp") as Date;
			return new Date(timestamp).toLocaleString();
		},
	},
	{
		accessorKey: "action",
		header: "Action",
		cell: ({ row }) => {
			const action = row.getValue("action") as string;
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
			const userId = row.getValue("userId") as string | null;
			return userId ? (
				<div className="flex items-center gap-2">
					<User className="h-4 w-4" />
					<span className="font-mono text-xs">{userId}</span>
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
			const teamId = row.getValue("teamId") as string | null;
			return teamId ? (
				<div className="flex items-center gap-2">
					<Users className="h-4 w-4" />
					<span className="font-mono text-xs">{teamId}</span>
				</div>
			) : (
				"-"
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const log = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => {
								if (log.details) {
									navigator?.clipboard?.writeText(log.details);
								}
							}}
						>
							Copy details
						</DropdownMenuItem>
						{log.metadata && (
							<DropdownMenuItem
								onClick={() => {
									navigator?.clipboard?.writeText(log.metadata || "");
								}}
							>
								Copy metadata
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export function ActivityLogTableClient({
	data,
	currentPage,
}: ActivityLogTableClientProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div>
			<div className="flex items-center py-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="relative rounded-md border">
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
			</div>
		</div>
	);
}
