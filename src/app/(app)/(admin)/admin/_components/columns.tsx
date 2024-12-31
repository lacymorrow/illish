"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Purchase } from "./user-drawer";

const formatDate = (date: Date) => {
	return format(date, "MMM d, yyyy");
};

export interface UserData {
	id: string;
	email: string;
	name: string | null;
	createdAt: Date;
	hasPaid: boolean;
	lastPurchaseDate?: Date | null;
	totalPurchases: number;
	purchases?: Purchase[];
}

export const columns: ColumnDef<UserData>[] = [
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => formatDate(row.original.createdAt),
	},
	{
		accessorKey: "hasPaid",
		header: "Payment Status",
		cell: ({ row }) => (
			<Badge variant={row.original.hasPaid ? "default" : "secondary"}>
				{row.original.hasPaid ? "Paid" : "Not Paid"}
			</Badge>
		),
	},
	{
		accessorKey: "lastPurchaseDate",
		header: "Last Purchase",
		cell: ({ row }) =>
			row.original.lastPurchaseDate
				? formatDate(row.original.lastPurchaseDate)
				: "N/A",
	},
	{
		accessorKey: "totalPurchases",
		header: "Total Purchases",
	},
];
