import { DataTable } from "@/components/ui/data-table/data-table";
import { getUsersWithPayments } from "@/lib/lemonsqueezy";
import { columns } from "../_components/columns";

/**
 * Admin page component that displays a data table of users and their payment status
 */
export default async function AdminPage() {
	const users = await getUsersWithPayments();

	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-8 text-3xl font-bold">User Management</h1>
			<DataTable
				columns={columns}
				data={users}
				searchPlaceholder="Search users..."
			/>
		</div>
	);
}
